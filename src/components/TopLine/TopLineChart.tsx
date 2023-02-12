import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

import styles from "./TopLineChart.module.scss";

type Props = {
    sparklineData: any;
    pieData: any;
    label: string;
};

const asPercentString = (p: number) => Math.round(100 * p).toString() + "%";

const TopLineChart = (props: Props) => {
    const { sparklineData, pieData, label } = props;
    const pieCanvasRef = useRef<null | HTMLCanvasElement>(null);
    useEffect(() => {
        const pieCanvasElement = pieCanvasRef.current;
        if (pieCanvasElement) {
            const pieCanvasContext = pieCanvasElement.getContext("2d");
            new Chart(pieCanvasContext, {
                type: "doughnut",
                data: pieData,
                options: {
                    plugins: {
                        legend: {
                            display: false,
                        },
                        tooltip: {
                            enabled: false,
                        },
                    },
                    hover: {
                        mode: null,
                    },
                },
            });
        }
    }, [props.pieData]);

    const lineCanvasRef = useRef<null | HTMLCanvasElement>(null);
    useEffect(() => {
        const lineCanvasElement = lineCanvasRef.current;
        if (lineCanvasElement) {
            const lineCanvasContext = lineCanvasElement.getContext("2d");
            const { datasets } = sparklineData;
            new Chart(lineCanvasContext, {
                type: "line",
                data: sparklineData,
                options: {
                    plugins: {
                        tooltip: {
                            mode: "index",
                            intersect: false,
                            displayColors: false,
                            callbacks: {
                                title: ([{ index, datasetIndex }]) => {
                                    const {
                                        labels: { dateStrings },
                                    } = datasets[datasetIndex];
                                    return dateStrings[index];
                                },
                                label: ({ index, datasetIndex }) => {
                                    const { data } = datasets[datasetIndex];
                                    const percentage = asPercentString(data[index] / data[0]);
                                    return `${percentage} of pre-pandemic ${label}`;
                                },
                            },
                        },
                        legend: {
                            display: false,
                        },
                    },
                    layout: {
                        padding: 10,
                    },
                    scales: {
                        xAxes: {
                            grid: {
                                drawBorder: false,
                                tickLength: 0,
                                drawOnChartArea: false,
                            },
                            ticks: {
                                display: false,
                                maxTicksLimit: 2,
                            },
                        },
                        yAxes: {
                            grid: {
                                drawBorder: false,
                                tickLength: 0,
                                drawOnChartArea: false,
                            },
                            ticks: {
                                display: false,
                            },
                        },
                    },
                    elements: {
                        point: {
                            radius: 0,
                        },
                    },
                },
            });
        }
    }, [props.sparklineData]);

    return (
        <div className={styles.flexWrap}>
            <div className={styles.flexCol}>
                <canvas ref={pieCanvasRef} />
            </div>
            <div className={styles.flexCol}>
                <canvas ref={lineCanvasRef} />
            </div>
        </div>
    );
};

export default TopLineChart;
