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
        const chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: lineTickValues,
                datasets: [
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
                ],
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
                },
                elements: {
                    line: { tension: 0 },
                    point: { radius: 0 },
                },
            },
        });
        return () => chart.destroy();
    }, [baselineTph, currentTph]);

    const renderTooltip = (item) => {
        const {
            point: {
                data: { x: time, y: trips },
            },
        } = item;
        const tripsPlural = trips === 1 ? "trip" : "trips";
        return (
            <div className={styles.tooltip}>
                <b>{time}:</b> {trips} {tripsPlural}/hour
            </div>
        );
    };

    return (
        <div className={styles.tphChartContainer}>
            <canvas ref={canvasRef} />
        </div>
    );
};

export default TphChart;
