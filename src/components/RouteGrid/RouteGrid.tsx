import React from "react";

import { RouteCard } from "components";
import { RouteData } from "types";

import styles from "./RouteGrid.module.scss";

type Props = {
    data: Record<string, RouteData>;
    filter?: (r: RouteData) => boolean;
};

const defaultFilter = (x) => !!x;

const RouteGrid = (props: Props) => {
    const { data, filter = defaultFilter } = props;
    return (
        <div className={styles.routeGrid}>
            {Object.entries(data).map(([routeId, routeData]) => {
                if (filter(routeData)) {
                    return <RouteCard key={routeId} routeData={routeData} />;
                }
                return null;
            })}
        </div>
    );
};

export default RouteGrid;
