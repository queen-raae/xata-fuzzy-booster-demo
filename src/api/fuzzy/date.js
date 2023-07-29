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
            dateBooster: {
              origin: new Date("2006-07-15"),
              column: "created_at",
              decay: 0.8,
              scale: "365d",
              factor: 100,
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
