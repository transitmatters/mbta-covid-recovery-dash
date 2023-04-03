import React from "react";
import classNames from "classnames";

import styles from "./CardFrame.module.scss";

type Props = {
    title: React.ReactNode;
    topRight?: React.ReactNode;
    children: React.ReactNode;
    details?: React.ReactNode;
    className?: string;
};

const CardFrame = (props: Props) => {
    const { title, topRight = null, details = null, children, className } = props;

    const renderTopRow = () => {
        return (
            <div className={styles.topRow}>
                <h2 className={styles.title}>{title}</h2>
                {topRight}
            </div>
        );
    };

    const renderDetails = () => {
        if (details) {
            return <div className={styles.details}>{details}</div>;
        }
        return null;
    };

    return (
        <div className={classNames(styles.cardFrame, className)}>
            {renderTopRow()}
            {renderDetails()}
            {children}
        </div>
    );
};

export default CardFrame;
