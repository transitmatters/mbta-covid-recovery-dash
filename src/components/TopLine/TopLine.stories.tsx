import React from "react";

import MyChartComponent from "./TopLine";

var chartData= {
    labels: ['1', '2', '3', '4'],
    datasets: [
        {
            label: 'Current',
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            data: [50, 35, 60, 67]
        }
    ]
}

export default {
    title: "TopLine",
    component: MyChartComponent,
};

export const Default = () => {
    return <MyChartComponent ChartData={chartData} />;
}