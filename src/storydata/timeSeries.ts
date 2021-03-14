import { TimeSeries } from "types";

const DAY_OF_MS = 1000 * 86400;
const WEEK_OF_MS = 7 * DAY_OF_MS;

type CurveParams = {
    baseline?: number;
    amplitude?: number;
    period?: number;
};

const curve = (day: number, params: CurveParams) => {
    const { baseline = 2000, amplitude = 1500, period = 720 } = params;
    return baseline + amplitude * Math.cos((day / period) * 2 * Math.PI);
};

export const createTestTimeSeries = (params: CurveParams = {}) => {
    const series: TimeSeries<string> = [];
    const startDate = new Date("2020-01-06").valueOf();
    const endDate = new Date().valueOf();
    for (let time = startDate; time <= endDate; time += WEEK_OF_MS) {
        const days = (time - startDate) / DAY_OF_MS;
        const value = curve(days, params);
        series.push({ x: new Date(time).toLocaleDateString("en-CA"), y: Math.round(value) });
    }
    return series;
};
