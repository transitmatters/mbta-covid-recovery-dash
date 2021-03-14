import React, { useMemo } from "react";
import { ResponsiveLine } from "@nivo/line";
import { linearGradientDef } from "@nivo/core";

import { RouteData, TimeSeries, TripsPerHour } from "types";

import styles from "./RouteCard.module.scss";

type Props = {
    ridership: RouteData["ridership"];
    service: RouteData["service"];
    ridershipColor: string;
    serviceColor: string;
};

const linearGradient = linearGradientDef("gradient", [
    { offset: 0, color: "inherit" },
    { offset: 100, color: "inherit", opacity: 0 },
]);

const emptyGradient = linearGradientDef("emptyGradient", [
    { offset: 0, color: "inherit", opacity: 0 },
    { offset: 100, color: "inherit", opacity: 0 },
]);

const theme = {
    axis: {
        ticks: {
            text: {
                fontSize: 10,
                transform: "translateX(-2px) translateY(2px)",
            },
        },
    },
};

const percentTickValues = [0, 0.2, 0.4, 0.6, 0.8, 1];

const normalizeToPercent = <X extends any>(timeSeries: TimeSeries<X, number>) => {
    const highestValue = timeSeries.reduce((max, next) => Math.max(max, next.y), -Infinity);
    return timeSeries.map((entry) => ({
        ...entry,
        y: entry.y / highestValue,
        properties: { value: entry.y },
    }));
};

const ServiceRidershipChart = (props: Props) => {
    const { ridershipColor, serviceColor, ridership, service } = props;
    const ridershipPercentage = useMemo(() => normalizeToPercent(ridership), [ridership]);
    const servicePercentage = useMemo(() => normalizeToPercent(service), [service]);

    const renderTooltip = (item: any) => {
        const {
            point: {
                data: {
                    properties: { value },
                },
                serieId,
            },
        } = item;
        return (
            <div className={styles.tooltip}>
                <b>{value}</b> {serieId.toLowerCase()}
            </div>
        );
    };

    return (
        <div className={styles.serviceAndRidershipChartContainer}>
            <ResponsiveLine
                // eslint-disable-next-line react/prop-types
                data={[
                    { id: "Daily riders", data: ridershipPercentage },
                    { id: "Daily trips", data: servicePercentage },
                ]}
                colors={[ridershipColor, serviceColor]}
                theme={theme}
                defs={[linearGradient, emptyGradient]}
                fill={[
                    { match: { id: "Daily riders" }, id: "gradient" },
                    { match: { id: "Daily trips" }, id: "emptyGradient" },
                ]}
                margin={{ top: 5, right: 0, bottom: 10, left: 30 }}
                tooltip={renderTooltip}
                enableArea
                enablePoints={false}
                useMesh
                xScale={{
                    type: "time",
                    format: "%Y-%m-%d",
                    precision: "day",
                }}
                axisLeft={{
                    format: "2>-.0p",
                    tickValues: percentTickValues,
                    tickSize: 0,
                }}
                axisBottom={{
                    tickSize: 0,
                    format: "%-m/%y",
                    tickValues: "every 1 months",
                    legend: true,
                }}
                legends={[
                    {
                        anchor: "top-right",
                        direction: "column",
                        justify: false,
                        translateX: 0,
                        translateY: 0,
                        itemsSpacing: 0,
                        itemDirection: "left-to-right",
                        itemWidth: 80,
                        itemHeight: 20,
                        symbolShape: "circle",
                        symbolSize: 10,
                    },
                ]}
            />
        </div>
    );
};

export default ServiceRidershipChart;
