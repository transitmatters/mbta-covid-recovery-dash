import React, { useEffect, useRef } from "react";
import Chart from "chart.js";
import { SummaryData } from "types";

import styles from "./TopLine.module.scss";

type Props = {
    ridershipData: SummaryData["totalRidershipHistory"];
    serviceData: SummaryData["totalServiceHistory"];
};

const TopLine = (props) => {
    const divArr = [] as any;
    for (let i = 0; i < 2; ++i) {
    const canvasRef = useRef<null | HTMLCanvasElement>(null);
        useEffect(() => {
            // Gets a reference to the actual canvas element
            const canvasElement = canvasRef.current;
            if (canvasElement) {
                // Returns an object that provides the methods to draw 2D content to a <canvas>
                const canvasContext = canvasElement.getContext('2d');
                if (i == 0) {
                    new Chart(canvasContext, {type: "doughnut", data: props.ridershipData, options: {
                        legend: {
                          display: false,
                        }
                    }});
                } else {
                    new Chart(canvasContext, {type: "line", data: props.serviceData, options: {
                        legend: {
                            display: false,
                          },
                        scales: {
                          xAxes: [{
                            gridLines: {
                              drawBorder: false,
                            },
                            ticks : {
                                display : false,
                            },
                          }],
                          yAxes: [{
                            gridLines: {
                              drawBorder: false,
                            },
                            ticks : {
                                display : false,
                            },
                          }]
                        },
                        elements: {
                          point:{
                              radius: 0
                          }
                      },
                      },});
                }
                Chart.defaults.scale.gridLines.drawOnChartArea = false;
                Chart.defaults.scale.axisLines = false;
            }
        }, [props.ridershipData]);

        divArr.push(
            <div className={styles.flexCol} key={i}>
                <canvas ref={canvasRef} />
            </div>
        );
    }
    return (
        <div className={styles.flexWrap}>
            {divArr}
        </div>
        
    );
}

export default TopLine;