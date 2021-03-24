import React, { useMemo, useState } from "react";

import { RouteCard } from "components";
import { RouteData } from "types";

import { useInfiniteScroll } from "./useInfiniteScroll";
import styles from "./RouteGrid.module.scss";

type Props = {
    data: Record<string, RouteData>;
    filter?: (r: RouteData) => boolean;
    sortKey?: (r: RouteData) => string | number;
};

const pagination = 12;
const defaultFilter = (x) => !!x;

const colorLines = ["red", "green", "blue", "orange", "silver"];
const keyBusRoutes = [1, 15, 22, 23, 28, 32, 39, 57, 66, 71, 73, 77, 111, 116, 117].map((x) =>
    x.toString()
);

const defaultSortKey = (r: RouteData) => {
    if (colorLines.includes(r.id.toLowerCase())) {
        return 0;
    } else if (keyBusRoutes.includes(r.id)) {
        return 1;
    } else if (r.id.startsWith("CR-")) {
        return 2;
    }
    return 3;
};

const getDocumentElement = () => {
    if (typeof document !== "undefined") {
        return document.documentElement;
    }
    return null;
};

const sortOnKey = (data: RouteData[], sortKey: Props["sortKey"]) => {
    return data.sort((a, b) => {
        const ka = sortKey(a);
        const kb = sortKey(b);
        if (ka === kb) {
            return 0;
        } else {
            return ka > kb ? 1 : -1;
        }
    });
};

const RouteGrid = (props: Props) => {
    const { data, filter = defaultFilter, sortKey = defaultSortKey } = props;
    const [limit, setLimit] = useState(pagination);

    const availableItems = useMemo(() => sortOnKey(Object.values(data).filter(filter), sortKey), [
        data,
        filter,
    ]);
    const shownItems = useMemo(() => availableItems.slice(0, limit), [availableItems, limit]);

    useInfiniteScroll({
        element: getDocumentElement(),
        enabled: limit < availableItems.length,
        scrollTolerance: 300,
        onRequestMoreItems: () => setLimit((l) => l + pagination),
    });

    return (
        <div className={styles.routeGrid}>
            {shownItems.map((item) => (
                <RouteCard routeData={item} key={item.id} />
            ))}
        </div>
    );
};

export default RouteGrid;
