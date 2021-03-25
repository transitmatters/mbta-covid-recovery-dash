import React, { useMemo, useState } from "react";
import classNames from "classnames";
import { TiCancel } from "react-icons/ti";

import { RouteData, ServiceDay, ServiceLevels } from "types";
import { TabPicker } from "components";

import { routeColors } from "./colors";
import { routeTitles } from "./titles";
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

const getServiceFraction = (
    numerator: Record<ServiceDay, ServiceLevels>,
    denominator: Record<ServiceDay, ServiceLevels>
) => {
    return (
        (numerator.weekday.totalTrips +
            numerator.saturday.totalTrips +
            numerator.sunday.totalTrips) /
        (denominator.weekday.totalTrips +
            denominator.saturday.totalTrips +
            denominator.sunday.totalTrips)
    );
};

const RouteCard = (props: Props) => {
    const { routeData } = props;
    const {
        id,
        ridershipHistory,
        routeKind,
        serviceHistory,
        serviceRegimes,
        startDate: startDateString,
    } = routeData;

    const color = routeColors[routeKind] || "black";
    const [serviceDay, setServiceDay] = useState<ServiceDay>("weekday");
    const highestTph = useMemo(() => getHighestTphValue(routeData), [routeData]);
    const startDate = useMemo(() => new Date(startDateString), [startDateString]);
    const title = routeTitles[id] || id;

    const ridershipAndFrequencyLabel = ridershipHistory
        ? "Ridership and frequency"
        : "Frequency (ridership data not available)";

    const renderSectionLabel = (title: string, rightElement: React.ReactNode = null) => {
        return (
            <h3 className={styles.sectionLabel}>
                <div className="label">{title}</div>
                {rightElement}
            </h3>
        );
    };

    const renderStatusBadge = () => {
        const { current, baseline } = serviceRegimes;
        if (current.weekday.cancelled) {
            return (
                <div className={classNames(styles.statusBadge, "bad")}>
                    <TiCancel size={20} />
                    Canceled
                </div>
            );
        } else if (current.saturday.totalTrips === 0 && baseline.saturday.totalTrips > 0) {
            return (
                <div className={classNames(styles.statusBadge, "warning")}>
                    <TiCancel size={20} />
                    Weekends
                </div>
            );
        }
    };

    const renderTopRow = () => {
        return (
            <div className={styles.topRow}>
                <h2 className={styles.title}>{title}</h2>
                {renderStatusBadge()}
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
            {/* {renderCancellationText()} */}
            {renderTopRow()}
            {renderSectionLabel("Service levels", tabs)}
            <TphChart
                baselineTph={serviceRegimes.baseline[serviceDay].tripsPerHour}
                currentTph={serviceRegimes.current[serviceDay].tripsPerHour}
                color={color}
                highestTph={highestTph}
            />
            {/* <Metrics serviceRegimes={serviceRegimes} serviceDay={serviceDay} /> */}
            {renderSectionLabel(ridershipAndFrequencyLabel)}
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
