import React, { useEffect, useMemo, useRef } from "react";
import Chart from "chart.js/auto";
import Color from "chartjs-color";

import { TripsPerHour } from "types";
import { getHourlyTickValues } from "time";

import styles from "./LineCard.module.scss";
import { DataTable } from "components";

const hourLabels = getHourlyTickValues(1);

type Props = {
    baselineTph: TripsPerHour;
    currentTph: TripsPerHour;
    highestTph: number;
    color: string;
    lineTitle: string;
};

const TphChart = (props: Props) => {
    const { color, baselineTph, currentTph, highestTph, lineTitle } = props;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const columns = useMemo(() => {
        const withZeroFallback = (x) => x || 0;
        return [
            { title: "Hour", values: hourLabels },
            baselineTph && { title: "Pre-COVID trips", values: baselineTph.map(withZeroFallback) },
            currentTph && { title: "Current trips", values: currentTph.map(withZeroFallback) },
        ].filter((x) => x);
    }, [hourLabels, baselineTph, currentTph]);

    useEffect(() => {
        const ctx = canvasRef.current!.getContext("2d");
        const currentColor = Color(color).alpha(0.4).rgbString();

        const datasets = [
            {
                label: "Pre-COVID trips per hour",
                data: baselineTph as any,
                stepped: true,
                borderColor: color,
                borderWidth: 2,
                backgroundColor: "rgba(0,0,0,0)",
            },
            {
                label: "Current trips per hour",
                data: currentTph as any,
                stepped: true,
                borderWidth: 2,
                borderColor: "rgba(0,0,0,0)",
                backgroundColor: currentColor,
                fill: true,
            },
        ];

        const chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: hourLabels,
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
            <DataTable columns={columns as any} caption={`Trips each hour (${lineTitle})`} />
        </div>
    );
};

export default TphChart;
