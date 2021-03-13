import { TripsPerHour } from "types";

const preService = [0, 0, 0, 0, 0] as const;

const lowPeak = [2, 3, 3, 2, 2] as const;
const lowMidday = [1, 2, 1, 2, 1, 2] as const;
const lowEvening = [1, 1, 1] as const;

const highPeak = [3, 4, 4, 5, 3] as const;
const highMidday = [2, 3, 3, 2, 3, 2] as const;
const highEvening = [2, 2, 2] as const;

export const lowTph: TripsPerHour = [
    ...preService,
    ...lowPeak,
    ...lowMidday,
    ...lowPeak,
    ...lowEvening,
] as const;

export const highTph: TripsPerHour = [
    ...preService,
    ...highPeak,
    ...highMidday,
    ...highPeak,
    ...highEvening,
] as const;