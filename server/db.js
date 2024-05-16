const pg = require("pg");
const { v4: uuidv4 } = require("uuid");

const { Client } = pg;

const client = new Client(
  process.env.DATABASE_URL || {
    database: "",
  }
);

const createTables = async () => {
  const SQL = `
        DROP TABLE IF EXISTS vacation;
        DROP TABLE IF EXISTS "user";
        DROP TABLE IF EXISTS place;

        CREATE TABLE "user" (
            id UUID PRIMARY KEY,
            name VARCHAR NOT NULL UNIQUE
        );
        CREATE TABLE place (
            id UUID PRIMARY KEY,
            name VARCHAR NOT NULL UNIQUE
        );
        CREATE TABLE vacation (
            id UUID PRIMARY KEY,
            user_id UUID REFERENCES "user"(id) NOT NULL,
            place_id UUID REFERENCES place(id) NOT NULL,
            travel_date DATE NOT NULL
        );
    `;
  await client.query(SQL);
  return;
};

const createUser = (name) => {
  const SQL = `
        INSERT INTO "user" (id, name)
        VALUES ($1, $2)
    `;
  client.query(SQL, [uuidv4(), name]);
};

const createPlace = (name) => {
  const SQL = `
        INSERT INTO place (id, name)
        VALUES ($1, $2)
    `;
  client.query(SQL, [uuidv4(), name]);
};

module.exports = {
  client,
  createTables,
  createUser,
  createPlace,
};
