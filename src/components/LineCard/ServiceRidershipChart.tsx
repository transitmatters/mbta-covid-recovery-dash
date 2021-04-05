import React, { useEffect, useMemo, useRef } from "react";
import Chart, { ChartDataSets } from "chart.js";
import Color from "chartjs-color";
import pattern from "patternomaly";
import memoize from "fast-memoize";

import { LineData } from "types";

import styles from "./LineCard.module.scss";

type Props = {
    ridershipHistory: LineData["ridershipHistory"];
    serviceHistory: LineData["serviceHistory"];
    color: string;
    startDate: Date;
};

const normalizeToPercent = (timeSeries: number[]) => {
    const firstValue = timeSeries[0];
    return timeSeries.map((n) => n / firstValue);
};

const getChartLabels = memoize(
    (startDate: Date) => {
        const formatter = new Intl.DateTimeFormat("en-US");
        const now = Date.now();
        const labels: string[] = [];
        let time = startDate.valueOf();
        do {
            let dateString = formatter.format(time);
            dateString = dateString.slice(0, -4) + dateString.slice(-2);
            labels.push(dateString);
            time += 86400 * 1000;
        } while (time <= now);
        return labels;
    },
    { serializer: (d) => d.valueOf().toString() }
);

const ServiceRidershipChart = (props: Props) => {
    const { color, serviceHistory, ridershipHistory, startDate } = props;
    const canvasRef = useRef<null | HTMLCanvasElement>(null);

    const ridershipPercentage = useMemo(
        () => ridershipHistory && normalizeToPercent(ridershipHistory),
        [ridershipHistory]
    );
    const servicePercentage = useMemo(() => serviceHistory && normalizeToPercent(serviceHistory), [
        serviceHistory,
    ]);
    const labels = useMemo(() => getChartLabels(startDate), [startDate]);

    useEffect(() => {
        const alphaColor = Color(color).alpha(0.8).rgbString();
        const ctx = canvasRef.current!.getContext("2d");

        const datasets: (ChartDataSets & { actual: number[]; unit: string })[] = [
            ridershipPercentage && {
                label: "Ridership",
                actual: ridershipHistory,
                unit: "weekday passengers",
                data: ridershipPercentage,
                borderColor: color,
                backgroundColor: alphaColor,
                borderWidth: 2,
            },
            {
                label: "Frequency",
                actual: serviceHistory,
                unit: "weekday trips (each direction)",
                data: servicePercentage,
                borderColor: alphaColor,
                backgroundColor: pattern.draw("diagonal", "rgba(0,0,0,0)", color, 5),
                borderWidth: 2,
            },
        ].filter((x) => x);
        const chart = new Chart(ctx, {
            type: "line",
            data: {
                labels,
                datasets,
            },
            options: {
                maintainAspectRatio: false,
                animation: { duration: 0 },
                scales: {
                    xAxes: [
                        {
                            gridLines: { display: false },
                            ticks: { maxTicksLimit: 15 },
                        },
                    ],
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                                stepSize: 0.2,
                                maxTicksLimit: 6,
                                callback: (p: number) => Math.round(100 * p).toString() + "%",
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
                        label: ({ datasetIndex, index }) => {
                            const { label, actual, unit } = datasets[datasetIndex];
                            return `${label}: ${actual[index]} ${unit}`;
                        },
                    },
                },
            },
        });
        return () => chart.destroy();
    }, [ridershipPercentage, servicePercentage]);

    return (
        <div className={styles.serviceAndRidershipChartContainer}>
            <canvas className={styles.serviceAndRidershipChart} ref={canvasRef} />
        </div>
    );
};

export default ServiceRidershipChart;
