import fs from "fs";
import path from "path";
import React from "react";

import { RouteGrid } from "components";
import { RouteData } from "types";

type Props = {
    data: Record<string, RouteData>;
};

const PATH_TO_DATA = path.join(process.cwd(), "data.json");

const TEST_ROUTE_IDS = [
    "Red",
    "Blue",
    "Orange",
    "1",
    "71",
    "10",
    "15",
    "57",
    "22",
    "23",
    "47",
    "66",
    "28",
    "39",
    "66",
    "55",
];

const testFilter = (r) => TEST_ROUTE_IDS.includes(r.id);
const okFilter = (r) => r.routeHistory && r.serviceHistory;

export async function getStaticProps() {
    const dataContents = fs.readFileSync(PATH_TO_DATA).toString();
    const data = JSON.parse(dataContents);
    return {
        props: { data },
    };
}

const App = (props: Props) => {
    const { data } = props;
    return <RouteGrid data={data} filter={testFilter} />;
};

export default App;
