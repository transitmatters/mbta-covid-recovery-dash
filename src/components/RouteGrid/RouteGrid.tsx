import React, { useMemo, useState } from "react";

import { RouteCard } from "components";
import { RouteData } from "types";

import { useInfiniteScroll } from "./useInfiniteScroll";
import styles from "./RouteGrid.module.scss";

type Props = {
    data: Record<string, RouteData>;
    filter?: (r: RouteData) => boolean;
};

const pagination = 12;
const defaultFilter = (x) => !!x;

const getDocumentElement = () => {
    if (typeof document !== "undefined") {
        return document.documentElement;
    }
    return null;
};

const RouteGrid = (props: Props) => {
    const { data, filter = defaultFilter } = props;
    const [limit, setLimit] = useState(pagination);

    const availableItems = useMemo(() => Object.values(data).filter(filter), [data, filter]);
    const shownItems = useMemo(() => availableItems.slice(0, limit), [availableItems, limit]);

    useInfiniteScroll({
        element: getDocumentElement(),
        enabled: limit < availableItems.length,
        scrollTolerance: 1000,
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
