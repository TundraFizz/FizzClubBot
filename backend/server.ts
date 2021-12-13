/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-process-env */

import express, { Express } from "express";       // Express type
import bodyParser           from "body-parser";   // Allows you to read POST data
import cookieParser         from "cookie-parser"; // Cookies
import cors                 from "cors";          // CORS
import fs                   from "fs";            // File system
import Snoowrap             from "snoowrap";      // Snoowrap
import * as yaml            from "js-yaml";       // Parse .yaml files
import { Database }         from "./db";
import { Config, DatabaseInfo } from "./interfaces";
// Load configuration and set the single guild that the bot will run for
const config = yaml.load(fs.readFileSync(`config-${process.env.mode}.yml`, "utf-8")) as Config;

const snoowrap = new Snoowrap({
  userAgent   : `${config.PLATFORM}:${config.CLIENT_ID}:${config.VERSION}`,
  clientId    : config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
  username    : config.REDDIT_USER,
  password    : config.REDDIT_PASS
});

// Setup the database
const dbInfo: DatabaseInfo = {
  host    : config.mysql.host,
  user    : config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database
};
const db: Database = new Database(dbInfo);

// Setup the express server and listen on a port
const app: Express = express();                   // Create the server
app.use(bodyParser.json({limit: "10mb"}));        // Setting for bodyParser
app.use(bodyParser.urlencoded({extended: true})); // Setting for bodyParser
app.use(cookieParser());                          // Enable cookie parsing
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(cors({ // CORS Configuration
  origin: [
    "https://tundra.ngrok.io",
    "https://fizz.ngrok.io",
    "https://championmains.club"
  ],
  methods: ["GET", "POST", "PUT", "OPTIONS", "DELETE"],
  allowedHeaders: [
    "Access-Control-Allow-Origin",
    "Authorization",
    "Content-Type"
  ]
}));

const http = require("http").Server(app);
http.listen(80);

export { app, snoowrap, config, db };

// eslint-disable-next-line import/first
import "./website-backend";
