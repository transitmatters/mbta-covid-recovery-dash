import React, { useMemo, useState } from "react";
import classNames from "classnames";
import { TiCancel } from "react-icons/ti";
import { Pie, ResponsivePie } from "@nivo/pie";
import { ResponsiveLine } from "@nivo/line";
import { linearGradientDef } from "@nivo/core";

import { RouteData, ServiceDay, ServiceLevels, ServiceRegime, Time } from "types";
import { routeColors } from "colors";
import { getTickValues, getTimeSeriesForTph, HOUR, stringify12Hour } from "time";

import styles from "./RouteCard.module.scss";
import { route } from "next/dist/next-server/server/router";

type Props = {
    routeData: RouteData;
};

const fakeData = [{ value: 1 }, { value: 0 }];

const lineTickValues = getTickValues(2);

const linearGradient = linearGradientDef("gradient", [
    { offset: 0, color: "inherit" },
    { offset: 100, color: "inherit", opacity: 0 },
]);

const getHighestTphValue = (routeData: RouteData) => {
    let max = 0;
    Object.values(routeData.serviceRegimes).forEach((regime) => {
        Object.values(regime).forEach((serviceLevel) => {
            max = Math.max(max, ...serviceLevel.tripsPerHour);
        });
    });
    return max;
};

const RouteCard = (props: Props) => {
    const { routeData } = props;
    const { title, subtitle, routeKind, serviceFraction, serviceRegimes } = routeData;
    const color = routeColors[routeKind];
    const [serviceDay] = useState<ServiceDay>("weekday");
    const highestTphValue = useMemo(() => getHighestTphValue(routeData), [routeData]);

    const renderMetrics = () => {
        const baseline = serviceRegimes.baseline[serviceDay];
        const covid = serviceRegimes.covid[serviceDay];
        const waitTimeDifferential = covid.meanWaitTime - baseline.meanWaitTime;
        const waitTimeDifferentialString =
            waitTimeDifferential > 0 ? `+${waitTimeDifferential}` : waitTimeDifferential.toString();
        const waitTimeGood = waitTimeDifferential <= 0;
        const totalTripsDifferential = baseline.totalTrips - covid.totalTrips;
        const totalTripsNumberString = Math.abs(totalTripsDifferential).toString();
        const totalTripsVerb = totalTripsDifferential < 0 ? "Added" : "Dropped";
        const totalTripsGood = totalTripsDifferential <= 0;
        const crowdingFactor = covid.crowdingFactor!;
        const crowdingPercentage = Math.round(100 * crowdingFactor - 100);
        const crowdingPercentageDesc = crowdingPercentage > 0 ? "more" : "less";
        const crowdingPercentageString =
            crowdingPercentage > 0 ? `+${crowdingPercentage}%` : `${crowdingPercentage}%`;
        const crowdingPercentageGood = crowdingPercentage <= 0;
        return (
            <div className={styles.metrics}>
                <div className={classNames(styles.metric, totalTripsGood ? "good" : "bad")}>
                    <div className="number">{totalTripsNumberString}</div>
                    <div className="label">
                        <>
                            Trips
                            <br />
                            {totalTripsVerb}
                        </>
                    </div>
                </div>
                <div className={classNames(styles.metric, waitTimeGood ? "good" : "bad")}>
                    <div className="number">{waitTimeDifferentialString}</div>
                    <div className="label">
                        Min longer wait
                        <br />
                        (on average)
                    </div>
                </div>
                <div className={classNames(styles.metric, crowdingPercentageGood ? "good" : "bad")}>
                    <div className="number">{crowdingPercentageString}</div>
                    <div className="label">
                        <>
                            {crowdingPercentageDesc}
                            <br />
                            crowding
                        </>
                    </div>
                </div>
            </div>
        );
    };

    const renderTphChart = (regime: ServiceRegime) => {
        console.log(regime, serviceRegimes);
        const levels = serviceRegimes[regime][serviceDay];
        const isBaseline = regime === "baseline";
        const chartColor = isBaseline ? "#bbb" : color;
        const year = isBaseline ? "2019" : "2021";
        return (
            <div className={styles.tphChartContainer}>
                <div style={{ color: chartColor }} className={styles.tphChartLabel}>
                    {year}
                </div>
                <ResponsiveLine
                    // eslint-disable-next-line react/prop-types
                    data={[{ id: "service", data: getTimeSeriesForTph(levels.tripsPerHour) }]}
                    yFormat={stringify12Hour}
                    yScale={{ type: "linear", min: 0, max: highestTphValue }}
                    curve="step"
                    colors={[chartColor]}
                    enablePoints={false}
                    enableGridY={false}
                    enableGridX={false}
                    isInteractive={false}
                    animate={false}
                    enableArea
                    areaOpacity={0.2}
                    margin={{ top: 5, right: 0, bottom: 20, left: 0 }}
                    defs={[linearGradient]}
                    fill={[{ match: "*", id: "gradient" }]}
                    axisLeft={{ tickValues: [] }}
                    axisBottom={{
                        tickValues: lineTickValues,
                        tickPadding: 5,
                        tickSize: 0,
                        tickRotation: 0,
                    }}
                />
            </div>
        );
    };

    const renderServiceAndRidershipChart = () => {
        return (
            <div className={styles.serviceAndRidershipChartContainer}>
                <ResponsiveLine
                    // eslint-disable-next-line react/prop-types
                    data={[]}
                    yFormat={stringify12Hour}
                    curve="step"
                    colors={[color]}
                    isInteractive={false}
                    animate={false}
                    defs={[linearGradient]}
                    fill={[{ match: "*", id: "gradient" }]}
                />
            </div>
        );
    };

    const renderSectionLabel = (title: string) => {
        return (
            <h3 className={styles.sectionLabel}>
                <div className="label">{title}</div>
                <div className="rule" />
            </h3>
        );
    };

    const renderTitleGrid = () => {
        return (
            <div className={styles.titleGrid}>
                <div className={styles.titleAndSubtitle}>
                    <h2 className={styles.title}>{title}</h2>
                    <div className={styles.subtitle}>{subtitle}</div>
                </div>
                <Pie
                    width={40}
                    height={40}
                    data={fakeData}
                    enableRadialLabels={false}
                    enableSliceLabels={false}
                    startAngle={0}
                    endAngle={360 * serviceFraction}
                    innerRadius={0.7}
                    colors={[color]}
                    isInteractive={false}
                />
            </div>
        );
    };

    const renderCancellationLayer = () => {
        if (routeData.serviceRegimes.covid.weekday.cancelled) {
            return (
                <>
                    <TiCancel className={styles.cancellationIcon} />
                    <div className={styles.cancellationLayer}>
                        <div className={styles.cancellationText}>Canceled</div>
                    </div>
                </>
            );
        }
        return null;
    };

    return (
        <div className={styles.routeCard}>
            {renderTitleGrid()}
            {renderSectionLabel("Daily service levels")}
            {renderTphChart("baseline")}
            {renderTphChart("covid")}
            {renderMetrics()}
            {renderSectionLabel("Service and ridership")}
            {renderServiceAndRidershipChart()}
            {renderCancellationLayer()}
        </div>
    );
};

export default RouteCard;
