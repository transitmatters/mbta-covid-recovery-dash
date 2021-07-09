import React, { useEffect, useRef } from "react";
import Chart from "chart.js";

import styles from "./TopLine.module.scss";

type Props = {
    ChartData: any;
};

const MyChartComponent = (props) => {
    const canvasRef = useRef<null | HTMLCanvasElement>(null);
    useEffect(() => {
        // Gets a reference to the actual canvas element
        console.log;
        const canvasElement = canvasRef.current;
        if (canvasElement) {
            // Returns an object that provides the methods to draw 2D content to a <canvas>
            const canvasContext = canvasElement.getContext('2d');
            new Chart(canvasContext, {type: "line", data: props.ChartData})
        }
    }, [props.data]);
    return (
        <div className={styles.wrapper}>
            <canvas ref={canvasRef} />
            <MyChartComponent ChartData={props.data} width="600" height="250"/>
        </div>
    )
}

export default MyChartComponent;









// const TopLine = (props: Props) => {
//     const { fillerProp } = props;
// }

//export default TopLine;