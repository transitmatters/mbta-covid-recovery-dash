import React, { useMemo } from "react";
import { ResponsiveLine } from "@nivo/line";
import { linearGradientDef } from "@nivo/core";

import { RouteData, TimeSeries } from "types";

import styles from "./RouteCard.module.scss";

type Props = {
    ridershipHistory: RouteData["ridershipHistory"];
    serviceHistory: RouteData["serviceHistory"];
    ridershipColor: string;
    serviceColor: string;
    startDate: Date;
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

const getDateTimeSeriesForHistory = (
    history: number[],
    startDate: Date
): TimeSeries<string, number> => {
    const currentDate = new Date(startDate);
    const series: TimeSeries<string, number> = [];
    history.forEach((value) => {
        series.push({
            x: currentDate.toLocaleDateString("en-CA"),
            y: value,
        });
        currentDate.setDate(currentDate.getDate() + 1);
    });
    return series;
};

const normalizeToPercent = <X extends any>(timeSeries: TimeSeries<X, number>) => {
    const firstValue = timeSeries[0].y;
    return timeSeries.map((entry) => ({
        ...entry,
        y: entry.y / firstValue,
        properties: { value: entry.y },
    }));
};

const ServiceRidershipChart = (props: Props) => {
    const { ridershipColor, serviceColor, serviceHistory, ridershipHistory, startDate } = props;
    const ridershipPercentage = useMemo(
        () => normalizeToPercent(getDateTimeSeriesForHistory(ridershipHistory, startDate)),
        [ridershipHistory]
    );
    const servicePercentage = useMemo(
        () => normalizeToPercent(getDateTimeSeriesForHistory(serviceHistory, startDate)),
        [serviceHistory]
    );

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
                    { id: "Weekday riders", data: ridershipPercentage },
                    { id: "Weekday trips", data: servicePercentage },
                ]}
                colors={[ridershipColor, serviceColor]}
                theme={theme}
                defs={[linearGradient, emptyGradient]}
                fill={[
                    { match: { id: "Weekday riders" }, id: "gradient" },
                    { match: { id: "Weekday trips" }, id: "emptyGradient" },
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
                        anchor: "bottom-left",
                        direction: "row",
                        justify: false,
                        translateX: 0,
                        translateY: 0,
                        itemsSpacing: 20,
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
