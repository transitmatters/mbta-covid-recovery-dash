import React from "react";
import { SummaryData } from "types";
import TopLineChart from "./TopLineChart";

import styles from "./TopLine.module.scss";

type Props = {
    summaryData: SummaryData;
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
    
    let label_array = ["pre-covid"];
    for (let i = 1; i < totalRidershipHistory.length - 1; ++i) {
        label_array.push("");
    }
    label_array.push("current");

    var pieRidership={
        labels: ["", "current"],
        datasets: [{
            backgroundColor: [
                "#E5E4E2",
                "#D3D3D3",
            ],
            data: totalRidershipPercentage
        }]
    }
    var lineRidership= {
        labels: label_array,
        datasets: [{
            data: totalRidershipHistory,
            fill: false,
            tension: 0,
            borderColor: "#D3D3D3",
        }],
    }

    var pieService={
        labels: ["", "current"],
        datasets: [{
            backgroundColor: [
                "#E5E4E2",
                "#D3D3D3",
            ],
            data: totalServicePercentage
        }]
    }
    var lineService= {
        labels: label_array,
        datasets: [{
            data: totalServiceHistory,
            fill: false,
            tension: 0,
            borderColor: "#D3D3D3",
        }],
    }

    return (
        <div className={styles.Wrap}>
            <div className={styles.Col}>
                <h4>Total Ridership</h4>
                <TopLineChart sparklineData={lineRidership} pieData={pieRidership} />
                <p><strong>{totalRidershipPercentage[1]}%</strong> of pre-COVID</p>
                <p><strong>{totalPassengers.toLocaleString()}</strong> passengers</p>
            </div>
            <div className={styles.Col}>
                <h4>Total Service</h4>
                <TopLineChart sparklineData={lineService} pieData={pieService} />
                <p><strong>{totalServicePercentage[1]}%</strong> of pre-COVID</p>
                <p><strong>{totalTrips.toLocaleString()} </strong> trips</p>
            </div>
            <div className={styles.Col}>
                <ul>
                    <li><strong>{totalroutesCancelled.toLocaleString()}</strong> routes cancelled</li>
                    <li><strong>{totalReducedService.toLocaleString()}</strong> routes with reduced service</li>
                    <li><strong>{totalIncreasedService.toLocaleString()}</strong> routes with increased service</li>
                </ul>
            </div>
        </div>
    );

}

export default TopLine;