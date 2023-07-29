import { getXataClient } from "../../xata";

const xata = getXataClient();

export default async function handler(req, res) {
  const { id } = req.query;

  const record = await xata.db.accounts.read(id);

  try {
    const updated = await xata.db.accounts.createOrUpdate({
      ...record,
      id: record.id + "-2",
      created_at: new Date().toISOString(),
    });

    res.send(`Updated: ${updated.id} account`);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(`Error ${error.message}`);
  }
}
