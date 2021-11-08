import React from "react";

import { SummaryData } from "types";

import styles from "./TopLineMobile.module.scss";

type Props = {
    summaryData: SummaryData;
};

const asPercentString = (p: number) => Math.round(100 * p).toString() + "%";

const TopLineMobile = (props: Props) => {
    const { summaryData } = props;
    const { totalRidershipPercentage, totalServicePercentage } = summaryData;
    return (
        <div className={styles.topLineMobile}>
            <div className={styles.ridership}>
                <div className={styles.large}>{asPercentString(totalRidershipPercentage)}</div>
                of pre-pandemic ridership
            </div>
            <div className={styles.service}>
                <div className={styles.large}>{asPercentString(totalServicePercentage)}</div>
                of pre-pandemic service
            </div>
        </div>
    );
};

export default TopLineMobile;
