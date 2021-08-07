import fs from "fs";
import path from "path";
import React from "react";
import Head from "next/head";

import { LineGrid } from "components";
import { LineData } from "types";
import { SummaryData } from "types";

type AppData = {
    summaryData: SummaryData;
    lineData: Record<string, LineData>;
};

type Props = {
    data: AppData;
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
                <meta name="author" content="TransitMatters" />
                <meta
                    name="description"
                    content="Data on MBTA ridership and service levels throughout the COVID-19 pandemic"
                />
                <link rel="icon" type="image/png" href="./favicon.png" />
            </Head>
            <LineGrid data={data.lineData} summaryData={data.summaryData} />
        </>
    );
};

export default App;
