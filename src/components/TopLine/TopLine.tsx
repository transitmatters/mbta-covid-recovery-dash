import React, { useEffect, useRef } from "react";
import Chart from "chart.js";
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

    return (
        <div className={styles.TopLine}></div>
    );

}

export default TopLine