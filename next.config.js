const assetPrefix = process.env.BUILD_GH_PAGES === "true" ? "./" : undefined;

module.exports = {
    output: "export",
    images: {
        unoptimized: true,
    },
    assetPrefix,
};
