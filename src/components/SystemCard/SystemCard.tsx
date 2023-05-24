import React, { useMemo } from "react";

import { CardFrame } from "components";
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
        <CardFrame
            title="System-wide"
            className={styles.systemCard}
            details="Excludes ridership data Green Line surface stations."
        >
            <ServiceRidershipChart
                lineId=""
                lineTitle="System-wide"
                color="#165c96"
                serviceHistory={totalServiceHistory}
                ridershipHistory={totalRidershipHistory}
                startDate={startDate}
            />
        </CardFrame>
    );
};

export default SystemCard;
