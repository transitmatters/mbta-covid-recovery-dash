import React, { useMemo } from "react";
import { SummaryData } from "types";
import TopLineChart from "./TopLineChart";

import styles from "./TopLine.module.scss";

type Props = {
    summaryData: SummaryData;
};

const smooth = (data: number[], window = 20) => {
    const result: number[] = [];
    for (let i = 0; i < data.length - window; i++) {
        const inWindow = data.slice(i, i + window).reduce((a, b) => a + b);
        result.push(inWindow);
    }
    return result;
};

const getPercentArray = (percentage: any) => {
    return [100 - percentage * 100, percentage * 100];
};

const TopLine = (props: Props) => {
    const { summaryData } = props;
    const {
        totalRidershipHistory,
        totalServiceHistory,
        totalRidershipPercentage,
        totalServicePercentage,
        totalRoutesCancelled,
        totalReducedService,
        totalIncreasedService,
    } = summaryData;

    const labelArray = useMemo(
        () => ["pre-covid", ...Array(totalRidershipHistory.length - 2).fill(""), "current"],
        []
    );

    const pieRidership = useMemo(
        () => ({
            labels: ["", "current"],
            datasets: [
                {
                    strokeColor: "transparent",
                    backgroundColor: ["#D3D3D3", "#D31A2B"],
                    data: getPercentArray(totalRidershipPercentage),
                },
            ],
        }),
        [totalRidershipPercentage]
    );

    const lineRidership = useMemo(
        () => ({
            labels: labelArray,
            datasets: [
                {
                    data: smooth(totalRidershipHistory),
                    fill: false,
                    tension: 0,
                    borderColor: "#D31A2B",
                },
            ],
        }),
        [labelArray, totalRidershipHistory]
    );

    const pieService = useMemo(
        () => ({
            labels: ["", "current"],
            datasets: [
                {
                    backgroundColor: ["#D3D3D3", "#D31A2B"],
                    data: getPercentArray(totalServicePercentage),
                },
            ],
        }),
        [totalServicePercentage]
    );

    const lineService = useMemo(
        () => ({
            labels: labelArray,
            datasets: [
                {
                    data: smooth(totalServiceHistory),
                    fill: false,
                    tension: 0,
                    borderColor: "#D31A2B",
                },
            ],
        }),
        [totalServiceHistory]
    );

    return (
        <div className={styles.Wrap}>
            <div className={styles.Col}>
                <h4>Total Ridership</h4>
                <TopLineChart sparklineData={lineRidership} pieData={pieRidership} />
                <p>
                    <strong>{Math.round(totalRidershipPercentage * 100)}%</strong> of pre-pandemic
                    weekday ridership
                </p>
            </div>
            <div className={styles.Col}>
                <h4>Total Service</h4>
                <TopLineChart sparklineData={lineService} pieData={pieService} />
                <p>
                    <strong>{Math.round(totalServicePercentage * 100)}%</strong> of pre-pandemic
                    weekday service
                </p>
            </div>
            <div className={styles.Col}>
                <ul>
                    <li>
                        <strong>
                            <span>{totalRoutesCancelled}</span>
                        </strong>{" "}
                        routes cancelled
                    </li>
                    <li>
                        <strong>
                            <span>{totalReducedService}</span>
                        </strong>{" "}
                        routes with reduced service
                    </li>
                    <li>
                        <strong>
                            <span>{totalIncreasedService}</span>
                        </strong>{" "}
                        routes with increased service
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default TopLine;
