import { getXataClient } from "../../../xata";

const xata = getXataClient();

export default async function handler(req, res) {
  const { term } = req.query;

  let results = await xata.search.all(term, {
    tables: [
      {
        table: "accounts",
        target: [
          { column: "name" },
          { column: "username" },
          { column: "description" },
          { column: "location" },
        ],
        boosters: [
          {
            numericBooster: {
              column: "followers_count",
              factor: 1,
              // modifier: "ln",
            },
          },
        ],
      },
    ],
    prefix: "phrase",
  });

  results = results.map((result) => {
    const metadata = result.record.getMetadata();
    return {
      record: result.record,
      highlight: metadata.highlight,
      score: metadata.score,
    };
  });

  res.json(results);
}
