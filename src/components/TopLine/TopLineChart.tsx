import React, { useEffect, useRef } from "react";
import Chart from "chart.js";

import styles from "./TopLineChart.module.scss";

type Props = {
    sparklineData: any;
    pieData: any;
};

const TopLineChart = (props: Props) => {
    const { sparklineData, pieData } = props;
    const pieCanvasRef = useRef<null | HTMLCanvasElement>(null);
    useEffect(() => {
        const pieCanvasElement = pieCanvasRef.current;
        if (pieCanvasElement) {
            const pieCanvasContext = pieCanvasElement.getContext("2d");
            new Chart(pieCanvasContext, {
                type: "doughnut",
                data: pieData,
                options: {
                    legend: {
                        display: false,
                    },
                    tooltips: {
                        enabled: false,
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
            new Chart(lineCanvasContext, {
                type: "line",
                data: sparklineData,
                options: {
                    tooltips: {
                        enabled: false,
                    },
                    hover: {
                        mode: null,
                    },
                    legend: {
                        display: false,
                    },
                    layout: {
                        padding: -10,
                    },
                    scales: {
                        xAxes: [
                            {
                                gridLines: {
                                    drawBorder: false,
                                    tickMarkLength: 0,
                                    drawOnChartArea: false,
                                },
                                ticks: {
                                    display: false,
                                    maxTicksLimit: 2,
                                },
                            },
                        ],
                        yAxes: [
                            {
                                gridLines: {
                                    drawBorder: false,
                                    tickMarkLength: 0,
                                    drawOnChartArea: false,
                                },
                                ticks: {
                                    display: false,
                                },
                            },
                        ],
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
