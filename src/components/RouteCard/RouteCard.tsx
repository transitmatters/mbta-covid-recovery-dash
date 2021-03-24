import React, { useMemo, useState } from "react";
import classNames from "classnames";
import { Pie } from "@nivo/pie";

import { RouteData, ServiceDay } from "types";
import { routeColors } from "../../colors";
import { TabPicker } from "components";

import Metrics from "./Metrics";
import styles from "./RouteCard.module.scss";
import TphChart from "./TphChart";
import ServiceRidershipChart from "./ServiceRidershipChart";

type Props = {
    routeData: RouteData;
};

const fakeDataForPie = [{ value: 1 }, { value: 0 }];

const serviceDayItems = [
    { value: "weekday", label: "Weekdays" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
];

const getHighestTphValue = (routeData: RouteData) => {
    let max = 0;
    Object.entries(routeData.serviceRegimes).forEach(([key, regime]) => {
        if (key === "baseline" || key === "current") {
            Object.values(regime).forEach((serviceLevel) => {
                if (serviceLevel.tripsPerHour) {
                    max = Math.max(max, ...serviceLevel.tripsPerHour);
                }
            });
        }
    });
    return max;
};

const RouteCard = (props: Props) => {
    const { routeData } = props;
    const {
        id,
        ridershipHistory,
        routeKind,
        serviceHistory,
        serviceFraction,
        serviceRegimes,
        subtitle,
        startDate: startDateString,
    } = routeData;

    const color = routeColors[routeKind];
    const [serviceDay, setServiceDay] = useState<ServiceDay>("weekday");
    const highestTph = useMemo(() => getHighestTphValue(routeData), [routeData]);
    const startDate = useMemo(() => new Date(startDateString), [startDateString]);
    const title = id;

    const renderSectionLabel = (title: string, rightElement: React.ReactNode = null) => {
        return (
            <h3 className={styles.sectionLabel}>
                <div className="label">{title}</div>
                {rightElement}
            </h3>
        );
    };

    const renderTitleGrid = () => {
        return (
            <div className={styles.titleGrid}>
                <div className={styles.titleAndSubtitle}>
                    <h2 className={classNames(styles.title, title.length > 6 && "long")}>
                        {title}
                    </h2>
                    <div className={styles.subtitle}>{subtitle}</div>
                </div>
                <Pie
                    width={40}
                    height={40}
                    data={fakeDataForPie}
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

    const tabs = (
        <TabPicker
            className={styles.tabs}
            value={serviceDay}
            items={serviceDayItems}
            onSelectValue={(d) => setServiceDay(d as any)}
            baseId={`route-day-selector-${id}`}
            aria-label="Select day of service"
        />
    );

    return (
        <div className={styles.routeCard}>
            {renderTitleGrid()}
            {renderSectionLabel("Daily service levels:", tabs)}
            <TphChart
                tph={serviceRegimes.baseline[serviceDay].tripsPerHour}
                highestTph={highestTph}
                color="#bbb"
                label="Pre-COVID"
            />
            <TphChart
                tph={serviceRegimes.current[serviceDay].tripsPerHour}
                highestTph={highestTph}
                color={color}
                label="Now"
            />
            <Metrics serviceRegimes={serviceRegimes} serviceDay={serviceDay} />
            {renderSectionLabel("Ridership versus service levels:")}
            <ServiceRidershipChart
                startDate={startDate}
                ridershipHistory={ridershipHistory}
                serviceHistory={serviceHistory}
                ridershipColor={color}
                serviceColor="tomato"
            />
        </div>
    );
};

export default RouteCard;
