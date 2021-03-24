import React, { useEffect, useRef } from "react";
import Chart from "chart.js";
import Color from "chartjs-color";

import { TripsPerHour } from "types";
import { getHourlyTickValues } from "time";

import styles from "./RouteCard.module.scss";

const lineTickValues = getHourlyTickValues(1);

type Props = {
    baselineTph: TripsPerHour;
    currentTph: TripsPerHour;
    highestTph: number;
    color: string;
};

const TphChart = (props: Props) => {
    const { color, baselineTph, currentTph, highestTph } = props;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const ctx = canvasRef.current!.getContext("2d");
        const currentColor = Color(color).alpha(0.4).rgbString();

        const datasets = [
            {
                label: "Pre-COVID trips per hour",
                data: baselineTph as any,
                steppedLine: true,
                borderColor: color,
                borderWidth: 2,
                backgroundColor: "rgba(0,0,0,0)",
            },
            {
                label: "Current trips per hour",
                data: currentTph as any,
                steppedLine: true,
                borderWidth: 2,
                borderColor: "rgba(0,0,0,0)",
                backgroundColor: currentColor,
            },
        ];

        const chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: lineTickValues,
                datasets,
            },
            options: {
                maintainAspectRatio: false,
                animation: { duration: 0 },
                legend: {
                    position: "top",
                    align: "end",
                    labels: { boxWidth: 15 },
                },
                scales: {
                    xAxes: [
                        {
                            gridLines: { display: false },
                            ticks: {
                                maxTicksLimit: 12,
                                maxRotation: 0,
                            },
                        },
                    ],
                    yAxes: [
                        {
                            gridLines: { display: false },
                            ticks: {
                                maxTicksLimit: 4,
                                suggestedMax: highestTph,
                            },
                        },
                    ],
                },
                tooltips: {
                    mode: "index",
                    intersect: false,
                    callbacks: {
                        label: ({ datasetIndex, index }) => {
                            const { label, data } = datasets[datasetIndex];
                            return `${label}: ${data[index]} (each direction)`;
                        },
                    },
                },
                elements: {
                    line: { tension: 0 },
                    point: { radius: 0 },
                },
            },
        });
        return () => chart.destroy();
    }, [baselineTph, currentTph]);

    return (
        <div className={styles.tphChartContainer}>
            <canvas ref={canvasRef} />
        </div>
    );
};

export default TphChart;
