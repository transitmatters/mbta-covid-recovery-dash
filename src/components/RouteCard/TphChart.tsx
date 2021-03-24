import React, { useEffect, useMemo, useRef } from "react";
import pattern from "patternomaly";
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
        const baselineColor = Color(color).desaturate(0.6).alpha(0.25).rgbString();
        const currentColor = Color(color).alpha(0.5).rgbString();
        const chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: lineTickValues,
                datasets: [
                    {
                        label: "Pre-covid trips per hour",
                        data: baselineTph as any,
                        steppedLine: true,
                        borderColor: "rgba(0,0,0,0)",
                        backgroundColor: pattern.draw(
                            "diagonal-right-left",
                            baselineColor,
                            "white",
                            5
                        ),
                    },
                    {
                        label: "Current trips per hour",
                        data: currentTph as any,
                        steppedLine: true,
                        borderColor: "rgba(0,0,0,0)",
                        backgroundColor: pattern.draw("diagonal", currentColor, color, 5),
                    },
                ],
            },
            options: {
                maintainAspectRatio: false,
                animation: {
                    duration: 0,
                },
                legend: {
                    position: "top",
                    align: "start",
                    labels: {
                        boxWidth: 15,
                    },
                },
                scales: {
                    xAxes: [{ gridLines: { display: false } }],
                    yAxes: [
                        {
                            gridLines: {
                                display: false,
                            },
                            ticks: {
                                display: false,
                                suggestedMax: highestTph,
                            },
                        },
                    ],
                },
                elements: {
                    line: {
                        tension: 0,
                    },
                    point: {
                        radius: 0,
                    },
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
