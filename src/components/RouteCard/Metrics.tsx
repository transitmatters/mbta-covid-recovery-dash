import React from "react";
import classNames from "classnames";

import { RouteData, ServiceDay } from "types";

import styles from "./RouteCard.module.scss";

type Props = {
    serviceRegimes: RouteData["serviceRegimes"];
    serviceDay: ServiceDay;
};

const Metrics = (props: Props) => {
    const { serviceRegimes, serviceDay } = props;
    const baseline = serviceRegimes.baseline[serviceDay];
    const covid = serviceRegimes.covid[serviceDay];
    const waitTimeDifferential = covid.meanWaitTime - baseline.meanWaitTime;
    const waitTimeDifferentialString =
        waitTimeDifferential > 0 ? `+${waitTimeDifferential}` : waitTimeDifferential.toString();
    const waitTimeDesc = waitTimeDifferential > 0 ? "longer" : "shorter";
    const waitTimeGood = waitTimeDifferential <= 0;
    const totalTripsDifferential = baseline.totalTrips - covid.totalTrips;
    const totalTripsNumberString = Math.abs(totalTripsDifferential).toString();
    const totalTripsVerb = totalTripsDifferential < 0 ? "Added" : "Dropped";
    const totalTripsGood = totalTripsDifferential <= 0;
    const crowdingFactor = covid.crowdingFactor!;
    const crowdingPercentage = Math.round(100 * crowdingFactor - 100);
    const crowdingPercentageDesc = crowdingPercentage > 0 ? "more" : "less";
    const crowdingPercentageString =
        crowdingPercentage > 0 ? `+${crowdingPercentage}%` : `${crowdingPercentage}%`;
    const crowdingPercentageGood = crowdingPercentage <= 0;
    return (
        <div className={styles.metrics}>
            <div className={classNames(styles.metric, totalTripsGood ? "good" : "bad")}>
                <div className="number">{totalTripsNumberString}</div>
                <div className="label">
                    <>
                        Trips
                        <br />
                        {totalTripsVerb}
                    </>
                </div>
            </div>
            <div className={classNames(styles.metric, waitTimeGood ? "good" : "bad")}>
                <div className="number">{waitTimeDifferentialString}</div>
                <div className="label">
                    Min {waitTimeDesc} wait
                    <br />
                    (on average)
                </div>
            </div>
            <div className={classNames(styles.metric, crowdingPercentageGood ? "good" : "bad")}>
                <div className="number">{crowdingPercentageString}</div>
                <div className="label">
                    <>
                        {crowdingPercentageDesc}
                        <br />
                        crowding
                    </>
                </div>
            </div>
        </div>
    );
};

export default Metrics;