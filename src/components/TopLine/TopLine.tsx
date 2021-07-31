import React from "react";
import { SummaryData } from "types";
import TopLineChart from "./TopLineChart";

import styles from "./TopLine.module.scss";

type Props = {
    summaryData: SummaryData;
};

const getPercentArray = (percentage: any) => {
    return [100 - (percentage * 100), percentage * 100]
}

const TopLine = (props: Props) => {
    const { summaryData } = props;
    const {
        totalRidershipHistory,
        totalServiceHistory,
        totalRidershipPercentage,
        totalServicePercentage,
        totalPassengers,
        totalTrips,
        totalroutesCancelled,
        totalReducedService,
        totalIncreasedService,
    } = summaryData;

    const label_array = ["pre-covid"];
    for (let i = 1; i < totalRidershipHistory.length - 1; ++i) {
        label_array.push("");
    }
    label_array.push("current");

    const pieRidership = {
        labels: ["", "current"],
        datasets: [
            {
                backgroundColor: ["#D3D3D3", "#D31A2B"],
                data: getPercentArray(totalRidershipPercentage),
            },
        ],
    };
    const lineRidership = {
        labels: label_array,
        datasets: [
            {
                data: totalRidershipHistory,
                fill: false,
                tension: 0,
                borderColor: "#D31A2B",
            },
        ],
    };

    const pieService = {
        labels: ["", "current"],
        datasets: [
            {
                backgroundColor: ["#D3D3D3", "#D31A2B"],
                data: getPercentArray(totalServicePercentage),
            },
        ],
    };
    const lineService = {
        labels: label_array,
        datasets: [
            {
                data: totalServiceHistory,
                fill: false,
                tension: 0,
                borderColor: "#D31A2B",
            },
        ],
    };

    return (
        <div className={styles.Wrap}>
            <div className={styles.Col}>
                <h4>Total Ridership</h4>
                <TopLineChart sparklineData={lineRidership} pieData={pieRidership} />
                <p>
                    <strong>{getPercentArray(totalRidershipPercentage)[1]}%</strong> of pre-COVID
                </p>
                <p>
                    <strong>{totalPassengers.toLocaleString()}</strong> riders
                </p>
            </div>
            <div className={styles.Col}>
                <h4>Total Service</h4>
                <TopLineChart sparklineData={lineService} pieData={pieService} />
                <p>
                    <strong>{getPercentArray(totalServicePercentage)[1]}%</strong> of pre-COVID
                </p>
                <p>
                    <strong>{totalTrips.toLocaleString()} </strong> trips
                </p>
            </div>
            <div className={styles.Col}>
                <ul>
                    <li>
                        <strong><span>{totalroutesCancelled.toLocaleString()}</span></strong> routes cancelled
                    </li>
                    <li>
                        <strong><span>{totalReducedService.toLocaleString()}</span></strong> routes with reduced
                        service
                    </li>
                    <li>
                        <strong><span>{totalIncreasedService.toLocaleString()}</span></strong> routes with
                        increased service
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default TopLine;
