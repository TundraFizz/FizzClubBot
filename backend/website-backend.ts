/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import { app, snoowrap, config, db } from "./server";
import { Request, Response } from "express";
import { Config } from "./interfaces";
import * as fs from "fs";
import yaml from "js-yaml";
import Snoowrap from "snoowrap";
import { sha256 } from "sha.js";
import axios from "axios";

axios.defaults.validateStatus = ():boolean => {return true;};

async function GetAccountData(apiRegion: string, summonerName: string): Promise<string|null> {
  if (summonerName.length < 1) {
    return null;
  }

  // The summoner name must be URI-encoded
  summonerName = encodeURIComponent(summonerName);

  const options = {
    headers: {
      "X-Riot-Token": config.RIOT_API_KEY
    }
  };
  const url = `https://${apiRegion}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${config.RIOT_API_KEY}`;

  try {
    const res = await axios.get(url, options);
    return res.data.id; // encryptedSummonerId

    // {
    //   id           : "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    //   accountId    : "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    //   puuid        : "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    //   name         : "Tundra Fizz",
    //   profileIconId: 773,
    //   revisionDate : 1636941431000,
    //   summonerLevel: 217
    // }
  } catch (error) {
    return null;
  }
}

async function GetThirdPartyCode(apiRegion: string, encryptedSummonerId: string): Promise<string> {
  const options = {
    headers: {
      "X-Riot-Token": config.RIOT_API_KEY
    }
  };
  const url = `https://${apiRegion}.api.riotgames.com/lol/platform/v4/third-party-code/by-summoner/${encryptedSummonerId}?api_key=${config.RIOT_API_KEY}`;
  const res = await axios.get(url, options);
  return res.data;
}

async function GetChampionMasteryPoints(apiRegion: string, encryptedSummonerId: string, championId: number): Promise<number> {
  const options = {
    headers: {
      "X-Riot-Token": config.RIOT_API_KEY
    }
  };
  const url = `https://${apiRegion}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${encryptedSummonerId}/by-champion/${championId}?api_key=${config.RIOT_API_KEY}`;
  const res = await axios.get(url, options);
  return res.data.championPoints;

  // {
  //   championId                  : 105,
  //   championLevel               : 7,
  //   championPoints              : 629085,
  //   lastPlayTime                : 1636887040000,
  //   championPointsSinceLastLevel: 607485,
  //   championPointsUntilNextLevel: 0,
  //   chestGranted                : true,
  //   tokensEarned                : 0,
  //   summonerId                  : "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  // }
}

async function GetLeagueRank(apiRegion: string, encryptedSummonerId: string): Promise<string|null> {
  const ranks: {[index: string]: number} = {
    UNRANKED   : 0,
    IRON       : 1,
    BRONZE     : 2,
    SILVER     : 3,
    GOLD       : 4,
    PLATINUM   : 5,
    DIAMOND    : 6,
    MASTER     : 7,
    GRANDMASTER: 8,
    CHALLENGER : 9
  };

  const options = {
    headers: {
      "X-Riot-Token": config.RIOT_API_KEY
    }
  };

  const url = `https://${apiRegion}.api.riotgames.com/lol/league/v4/entries/by-summoner/${encryptedSummonerId}?api_key=${config.RIOT_API_KEY}`;
  const res = await axios.get(url, options);

  // [
  //   {
  //     leagueId    : "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  //     queueType   : "RANKED_SOLO_5x5",
  //     tier        : "GOLD",
  //     rank        : "II",
  //     summonerId  : "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  //     summonerName: "Tundra Fizz",
  //     leaguePoints: 21,
  //     wins        : 6,
  //     losses      : 6,
  //     veteran     : false,
  //     inactive    : false,
  //     freshBlood  : false,
  //     hotStreak   : false
  //   }
  // ]

  let currentTier = null;

  // Get the best tier
  for (const obj of res.data) {
    if (currentTier === null) {
      currentTier = obj.tier;
      continue;
    }

    const value = ranks[obj.tier];

    if (value > ranks[currentTier]) {
      currentTier = obj.tier;
    }
  }

  return currentTier;
}

async function GetFlairChampionMastery(subredditName: string, championMasteryPoints: number): Promise<string|null> {
  const mastery: {[index: number]: string} = {};
  const rows = await db.GetChampionMastery(subredditName);

  for (const row of rows) {
    const { pointsRequired, text } = row;
    mastery[pointsRequired] = text;
  }

  let hash = null;

  for (const key in mastery) {
    const points = parseInt(key, 10);

    if (championMasteryPoints >= points) {
      hash = mastery[points];
    } else {
      break;
    }
  }

  return hash;
}

