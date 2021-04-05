import fs from "fs";
import path from "path";
import React from "react";
import Head from "next/head";

import { LineGrid } from "components";
import { LineData } from "types";

type Props = {
    data: Record<string, LineData>;
};

const PATH_TO_DATA = path.join(process.cwd(), "data.json");

export async function getStaticProps() {
    const dataContents = fs.readFileSync(PATH_TO_DATA).toString();
    const data = JSON.parse(dataContents);
    return {
        props: { data },
    };
}

const App = (props: Props) => {
    const { data } = props;
    return (
        <>
            <Head>
                <title>MBTA Covid Recovery Dashboard</title>
            </Head>
            <LineGrid data={data} />
        </>
    );
};

export default App;
