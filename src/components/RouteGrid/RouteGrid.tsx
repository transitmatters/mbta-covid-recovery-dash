import React, { useMemo, useState } from "react";
import classNames from "classnames";

import { RouteCard } from "components";
import { RouteData } from "types";
import { routeTitles } from "titles";

import { useInfiniteScroll } from "./useInfiniteScroll";
import { sortFunctions, Sort, SortFn } from "./sorting";

import styles from "./RouteGrid.module.scss";

type Props = {
    data: Record<string, RouteData>;
    filter?: (r: RouteData) => boolean;
};

type RouteKindOption = "all" | "bus" | "rapid-transit" | "regional-rail";

const pagination = 12;
const defaultFilter = (x) => !!x;

const getDocumentElement = () => {
    if (typeof document !== "undefined") {
        return document.documentElement;
    }
    return null;
};

const sortOnKey = (data: RouteData[], sortFn: SortFn) => {
    return data.sort((a, b) => {
        const ka = sortFn(a);
        const kb = sortFn(b);
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

const isRidershipSort = (sort: "" | Sort) => {
    return (
        sort === "lowestRidershipFraction" ||
        sort === "highestRidershipFraction" ||
        sort === "lowestTotalRidership" ||
        sort === "highestTotalRidership"
    );
};

const RouteGrid = (props: Props) => {
    const { data, filter = defaultFilter } = props;
    const [limit, setLimit] = useState(pagination);
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState<Sort | "">("");
    const [kindOption, setKindOption] = useState<RouteKindOption>("all");

    const availableItems = useMemo(() => {
        return sortOnKey(
            Object.values(data).filter(
                (routeData) =>
                    filter(routeData) &&
                    matchesQuery(routeData, query) &&
                    matchesRouteKindOption(routeData, kindOption)
            ),
            sortFunctions[sort || "kind"]
        );
    }, [data, filter, query, kindOption, sort]);
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
                    const nextKindOption = e.target.value as RouteKindOption;
                    setKindOption(nextKindOption);
                    setLimit(pagination);
                    if (nextKindOption === "regional-rail" && isRidershipSort(sort)) {
                        setSort("highestServiceFraction");
                    }
                }}
            >
                <option value="all">All routes</option>
                <option value="bus">Bus</option>
                <option value="rapid-transit">Rapid transit</option>
                <option value="regional-rail">Commuter rail</option>
            </select>
        );
    };

    const renderSortDropdown = () => {
        const disableRidership = kindOption === "regional-rail";
        return (
            <select
                className={classNames(styles.select, sort === "kind" && "default")}
                value={sort}
                onChange={(e) => {
                    setSort(e.target.value as Sort);
                    setLimit(pagination);
                }}
            >
                <option value="" disabled>
                    Sort by...
                </option>
                <option value="kind">Service kind</option>
                <option value="highestServiceFraction">Least service cut</option>
                <option value="lowestServiceFraction">Most service cut</option>
                <option value="lowestTotalTrips">Least service</option>
                <option value="highestTotalTrips">Most service</option>
                <option value="lowestRidershipFraction" disabled={disableRidership}>
                    Least ridership retained
                </option>
                <option value="highestRidershipFraction" disabled={disableRidership}>
                    Most ridership retained
                </option>
                <option value="lowestTotalRidership" disabled={disableRidership}>
                    Least ridership
                </option>
                <option value="highestTotalRidership" disabled={disableRidership}>
                    Most ridership
                </option>
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
                {renderSortDropdown()}
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
