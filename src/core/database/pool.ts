const { Pool } = require("pg");
import { PoolClient } from "pg";
require("dotenv").config({ path: `${__dirname}/../../.env` });

let devMode: boolean = process.env.DEV_MODE === "true" ? true : false;

// Connection string
const user = devMode ? process.env.DEV_USER : process.env.PROD_USER;
const host = devMode ? process.env.DEV_HOST : process.env.PROD_HOST;
const database = devMode ? process.env.DEV_DATABASE : process.env.PROD_DATABASE;
const password = devMode ? process.env.DEV_PASSWORD : process.env.PROD_PASSWORD;
const port = devMode
  ? process.env.DEV_POSTGRES_PORT
  : process.env.PROD_POSTGRES_PORT;

// Creating the pool:
export const pool: PoolClient = new Pool({
  user: user,
  host: host,
  database: database,
  password: password,
  port: port,
});
