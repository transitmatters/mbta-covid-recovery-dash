import React, { useMemo, useState } from "react";

import { RouteCard } from "components";
import { RouteData } from "types";
import { routeTitles } from "components/RouteCard/titles";

import { useInfiniteScroll } from "./useInfiniteScroll";
import styles from "./RouteGrid.module.scss";

type Props = {
    data: Record<string, RouteData>;
    filter?: (r: RouteData) => boolean;
    sortKey?: (r: RouteData) => string | number;
};

type RouteKindOption = "all" | "bus" | "rapid-transit" | "regional-rail";

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

const matchesQuery = (routeData: RouteData, query: string) => {
    const { id } = routeData;
    const title = routeTitles[id];
    return !query || title?.toLowerCase().includes(query) || id.toLowerCase().includes(query);
};

const matchesRouteKindOption = (routeData: RouteData, option: RouteKindOption) => {
    const { routeKind } = routeData;
    if (option === "all") {
        return true;
    }
    if (option === "regional-rail" || option === "bus") {
        return routeKind === option;
    }
    return routeKind !== "regional-rail" && routeKind !== "bus";
};

const RouteGrid = (props: Props) => {
    const { data, filter = defaultFilter, sortKey = defaultSortKey } = props;
    const [limit, setLimit] = useState(pagination);
    const [query, setQuery] = useState("");
    const [kindOption, setKindOption] = useState<RouteKindOption>("all");

    const availableItems = useMemo(() => {
        return sortOnKey(
            Object.values(data).filter(
                (routeData) =>
                    filter(routeData) &&
                    matchesQuery(routeData, query) &&
                    matchesRouteKindOption(routeData, kindOption)
            ),
            sortKey
        );
    }, [data, filter, query, kindOption]);
    const shownItems = useMemo(() => availableItems.slice(0, limit), [availableItems, limit]);

    useInfiniteScroll({
        element: getDocumentElement(),
        enabled: limit < availableItems.length,
        scrollTolerance: 300,
        onRequestMoreItems: () => setLimit((l) => l + pagination),
    });

    const renderRouteKindDropdown = () => {
        return (
            <select
                className={styles.select}
                value={kindOption}
                onChange={(e) => {
                    setKindOption(e.target.value as RouteKindOption);
                    setLimit(pagination);
                }}
            >
                <option value="all">All routes</option>
                <option value="bus">Bus</option>
                <option value="rapid-transit">Rapid transit</option>
                <option value="regional-rail">Commuter rail</option>
            </select>
        );
    };

    return (
        <div className={styles.routeGridWrapper}>
            <h1 className={styles.header}>
                MBTA Covid Recovery Dashboard
                <div className={styles.alphaTag}>Alpha</div>
            </h1>
            <div className={styles.controls}>
                <input
                    placeholder="Filter routes"
                    className={styles.filter}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value.toLowerCase().trim());
                        setLimit(pagination);
                    }}
                />
                {renderRouteKindDropdown()}
            </div>
            <div className={styles.routeGrid}>
                {shownItems.map((item) => (
                    <RouteCard routeData={item} key={item.id} />
                ))}
            </div>
        </div>
    );
};

export default RouteGrid;
