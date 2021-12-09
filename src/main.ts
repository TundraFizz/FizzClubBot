import { Config } from "./interfaces";
import * as fs from "fs";
import yaml from "js-yaml";
import Snoowrap from "snoowrap";
// import Snoostorm from "snoostorm";
// import axios from "axios";

const config = yaml.load(fs.readFileSync("config.yml", "utf-8")) as Config;

const app = new Snoowrap({
  userAgent   : `${config.PLATFORM}:${config.CLIENT_ID}:${config.VERSION}`,
  clientId    : config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
  username    : config.REDDIT_USER,
  password    : config.REDDIT_PASS
});

async function Main() {
  const sr = app.getSubreddit("FizzClubBotSandbox");
  console.log(await sr.getMyFlair());
  // console.log(await sr.getLinkFlairTemplates());
  // // console.log(await sr.getUserFlair());
  // console.log(await sr.getUserFlairList());
  // console.log(await sr.getUserFlairTemplates());
  console.log();
  // console.log();

  // "user_agent" can be anything, but the recommended format is <platform>:<app ID>:<version string> (by u/<Reddit username>)
  // "client_id" is your "personal use script" from step 2
  // "client_secret" is your "secret" from step 2
  // android:com.example.myredditapp:v1.2.3

  // const headers = {
  //   "user-agent" : `${PLATFORM}:${APP_ID}:${VERSION}`,
  //   client_id    : APP_ID,
  //   client_secret: SECRET,
  //   response_type: "code",
  //   state        : "This is a test state",
  //   redirect_uri : REDIRECT_URI,
  //   duration     : "temporary",
  //   scope        : SCOPE
  // };

  // const res = await axios.get(url, headers);

  // console.log(res);
}

Main();