async function GetFlairLeagueRank(subredditName: string, leagueRank: string|null): Promise<[string|null, string|null]> {
  if (leagueRank === null || leagueRank === "UNRANKED") {
    return [null, null];
  }

  // Riot Games gives the league rank string in all UPPERCASE, so I need to make it lowercase and then uppercase the first character
  leagueRank = leagueRank.toLowerCase();
  leagueRank = leagueRank.charAt(0).toUpperCase() + leagueRank.slice(1);

  const ranks: {[index: string]: string} = {};
  const rows = await db.GetLeagueRank(subredditName);

  for (const row of rows) {
    const { rank, flairId } = row;
    ranks[rank] = flairId;
  }

  return [
    leagueRank,
    ranks[leagueRank]
  ];
}

app.post("/check-secret", async (req, res) => {
  const secret = req.body.secret;
  const result = await db.CheckSecret(secret);
  res.status(200).send(result);
});

app.post("/verify-reddit", async (req, res) => {
  const code = req.body.code as string;

  if (code === undefined) {
    res.status(400).send("Bad code");
    return;
  }

  const base64 = Buffer.from(`${config.CLIENT_ID_WEB_APP}:${config.CLIENT_SECRET_WEB_APP}`).toString("base64");

  const options = {
    headers: {
      Authorization : `Basic ${base64}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent"  : `${config.PLATFORM}:${config.CLIENT_ID_WEB_APP}:${config.VERSION}`
    },
    params: {
      grant_type  : "authorization_code",
      code        : code,
      redirect_uri: config.REDIRECT_URI
    }
  };

  const response = await axios.post(`https://www.reddit.com/api/v1/access_token`, {}, options);

  if (!("data" in response)) {
    res.status(500).send("Bad response from Reddit, please try again");
    return;
  }

  if (!("access_token" in response.data)) {
    res.status(400).send("Invalid grant, please try again");
    return;
  }

  const accessToken = response.data.access_token;
  const response2   = await axios.get("https://oauth.reddit.com/api/v1/me", {headers: {Authorization: `Bearer ${accessToken}`}});
  const username    = response2.data.name;

  await db.InsertSecret(username, code);

  res.status(200).send(username);
});

app.post("/verify-league", async (req, res) => {
  // Hash the Summoner Name to generate a verification code (shortened to 8 characters)
  const name      = req.body.name;
  const region    = req.body.region;
  const secret    = req.body.secret;
  const subreddit = req.body.subreddit;
  const hash      = (new sha256().update(name.toLowerCase().replace(/\s/g, "")).digest("hex")).substring(0, 8); // eslint-disable-line

  const championId = await db.GetChampionIdFromSubreddit(subreddit);

  if (championId === null) {
    res.status(400).send("Invalid champion mains subreddit");
    return;
  }

  const username   = await db.CheckSecret(secret);

  if (username === null) {
    res.status(400).send("Your Reddit account has been desynchronized, please click on the \"Disconnect\" button and re-verify your Reddit account");
    return;
  }

  // Get the encrypted summoner id
  const encryptedSummonerId = await GetAccountData(region, name);

  if (typeof encryptedSummonerId !== "string") {
    res.status(400).send("Invalid summoner name and region");
    return;
  }

  const thirdPartyCode = await GetThirdPartyCode(region, encryptedSummonerId);

  if (hash !== thirdPartyCode) {
    res.status(400).send("Your third-party code is incorrect; please check it and try again.");
    return;
  }

  const championMasteryPoints          = await GetChampionMasteryPoints(region, encryptedSummonerId, championId);
  const leagueRank                     = await GetLeagueRank(region, encryptedSummonerId);
  const flairTextChampionMastery       = await GetFlairChampionMastery(subreddit, championMasteryPoints);
  const [flairTextLeagueRank, flairId] = await GetFlairLeagueRank(subreddit, leagueRank);

  let flairTemplateId = "";
  let text            = "";

  if (flairTextChampionMastery && flairTextLeagueRank) {
    text = `${flairTextChampionMastery} | ${flairTextLeagueRank}`;
  } else if (flairTextChampionMastery) {
    text = flairTextChampionMastery;
  } else if (flairTextLeagueRank) {
    text = flairTextLeagueRank;
  } else {
    res.status(400).send("You don't qualify for any champion mastery or rank flair");
    return;
  }

  if (flairId) {
    flairTemplateId = flairId;
  }

  const flairOptions = {
    subredditName  : subreddit,
    flairTemplateId: flairTemplateId,
    text           : text
  };

  snoowrap.getUser(username).selectFlairUser(flairOptions);

  res.status(200).send("Your flair has been updated");
});

// Notes

// Iron        | #5d5452
// Bronze      | #773b26
// Silver      | #aaa9ad
// Gold        | #a68c00
// Platinum    | #274e4e
// Diamond     | #1d5b7d
// Master      | #39174e
// Grandmaster | #b9191d
// Challenger  | #f0d784
