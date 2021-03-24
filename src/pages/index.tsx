import fs from "fs";
import path from "path";
import React from "react";

import { RouteGrid } from "components";
import { RouteData } from "types";

type Props = {
    data: Record<string, RouteData>;
};

const PATH_TO_DATA = path.join(process.cwd(), "data.json");

const garbageFilter = ({ id, ridershipHistory }: RouteData) => {
    if (id.startsWith("Boat") || id.startsWith("Shuttle")) {
        return false;
    }
    if (id.startsWith("CR-")) {
        return true;
    }
    return !!ridershipHistory;
};

export async function getStaticProps() {
    const dataContents = fs.readFileSync(PATH_TO_DATA).toString();
    const data = JSON.parse(dataContents);
    return {
        props: { data },
    };
}

const App = (props: Props) => {
    const { data } = props;
    return <RouteGrid data={data} filter={garbageFilter} />;
};

export default App;
