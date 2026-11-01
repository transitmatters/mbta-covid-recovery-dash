import React from "react";
import classNames from "classnames";
import { useTabStore, TabList, Tab } from "@ariakit/react";

import styles from "./TabPicker.module.scss";

type MinimalItem<Value> = { value: Value; label: string };

type Props<Value> = {
    "aria-label": string;
    baseId: string;
    className?: string;
    items: MinimalItem<Value>[];
    onSelectValue: (v: Value) => unknown;
    style?: React.CSSProperties;
    tabClassName?: string;
    value: Value;
};

const getTabId = (baseId: string, value: string) => `${baseId}-${value}`;

const TabPicker = <Value extends string>(props: Props<Value>) => {
    const {
        "aria-label": ariaLabel,
        baseId,
        className,
        items,
        onSelectValue,
        style = {},
        tabClassName,
        value,
    } = props;
    const tabStore = useTabStore({
        defaultSelectedId: getTabId(baseId, value),
        setSelectedId: (selectedId) => {
            const item = items.find((item) => getTabId(baseId, item.value) === selectedId);
            if (item) {
                onSelectValue(item.value);
            }
        },
    });

    return (
        <TabList
            store={tabStore}
            style={style}
            className={classNames(styles.tabList, className)}
            aria-label={ariaLabel}
        >
            {items.map(({ value, label }) => {
                return (
                    <Tab
                        id={getTabId(baseId, value)}
                        className={classNames(styles.tab, tabClassName)}
                        key={value}
                        render={<div />}
                    >
                        <span>{label}</span>
                    </Tab>
                );
            })}
        </TabList>
    );
};

export default TabPicker;
