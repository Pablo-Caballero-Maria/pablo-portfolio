/** Milan call detail records (sources: the README and the coursework report). */
import type { Project } from "./types";

export const milan: Project = {
  slug: "milan-cdr",
  name: "Milan CDR analytics",
  kind: "Big data · university coursework",
  year: "2026",
  tagline:
    "36 million call detail records from Telecom Italia, loaded and analysed with MongoDB aggregation pipelines.",
  summary:
    "One week of mobile activity in Milan (2–8 December 2013) loaded into MongoDB in about 95 seconds with parallel bulk inserts, then queried to find who the city talks to, which cells are busiest, and how eight very different neighbourhoods live through a week ending in two public holidays.",
  hue: "milan",
  deployment: { kind: "local", note: "Runs locally: a command-line tool against a local MongoDB server" },
  repository: "https://github.com/Pablo-Caballero-Maria/milan-cdr",
  cover: {
    src: "/img/projects/milan-cover.webp",
    alt: "Heat map of total mobile activity per cell in central Milan, with the Duomo, Navigli, Bocconi and Linate cells marked",
    width: 1200,
    height: 750,
  },
  highlights: [
    { value: "36.4M", label: "records, loaded in about 95 seconds" },
    { value: "217", label: "foreign countries Milan talked to that week" },
    { value: "8", label: "neighbourhoods profiled hour by hour" },
  ],
  stack: ["Python 3.14", "PyMongo", "MongoDB 8", "typer", "Plotly", "pytest", "uv · ruff · ty"],
  sections: [
    {
      id: "overview",
      title: "Overview",
      blocks: [
        {
          kind: "paragraph",
          text: "Telecom Italia's *Big Data Challenge* published the activity of Milan's mobile network on a 100 × 100 grid of cells, in ten-minute intervals: SMS and calls in and out, and internet traffic, per country code. I analysed the week of **Monday 2 to Sunday 8 December 2013**: a normal working week followed by a special weekend, with Sant'Ambrogio (Milan's patron saint) on Saturday and the Immaculate Conception, a national holiday, on Sunday.",
        },
        {
          kind: "paragraph",
          text: "The `milan-cdr` command-line tool downloads the files from Harvard Dataverse, loads them, answers each of the eight questions with one command (`uv run milan-cdr run N`) and writes every table and figure with `milan-cdr report`.",
        },
      ],
    },
    {
      id: "loading",
      title: "Loading 36 million documents",
      blocks: [
        {
          kind: "list",
          items: [
            "Each tab-separated line becomes a document. `time` is stored as a BSON date rather than milliseconds, so MongoDB's date operators can work in the Europe/Rome time zone.",
            "Empty activity fields are left out: `$sum` ignores missing fields, so the results are the same and the collection is smaller.",
            "One process per daily file (seven in parallel), each inserting batches of 20,000 documents with `insert_many`; the indexes are built at the end. **36,362,524 documents in about 95 seconds.**",
          ],
        },
        {
          kind: "code",
          language: "python",
          caption: "The heart of the loader (simplified).",
          code: `def parse_line(line):
    cellid, ms, country, *activity = line.rstrip("\\r\\n").split("\\t")
    doc = {"cellid": int(cellid), "time": EPOCH + timedelta(milliseconds=int(ms)),
           "countrycode": int(country)}
    doc |= {f: float(v) for f, v in zip(ACTIVITY_FIELDS, activity) if v}
    return doc

with ProcessPoolExecutor(max_workers=7) as pool:
    list(pool.map(load_one, files))   # each worker: insert_many in batches of 20,000
coll.create_index([("cellid", 1), ("time", 1)])`,
        },
      ],
    },
    {
      id: "countries",
      title: "Who Milan talks to",
      blocks: [
        {
          kind: "paragraph",
          text: "Grouping by country code gives 305 codes, which the `phonenumbers` library maps to **218 countries** including Italy (some codes add area digits to the +1 zone, such as 1416 for Canada). Which foreign country leads depends on what you count:",
        },
        {
          kind: "table",
          caption: "The top foreign countries by total activity, and by SMS + calls only.",
          head: ["Country", "SMS + calls", "Internet", "Total"],
          rows: [
            ["France", "220,572", "253,595", "474,168"],
            ["United Kingdom", "248,574", "192,967", "441,540"],
            ["Germany", "131,212", "306,345", "437,557"],
            ["Switzerland", "224,736", "109,119", "333,856"],
            ["Egypt", "264,659", "2,176", "266,835"],
          ],
        },
        {
          kind: "list",
          items: [
            "**France** leads total activity, driven by internet: according to the dataset's documentation that traffic comes from foreign SIM cards, so these are visitors roaming in Milan.",
            "**Egypt** leads person-to-person communication: 85 % of its activity is outgoing calls with almost no internet, that is, people living in Milan calling home. Bangladesh, Ukraine, the Philippines, Sri Lanka and Senegal follow the same pattern.",
            "Many small countries total exactly 3.14, 6.28 or 9.42: after Telecom Italia's anonymisation one event seems to weigh about π, so values are proportional to events but only meaningful relative to each other.",
          ],
        },
      ],
    },
    {
      id: "cells",
      title: "Busiest cells",
      blocks: [
        {
          kind: "paragraph",
          text: "Instead of six queries, one `$group` by cell feeds a `$facet` that ranks all 9,998 cells by every metric in parallel. Cell **5161**, diagonally next to the Duomo's, has the most activity overall, the most internet and the most traffic with other countries, and the ten cells that talk most with abroad are all in the historic centre. The exception is outgoing SMS, led by cell 4756, which sends three times as many as it receives (the city as a whole receives almost twice what it sends): probably a bulk SMS sender.",
        },
        {
          kind: "code",
          language: "javascript",
          caption: "The busiest cell for every metric, in one aggregation.",
          code: `db.Milan_CDR_c.aggregate([
  {$group: {_id: "$cellid", smsin: {$sum: "$smsin"}, smsout: {$sum: "$smsout"},
            callin: {$sum: "$callin"}, callout: {$sum: "$callout"},
            internet: {$sum: "$internet"}}},
  {$addFields: {total: {$add: ["$smsin", "$smsout", "$callin", "$callout", "$internet"]}}},
  {$facet: {
    smsin: [{$sort: {smsin: -1}}, {$limit: 5}],
    smsout: [{$sort: {smsout: -1}}, {$limit: 5}],
    // … the same for callin, callout, internet and total
  }}
], {allowDiskUse: true})`,
        },
        {
          kind: "paragraph",
          text: "Two derived collections make the rest instant: one document per cell (9,998 documents in about 24 s with `$out`; cells 5239 and 5339 never appear) and one per cell and hour, truncated with `$dateTrunc` in Milan's time zone (1,679,556 documents in about 33 s).",
        },
        {
          kind: "figure",
          figure: {
            src: "/img/projects/milan-cell-map.webp",
            alt: "Heat map of total activity per cell over the whole Milan grid, logarithmic scale, with the eight studied cells marked",
            width: 1200,
            height: 1026,
            caption:
              "Total activity per cell for the week, on a logarithmic scale, with the eight studied cells marked (figure from the report, in Spanish).",
          },
        },
      ],
    },
    {
      id: "neighbourhoods",
      title: "Eight neighbourhoods, eight rhythms",
      blocks: [
        {
          kind: "paragraph",
          text: "For eight given cells, queries over the derived collections compute each cell's volume and rank (`$setWindowFields` with `$rank`), its mix of SMS, calls and internet, its share of foreign traffic and top three countries (`$topN`), its average hourly profile on weekdays and at the weekend, and its weekend-to-weekday ratio.",
        },
        {
          kind: "table",
          caption: "Selected metrics, compared with the city's average cell.",
          head: ["Cell", "× average", "Weekday peak", "Weekend / weekday", "Foreign"],
          rows: [
            ["Bocconi university", "4.83", "12 h", "0.41", "0.49 %"],
            ["Navigli (nightlife)", "10.45", "20 h", "0.94", "0.48 %"],
            ["Duomo", "9.65", "13 h", "0.96", "1.77 %"],
            ["Linate airport", "2.23", "16 h", "0.52", "4.33 %"],
            ["Central residential", "6.51", "18 h", "0.87", "0.56 %"],
            ["Isolated residential", "0.36", "18 h", "0.90", "0.25 %"],
            ["Industrial area", "0.61", "17 h", "0.77", "0.53 %"],
            ["Farmland", "0.09", "16 h", "0.78", "0.65 %"],
          ],
        },
        {
          kind: "figure",
          figure: {
            src: "/img/projects/milan-daily-ratio.webp",
            alt: "Heat map of each cell's daily activity divided by its Monday-to-Friday average, from 2 to 8 December",
            width: 1600,
            height: 856,
            caption:
              "Each day's activity divided by the cell's weekday average: blue is quieter than a weekday, red busier. Bocconi and Linate empty out over the holiday weekend.",
          },
        },
        {
          kind: "list",
          items: [
            "**Bocconi** follows the academic week: a noon peak like a class timetable, 87 % internet, and the weekend falls to 41 % of a weekday.",
            "**Navigli** is the only cell whose weekday peak is at night (20 h), with 22 % of its daily activity between 20 h and midnight against the city's 17 %.",
            "**The Duomo** is daytime and international (1.77 % foreign traffic, led by the United Kingdom, the United States and France); on Saturday 7th, Sant'Ambrogio, it was busier than any weekday.",
            "**Linate** runs on flight times: almost silent from midnight to 5 h, a jump at 6 h, the highest peak-to-trough ratio of the group (22.8) and the most foreign traffic (4.3 %, almost seven times the city's).",
          ],
        },
      ],
    },
    {
      id: "quality",
      title: "Engineering and tests",
      blocks: [
        {
          kind: "paragraph",
          text: "A typed Python 3.14 package: pure functions that build each pipeline, separate modules for loading, analysis, the cell study, plots and reports, and a `typer` CLI whose `--help` doesn't even import PyMongo. The queries are written as Python lists of dictionaries, the same syntax as `mongosh`, so the ones in the report run unchanged in the MongoDB shell. It needs MongoDB 7.0 or later for `$median`, `$topN`, `$dateTrunc` and `$setWindowFields`.",
        },
        {
          kind: "list",
          items: [
            "Unit tests and doctests with pytest, plus **integration tests** that build a synthetic week in a temporary database, run every pipeline and compare its output with the same aggregation computed in Python (skipped when no MongoDB server is available).",
            "Lint and formatting with ruff, types checked with ty, coverage with pytest-cov.",
            "Data under ODbL 1.0, from the Telecom Italia Big Data Challenge (Harvard Dataverse, doi:10.7910/DVN/EGZHFV).",
          ],
        },
      ],
    },
  ],
};
