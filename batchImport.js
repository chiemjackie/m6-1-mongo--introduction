const { MongoClient, Db } = require("mongodb");
const assert = require("assert");
const fs = require("fs");

require("dotenv").config();
const { MONGO_URI } = process.env;

const greetings = JSON.parse(fs.readFileSync("data/greetings.json"));

async function batchImport() {
  try {
    const client = await MongoClient(MONGO_URI, { useUnifiedTopology: true });

    await client.connect();

    const db = client.db("exercise_1");

    const dbResponse = await db.collection("greetings").insertMany(greetings);

    console.log(dbResponse);

    assert.equal(1, dbResponse.insertedCount);

    client.close();
  } catch ({ message }) {
    console.log(message);
  }
}

batchImport();

module.exports = { batchImport };
