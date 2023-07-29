import { getXataClient } from "../../xata";

const xata = getXataClient();

export default async function handler(_req, res) {
  let page = await xata.db.accounts
    .select([
      "id",
      "meta.created_at",
      "meta.location",
      "meta.description",
      "public_metrics.followers_count",
    ])
    .getPaginated({
      pagination: {
        size: 20,
      },
    });

  let count = 0;

  do {
    try {
      const records = await xata.db.accounts.update(
        page.records.map((record) => {
          return {
            id: record.id,
            created_at: record.meta.created_at,
            location: record.meta.location,
            description: record.meta.description,
            followers_count: record.public_metrics.followers_count,
          };
        })
      );
      count += records.length;

      if (page.hasNextPage()) {
        page = await page.nextPage();
      } else {
        page = null;
        res.send(`Updated: ${count} accounts`);
      }
    } catch (error) {
      console.log(error.message);
      page = null;
      res.send(`Updated: ${count} accounts`);
    }
  } while (page);
}
