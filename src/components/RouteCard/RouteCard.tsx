import React, { useMemo, useState } from "react";
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
    const { title, routeKind, serviceFraction, serviceRegimes } = routeData;
    const color = routeColors[routeKind];
    const [serviceDay] = useState<ServiceDay>("weekday");
    const highestTphValue = useMemo(() => getHighestTphValue(routeData), [routeData]);

    const renderTphChart = (regime: ServiceRegime) => {
        console.log(regime, serviceRegimes);
        const levels = serviceRegimes[regime][serviceDay];
        return (
            <div className={styles.tphChartContainer}>
                <ResponsiveLine
                    // eslint-disable-next-line react/prop-types
                    data={[{ id: "service", data: getTimeSeriesForTph(levels.tripsPerHour) }]}
                    yFormat={stringify12Hour}
                    yScale={{ type: "linear", min: 0, max: highestTphValue }}
                    curve="step"
                    colors={[color]}
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

    return (
        <div className={styles.routeCard}>
            <div className={styles.topRow}>
                <h2 className={styles.routeTitle}>{title}</h2>
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
            {renderTphChart("baseline")}
            {renderTphChart("covid")}
            {routeData.serviceRegimes.covid.weekday.cancelled && (
                <>
                    <TiCancel className={styles.cancellationIcon} />
                    <div className={styles.cancellationLayer}>
                        <div className={styles.cancellationText}>Canceled</div>
                    </div>
                </>
            )}
        </div>
    );
};

export default RouteCard;
