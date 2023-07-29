import { getXataClient } from "../../../xata";

const xata = getXataClient();

export default async function handler(req, res) {
  const { term } = req.query;

  let results = await xata.search.all(term, {
    tables: [
      {
        table: "accounts",
        target: [
          { column: "name", weight: 2 },
          { column: "username", weight: 3 },
          { column: "description" },
          { column: "location" },
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
