const { MongoClient } = require("mongodb");
const assert = require("assert");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const createGreeting = async (req, res) => {
  try {
    const client = await MongoClient(MONGO_URI, options);

    await client.connect();

    const db = client.db("exercise-1");

    const dbResponse = await db.collection("greetings").insertOne(req.body);

    assert.equal(1, dbResponse.insertedCount);

    client.close();

    res.status(201).json({ status: 201, data: req.body });
  } catch ({ message }) {
    res.status(500).json({ status: 500, message });
  }
};

const getGreeting = async (req, res) => {
  const _id = req.params;

  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercise-1");

  db.collection("greetings").findOne({ _id }, (err, result) => {
    result
      ? res.status(200).json({ status: 200, _id, data: result })
      : res.status(404).json({ status: 404, _id, data: "Not Found" });
    client.close();
  });
};

const getGreetings = async (req, res) => {
  const _id = req.params._id;

  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercise-1");

  const greetings = await db.collection("greetings").find().toArray();

  let start = 0;
  let limit = 25;

  if (req.query.start !== undefined) {
    start = Number(req.query.start);
  }

  if (req.query.limit !== undefined) {
    limit = Number(req.query.limit);
  }

  if (greetings.length > 0) {
    res.status(200).json({
      status: 200,
      start: start,
      limit: limit,
      data: greetings.slice(start, start + limit),
    });
  } else {
    res.status(404).json({ status: 404, _id, data: "Not Found" });
  }
  client.close();
};

const deleteGreeting = async (req, res) => {
  const _id = req.params._id;

  const client = await MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db("exercise-1");
    const r = await db.collection("greetings").deleteOne({ _id });
    assert.equal(1, r.deletedCount);
    res.status(204).json("bacon");
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
  client.close();
};

const updateGreeting = async (req, res) => {
  const _id = req.params._id;

  const client = await MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db("exercise-1");
    const newValues = { $set: { hello: req.body.hello } };
    console.log(req.body.hello);

    if (req.body.hello === undefined) {
      throw new Error("you need to enter a greeting");
    }

    const r = await db.collection("greetings").updateOne({ _id }, newValues);
    assert.equal(1, r.matchedCount);
    assert.equal(1, r.modifiedCount);
    res.status(200).json({ status: 200, data: { ...req.body } });
  } catch (err) {
    console.log(err.stack);
    res
      .status(500)
      .json({ status: 500, data: { ...req.body }, message: err.message });
  }
  client.close();
};

module.exports = {
  createGreeting,
  getGreeting,
  getGreetings,
  updateGreeting,
  deleteGreeting,
};
