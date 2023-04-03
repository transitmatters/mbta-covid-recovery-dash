import React, { useMemo } from "react";

import { SummaryData } from "types";
import ServiceRidershipChart from "../LineCard/ServiceRidershipChart";

import styles from "./SystemCard.module.scss";

type Props = {
    summaryData: SummaryData;
};

const SystemCard = (props: Props) => {
    const {
        summaryData: { totalRidershipHistory, totalServiceHistory, startDate: startDateString },
    } = props;

    const startDate = useMemo(() => new Date(startDateString), [startDateString]);

    return (
        <div className={styles.systemCard}>
            <h2 className={styles.title}>System-wide</h2>
            <div className={styles.caveat}>
                Excludes ridership data from Commuter Rail and Green Line surface stations.
            </div>
            <ServiceRidershipChart
                lineId=""
                lineTitle="System-wide"
                color="#165c96"
                serviceHistory={totalServiceHistory}
                ridershipHistory={totalRidershipHistory}
                startDate={startDate}
            />
        </div>
    );
};

export default SystemCard;
