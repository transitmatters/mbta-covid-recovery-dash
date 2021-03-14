import React, { useMemo } from "react";
import { ResponsiveLine } from "@nivo/line";
import { linearGradientDef } from "@nivo/core";

import { TripsPerHour } from "types";
import { getHourlyTickValues, getTimeSeriesForTph, stringify12Hour } from "time";

import styles from "./RouteCard.module.scss";

const lineTickValues = getHourlyTickValues(2);

type Props = {
    tph: TripsPerHour;
    highestTph: number;
    color: string;
    year: string;
};

const linearGradient = linearGradientDef("gradient", [
    { offset: 0, color: "inherit" },
    { offset: 100, color: "inherit", opacity: 0 },
]);

const TphChart = (props: Props) => {
    const { color, year, tph, highestTph } = props;
    const timeSeries = useMemo(() => getTimeSeriesForTph(tph), [tph]);

    const renderTooltip = (item) => {
        const {
            point: {
                data: { x: time, y: trips },
            },
        } = item;
        const tripsPlural = trips === 1 ? "trip" : "trips";
        return (
            <div className={styles.tooltip}>
                <b>{time}:</b> {trips} {tripsPlural}/hour
            </div>
        );
    };

    return (
        <div className={styles.tphChartContainer}>
            <div style={{ color: color }} className={styles.tphChartLabel}>
                {year}
            </div>
            <ResponsiveLine
                data={[{ id: "service", data: timeSeries }]}
                yFormat={stringify12Hour}
                yScale={{ type: "linear", min: 0, max: highestTph }}
                curve="step"
                colors={[color]}
                enablePoints={false}
                enableGridY={false}
                enableGridX={false}
                enableCrosshair={false}
                animate={false}
                tooltip={renderTooltip}
                enableArea
                useMesh
                areaOpacity={0.2}
                margin={{ top: 5, right: 0, bottom: 20, left: 0 }}
                defs={[linearGradient]}
                fill={[{ match: "*", id: "gradient" }]}
                axisLeft={{ tickValues: [] }}
                axisBottom={{
                    tickValues: lineTickValues,
                    tickPadding: 5,
                    tickSize: 0,
                    tickRotation: 0,
                }}
            />
        </div>
    );
};

export default TphChart;
