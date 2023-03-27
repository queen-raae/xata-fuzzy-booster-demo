import { getXataClient } from "../../xata";
import probe from "probe-image-size";

const xata = getXataClient();

const deleteBrokenProfileImageRecords = async (records) => {
  console.log("Probe profile images", records.length);
  const probeProfileImagePromises = records.map(async (record) => {
    try {
      await probe(record.meta.profile_image_url);
      console.log("Do not delete ", record.username);
    } catch (error) {
      await xata.db.accounts.delete(record.id);
      console.log("Deleted ", record.username);
    }
  });
  const probedRecords = await Promise.all(probeProfileImagePromises);
  console.log("Probed profile images", probedRecords.length);
  return probedRecords;
};

export default async function handler(_req, res) {
  let page = await xata.db.accounts
    .select(["id", "username", "meta.profile_image_url"])
    .getPaginated({
      pagination: {
        size: 20,
      },
    });

  let count = 0;

  do {
    try {
      const records = await deleteBrokenProfileImageRecords(page.records);
      count += records.length;

      if (page.hasNextPage()) {
        page = await page.nextPage();
      } else {
        page = null;
        console.log({ brokenImages });
        res.send(`Updated: ${count} accounts`);
      }
    } catch (error) {
      console.log(error.message);
      page = null;
      res.send(`Updated: ${count} accounts`);
    }
  } while (page);
}