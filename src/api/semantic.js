import { Configuration, OpenAIApi } from "openai";
import { getXataClient } from "../../xata";

const xata = getXataClient();

const openAIConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openAI = new OpenAIApi(openAIConfig);

export default async function handler(req, res) {
  const { term } = req.query;

  const response = await openAI.createEmbedding({
    input: term,
    model: "text-embedding-ada-002",
  });
  const [{ embedding }] = response.data.data;

  const records = await xata.db.accounts.vectorSearch("embedding", embedding, {
    size: 20,
  });

  const enrichedResults = records.map((record) => {
    return {
      record: record,
      ...record.getMetadata(),
    };
  });

  res.json(enrichedResults);
}
