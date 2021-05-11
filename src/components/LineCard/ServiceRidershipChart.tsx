import React, { useEffect, useMemo, useRef } from "react";
import Chart, { ChartDataSets } from "chart.js";
import Color from "chartjs-color";
import pattern from "patternomaly";
import memoize from "fast-memoize";

import { LineData } from "types";
import { DataTable } from "components";

import styles from "./LineCard.module.scss";

type Props = {
    ridershipHistory: LineData["ridershipHistory"];
    serviceHistory: LineData["serviceHistory"];
    color: string;
    startDate: Date;
    lineTitle: string;
    lineData: LineData;
};

const dateFormatter = new Intl.DateTimeFormat("en-US");

const getRidershipNoun = (lineId: string) => {
    console.log(lineId);
    if (["line-Red", "line-Orange", "line-Blue", "line-Green"].includes(lineId)) {
        return "faregate validations";
    }
    return "riders";
};

const normalizeToPercent = (timeSeries: number[]) => {
    const firstValue = timeSeries[0];
    return timeSeries.map((n) => n / firstValue);
};

const asPercentString = (p: number) => Math.round(100 * p).toString() + "%";

const getChartLabels = memoize(
    (startDate: Date) => {
        const now = Date.now();
        const dateStrings: string[] = [];
        const timestamps: number[] = [];
        let time = startDate.valueOf();
        do {
            dateStrings.push(dateFormatter.format(time));
            timestamps.push(time);
            time += 86400 * 1000;
        } while (time <= now);
        return { timestamps, dateStrings };
    },
    { serializer: (d) => d.valueOf().toString() }
);

const ServiceRidershipChart = (props: Props) => {
    const { color, serviceHistory, ridershipHistory, startDate, lineTitle, lineData } = props;
    const canvasRef = useRef<null | HTMLCanvasElement>(null);

    const ridershipPercentage = useMemo(
        () => ridershipHistory && normalizeToPercent(ridershipHistory),
        [ridershipHistory]
    );
    const servicePercentage = useMemo(() => serviceHistory && normalizeToPercent(serviceHistory), [
        serviceHistory,
    ]);
    const { timestamps, dateStrings } = useMemo(() => getChartLabels(startDate), [startDate]);
    const columns = useMemo(() => {
        const ridershipNoun = getRidershipNoun(lineData.id);
        return [
            { title: "Date", values: dateStrings },
            ridershipHistory && {
                title: `Ridership (${ridershipNoun}/day)`,
                values: ridershipHistory,
            },
            ridershipPercentage && {
                title: "Ridership (percentage)",
                values: ridershipPercentage.map(asPercentString),
            },
            serviceHistory && { title: "Service levels (trips/day)", values: serviceHistory },
            servicePercentage && {
                title: "Service levels (percentage)",
                values: servicePercentage.map(asPercentString),
            },
        ].filter((x) => x);
    }, [dateStrings, ridershipHistory, ridershipPercentage, serviceHistory, servicePercentage]);

    useEffect(() => {
        const alphaColor = Color(color).alpha(0.8).rgbString();
        const ctx = canvasRef.current!.getContext("2d");
        const ridershipNoun = getRidershipNoun(lineData.id);

        const datasets: (ChartDataSets & { actual: number[]; unit: string })[] = [
            ridershipPercentage && {
                label: "Ridership",
                actual: ridershipHistory,
                unit: `weekday ${ridershipNoun}`,
                data: ridershipPercentage,
                borderColor: color,
                backgroundColor: alphaColor,
                borderWidth: 2,
            },
            {
                label: "Service levels",
                actual: serviceHistory,
                unit: "weekday trips per direction",
                data: servicePercentage,
                borderColor: alphaColor,
                backgroundColor: pattern.draw("diagonal", "rgba(0,0,0,0)", color, 5),
                borderWidth: 2,
            },
        ].filter((x) => x);
        const chart = new Chart(ctx, {
            type: "line",
            data: {
                datasets,
                labels: timestamps,
            },
            options: {
                maintainAspectRatio: false,
                animation: { duration: 0 },
                scales: {
                    xAxes: [
                        {
                            gridLines: { display: false },
                            type: "time",
                            time: {
                                unit: "month",
                                displayFormats: {
                                    month: "MMM 'YY",
                                },
                            },
                        },
                    ],
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                                stepSize: 0.2,
                                maxTicksLimit: 6,
                                callback: asPercentString,
                            },
                            gridLines: { display: false },
                        },
                    ],
                },
                elements: {
                    point: { radius: 0 },
                    line: { tension: 0 },
                },
                legend: {
                    position: "top",
                    align: "end",
                    labels: {
                        boxWidth: 15,
                    },
                },
                tooltips: {
                    mode: "index",
                    intersect: false,
                    callbacks: {
                        title: ([{ index }]) => {
                            return dateFormatter.format(timestamps[index]);
                        },
                        label: ({ datasetIndex, index, value }) => {
                            const { label, actual, unit } = datasets[datasetIndex];
                            const valuePercent = Math.round(parseFloat(value) * 100);
                            return `${label}: ${actual[index]} ${unit} (${valuePercent}%)`;
                        },
                    },
                },
            },
        });
        return () => chart.destroy();
    }, [ridershipPercentage, servicePercentage, lineData.id]);

    return (
        <div className={styles.serviceAndRidershipChartContainer}>
            <canvas className={styles.serviceAndRidershipChart} ref={canvasRef} />
            <DataTable columns={columns} caption={`Service levels and ridership (${lineTitle})`} />
        </div>
    );
};

export default ServiceRidershipChart;
