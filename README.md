# MBTA Covid Recovery Dashboard

[![pages-build-deployment](https://github.com/transitmatters/mbta-covid-recovery-dash/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/transitmatters/mbta-covid-recovery-dash/actions/workflows/pages/pages-build-deployment)
<img width="1904" alt="Screen Shot 2021-08-12 at 3 05 02 PM" src="https://user-images.githubusercontent.com/2208769/129256786-5ac21cce-2d5a-42c3-823a-5533804c2abd.png">

The MBTA Covid Recovery Dashboard is a project by the [TransitMatters Labs](https://transitmatters.org/transitmatters-labs) team to track changes in MBTA service levels and ridership during the Covid-19 pandemic. It draws data from the following sources:

- The [MBTA GTFS feed archive](https://cdn.mbta.com/archive/archived_feeds.txt)
- Some [public data on ridership](https://massdot.app.box.com/s/21j0q5di9ewzl0abt6kdh5x8j8ok9964) updated regularly by [MassDOT OPMI](https://www.mass.gov/transportation-performance)

The root of this repo is a Next.js webapp, but inside the `datagen/` directory is Python code to read and aggregate data from the sources mentioned above. That file updates `data.json`, which is bundled by Next.js into a static site that lives in the `docs/` directory. We host that static site on [recovery.transitmatters.org](https://recovery.transitmatters.org).

The computations on the ridership data and the GTFS feeds in particular can be very slow, so we cache intermediate results in the following directories:

```
datagen/gtfs/.data
datagen/ridership/.data
```

You can force some computations to re-run by selectively deleting files from these.

## Setup

To initialize a Python virtual environment and install Python and JavaScript dependencies, run:

```
make setup-env
```

## Secrets

The setup process creates a `datagen/secrets.py`. TransitMatters members have a `BOX_ACCESS_TOKEN` from a free [Box developer account](https://developer.box.com/guides/authentication/tokens/) which should be copied into this file. If you don't want to bother with this step, you can read cached ridership data from a specific date in by modifying `RIDERSHIP_TARGET_DATE` in `datagen/config.py`:

```py
RIDERSHIP_TARGET_DATE = date(2021, 8, 8)
```

This date must match one of the subdirectories in `datagen/ridership/.data`, e.g. `20210808`.

## Building and running the app

To run the webapp locally with the data present in `data.json`, run:

```
npm run dev
```

To rebuild `data.json` with the latest data, run:

```
make update-data
```

To build a production version of the site in `docs/`, run:

```
npm run build-static
```

To update `data.json`, rebuild the production site, _and_ make a Git commit of the changes, run:

```
make update
```

This is what we use to periodically update the production site.

## Support TransitMatters

If you've found this app helpful or interesting, please consider [donating](https://transitmatters.org/donate) to TransitMatters to help support our mission to provide data-driven advocacy for a more reliable, sustainable, and equitable transit system in Metropolitan Boston.
