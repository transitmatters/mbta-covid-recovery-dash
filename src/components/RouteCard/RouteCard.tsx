import React, { useMemo, useState } from "react";
import classNames from "classnames";
import { TiCancel } from "react-icons/ti";

import { RouteData, ServiceDay } from "types";
import { routeColors } from "../../colors";
import { TabPicker } from "components";

import styles from "./RouteCard.module.scss";
import TphChart from "./TphChart";
import ServiceRidershipChart from "./ServiceRidershipChart";

type Props = {
    routeData: RouteData;
};

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
        serviceRegimes,
        subtitle,
        startDate: startDateString,
    } = routeData;

    const color = routeColors[routeKind] || "black";
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
                    <h2 className={styles.title}>{title}</h2>
                    <div className={styles.subtitle}>{subtitle}</div>
                </div>
            </div>
        );
    };

    const renderCancellationText = () => {
        if (serviceRegimes.current.weekday.cancelled) {
            return <div className={styles.cancellationText}>Canceled</div>;
        }
        return null;
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
            {/* {renderCancellationText()} */}
            {renderTitleGrid()}
            {renderSectionLabel("Daily service levels", tabs)}
            <TphChart
                baselineTph={serviceRegimes.baseline[serviceDay].tripsPerHour}
                currentTph={serviceRegimes.current[serviceDay].tripsPerHour}
                color={color}
                highestTph={highestTph}
            />
            {/* <Metrics serviceRegimes={serviceRegimes} serviceDay={serviceDay} /> */}
            {renderSectionLabel("Ridership and frequency")}
            <ServiceRidershipChart
                startDate={startDate}
                ridershipHistory={ridershipHistory}
                serviceHistory={serviceHistory}
                color={color}
            />
        </div>
    );
};

export default RouteCard;
