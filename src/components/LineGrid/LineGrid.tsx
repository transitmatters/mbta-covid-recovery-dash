import React, { useMemo, useState } from "react";
import classNames from "classnames";

import { LineCard } from "components";
import { LineData } from "types";

import { useInfiniteScroll } from "./useInfiniteScroll";
import { sortFunctions, Sort, SortFn } from "./sorting";

import styles from "./LineGrid.module.scss";

type Props = {
    data: Record<string, LineData>;
    filter?: (r: LineData) => boolean;
};

type LineKindOption = "all" | "bus" | "rapid-transit" | "regional-rail";
type DisplayOption = "grid" | "rows";

const pagination = 12;
const defaultFilter = (x) => !!x;

const getDocumentElement = () => {
    if (typeof document !== "undefined") {
        return document.documentElement;
    }
    return null;
};

const sortOnKey = (data: LineData[], sortFn: SortFn) => {
    const keys = {};
    data.forEach((line) => {
        keys[line.id] = sortFn(line);
    });
    return data.sort((a, b) => {
        const ka = keys[a.id];
        const kb = keys[b.id];
        if (ka === kb) {
            return 0;
        } else {
            return ka > kb ? 1 : -1;
        }
    });
};

const matchesQuery = (lineData: LineData, query: string) => {
    const { id } = lineData;
    const title = lineData.shortName || lineData.longName;
    return !query || title?.toLowerCase().includes(query) || id.toLowerCase().includes(query);
};

const matchesLineKindOption = (lineData: LineData, option: LineKindOption) => {
    const { lineKind } = lineData;
    if (option === "all") {
        return true;
    }
    if (option === "regional-rail" || option === "bus") {
        return lineKind === option;
    }
    return lineKind !== "regional-rail" && lineKind !== "bus";
};

const isRidershipSort = (sort: "" | Sort) => {
    return (
        sort === "lowestRidershipFraction" ||
        sort === "highestRidershipFraction" ||
        sort === "lowestTotalRidership" ||
        sort === "highestTotalRidership"
    );
};

const LineGrid = (props: Props) => {
    const { data, filter = defaultFilter } = props;
    const [limit, setLimit] = useState(pagination);
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState<Sort | "">("");
    const [display, setDisplay] = useState<DisplayOption>("grid");
    const [kindOption, setKindOption] = useState<LineKindOption>("all");

    const availableItems = useMemo(() => {
        return sortOnKey(
            Object.values(data).filter(
                (lineData) =>
                    filter(lineData) &&
                    matchesQuery(lineData, query) &&
                    matchesLineKindOption(lineData, kindOption)
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

    const renderLineKindDropdown = () => {
        return (
            <select
                className={styles.select}
                value={kindOption}
                onChange={(e) => {
                    const nextKindOption = e.target.value as LineKindOption;
                    setKindOption(nextKindOption);
                    setLimit(pagination);
                    if (nextKindOption === "regional-rail" && isRidershipSort(sort)) {
                        setSort("highestServiceFraction");
                    }
                }}
            >
                <option value="all">All lines</option>
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

    const renderDisplayDropdown = () => {
        return (
            <select
                value={display}
                className={classNames(styles.select, styles.displaySelect)}
                onChange={(e) => setDisplay(e.target.value as DisplayOption)}
            >
                <option value="grid">Show grid</option>
                <option value="rows">Show rows</option>
            </select>
        );
    };

    return (
        <div className={styles.lineGridWrapper}>
            <h1 className={styles.header}>
                MBTA Covid Recovery Dashboard
                <div className={styles.alphaTag}>Alpha</div>
            </h1>
            <div className={styles.controls}>
                <input
                    placeholder="Filter lines"
                    className={styles.filter}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value.toLowerCase().trim());
                        setLimit(pagination);
                    }}
                />
                {renderLineKindDropdown()}
                {renderSortDropdown()}
                {renderDisplayDropdown()}
            </div>
            <div className={classNames(styles.lineGrid, display)}>
                {shownItems.map((item) => (
                    <LineCard lineData={item} key={item.id} />
                ))}
            </div>
        </div>
    );
};

export default LineGrid;
