import React, { useMemo, useState } from "react";
import classNames from "classnames";
import { TiCancel } from "react-icons/ti";
import { Pie } from "@nivo/pie";

import { RouteData, ServiceDay } from "types";
import { routeColors } from "colors";
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
    Object.values(routeData.serviceRegimes).forEach((regime) => {
        Object.values(regime).forEach((serviceLevel) => {
            max = Math.max(max, ...serviceLevel.tripsPerHour);
        });
    });
    return max;
};

const RouteCard = (props: Props) => {
    const { routeData } = props;
    const {
        id,
        ridership,
        routeKind,
        service,
        serviceFraction,
        serviceRegimes,
        subtitle,
        title,
    } = routeData;
    const color = routeColors[routeKind];
    const [serviceDay] = useState<ServiceDay>("weekday");
    const highestTph = useMemo(() => getHighestTphValue(routeData), [routeData]);

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

    const tabs = (
        <TabPicker
            className={styles.tabs}
            value={serviceDay}
            items={serviceDayItems}
            onSelectValue={(v) => {}}
            baseId={id}
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
                year="2019"
            />
            <TphChart
                tph={serviceRegimes.covid[serviceDay].tripsPerHour}
                highestTph={highestTph}
                color={color}
                year="2021"
            />
            <Metrics serviceRegimes={serviceRegimes} serviceDay={serviceDay} />
            {renderSectionLabel("Ridership versus service levels:")}
            <ServiceRidershipChart
                ridership={ridership}
                service={service}
                ridershipColor={color}
                serviceColor="tomato"
            />
            {renderCancellationLayer()}
        </div>
    );
};

export default RouteCard;
