import React from "react";
import Component from "./Component";

export default {
    title: "component",
    component: Component,
};

const datum = 2;

export const Default = () => {
    return <Component data={datum}/>;
}