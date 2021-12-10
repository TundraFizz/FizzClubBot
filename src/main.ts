import { Config, Flair } from "./interfaces";
import * as fs from "fs";
import yaml from "js-yaml";
import express from "express";
import bodyParser from "body-parser";
import Snoowrap from "snoowrap";
import { sha256 } from "sha.js";
import axios from "axios";
// import cors from "cors";

const config = yaml.load(fs.readFileSync("config.yml", "utf-8")) as Config;

const app = express();
const port = 8001;
app.use(bodyParser.json());                         // Setting for bodyParser
app.use(bodyParser.urlencoded({"extended": true})); // Setting for bodyParser
// app.use(cors({origin: ["http://localhost", "http://localhost:8001"]})); // Allow CORS for development

const snoowrap = new Snoowrap({
  userAgent   : `${config.PLATFORM}:${config.CLIENT_ID}:${config.VERSION}`,
  clientId    : config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
  username    : config.REDDIT_USER,
  password    : config.REDDIT_PASS
});

// https://www.reddit.com/api/v1/authorize?client_id=UOheMK6_cUy_jkfeBhXSsA&response_type=code&state=thisisatest&redirect_uri=https%3A%2F%2Ftundra.ngrok.io&duration=permanent&scope=identity%20flair%20modflair%20read
// https://www.reddit.com/api/v1/authorize?client_id=UOheMK6_cUy_jkfeBhXSsA&response_type=code&state=thisisatest&redirect_uri=https%3A%2F%2Ftundra.ngrok.io&duration=permanent&scope=identity
// https://www.reddit.com/api/v1/authorize?client_id=UOheMK6_cUy_jkfeBhXSsA&response_type=code&state=thisisatest&redirect_uri=https%3A%2F%2Ftundra.ngrok.io&duration=temporary&scope=identity
// https://www.reddit.com/api/v1/authorize?client_id=UOheMK6_cUy_jkfeBhXSsA&response_type=code&state=0q8DRwTIBhWGnxJlIaGFM6XiK9KMzXN3Pfp3hX6YYSo%3D&redirect_uri=https%3A%2F%2Ftundra.ngrok.io&duration=temporary&scope=identity

app.listen(port);

app.post("/testing1", async (req, res) => {
  res.json({yolo: "swag"});
});

app.post("/testing2", (req, res) => {
  console.log(req.body);
  res.json({mario: "luigi"});
});

app.post("/testing3", (req, res) => {
  console.log(req.body);
  res.json({one: "two"});
});

async function GetAccountData(apiRegion: string, summonerName: string): Promise<string|null> {
  const options = {
    headers: {
      "X-Riot-Token": config.RIOT_API_KEY
    }
  }
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
  }
  const url = `https://${apiRegion}.api.riotgames.com/lol/platform/v4/third-party-code/by-summoner/${encryptedSummonerId}?api_key=${config.RIOT_API_KEY}`;
  const res = await axios.get(url, options);
  return res.data;
}

async function GetChampionMasteryPoints(apiRegion: string, encryptedSummonerId: string, championId: number): Promise<number> {
  const options = {
    headers: {
      "X-Riot-Token": config.RIOT_API_KEY
    }
  }
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
  }
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

async function GetFlairChampionMastery(championMasteryPoints: number): Promise<string|null> {
  const mastery: {[index: number]: string} = {
    100000 : "100k",
    250000 : "250k",
    500000 : "500k",
    1000000: "1 million"
  };

  let hash = null;

  for (let key in mastery) {
    const points = parseInt(key);

    if (championMasteryPoints >= points) {
      hash = mastery[points];
    } else {
      break;
    }
  }

  return hash;
}

async function GetFlairLeagueRank(leagueRank: string|null): Promise<[string|null, string|null]> {
  if (leagueRank === null || leagueRank === "UNRANKED") {
    return [null, null];
  }

  // Riot Games gives the league rank string in all uppercase, so I need to make it lowercase and then uppercase the first character
  leagueRank = leagueRank.toLowerCase();
  leagueRank = leagueRank.charAt(0).toUpperCase() + leagueRank.slice(1);

  const ranks: {[index: string]: string} = {
    Iron       : "91a5409a-5960-11ec-932b-c62003c7c2b3",
    Bronze     : "a01f3eb4-5960-11ec-9094-9e0666b62558",
    Silver     : "a9bdcd46-5960-11ec-9cba-3a3f91edefbb",
    Gold       : "bbcd9d4a-5960-11ec-a878-da406b23d908",
    Platinum   : "c6bd77de-5960-11ec-a5ce-c2aa08c54095",
    Diamond    : "fb43632e-5960-11ec-9709-6addb9e175c5",
    Master     : "01983574-5961-11ec-bac4-267d1a9f2cd1",
    Grandmaster: "0800b472-5961-11ec-a109-72c4385a27b6",
    Challenger : "12a63a46-5961-11ec-8c66-6ac4af511a86"
  };

  return [leagueRank, ranks[leagueRank]];
}

app.post("/link", async (req, res) => {
  const CHAMPION_ID = 105;
  const subredditName = "FizzClubBotSandbox";

  // Hash the Summoner Name + Region to generate a verification code (shortened to 8 characters)
  const name   = req.body.name;
  const region = req.body.region;
  const hash   = (new sha256().update(`${name.toLowerCase()}${region.toLowerCase()}`).digest("hex")).substring(0, 8);

  const summonerName        = encodeURIComponent(name);
  const encryptedSummonerId = await GetAccountData(region, summonerName);
  console.log(encryptedSummonerId);

  if (typeof encryptedSummonerId !== "string") {
    res.json({error: "Invalid summoner name and region"});
    return;
  };

  // const thirdPartyCode                 = await GetThirdPartyCode(region, encryptedSummonerId);
  const championMasteryPoints          = await GetChampionMasteryPoints(region, encryptedSummonerId, 105);
  console.log(championMasteryPoints);
  const leagueRank                     = await GetLeagueRank(region, encryptedSummonerId);
  const flairTextChampionMastery       = await GetFlairChampionMastery(championMasteryPoints);
  const [flairTextLeagueRank, flairId] = await GetFlairLeagueRank(leagueRank);

  let flairTemplateId = "";
  let text            = "";

  if (flairTextChampionMastery && flairTextLeagueRank) {
    text = `${flairTextChampionMastery} | ${flairTextLeagueRank}`;
  } else if (flairTextChampionMastery) {
    text = flairTextChampionMastery;
  } else if (flairTextLeagueRank) {
    text = flairTextLeagueRank;
  } else {
    res.json({message: "You don't qualify for any champion mastery or rank flair"});
    return;
  }

  if (flairId) {
    flairTemplateId = flairId;
  }

  const flairOptions = {
    subredditName  : subredditName,
    flairTemplateId: flairTemplateId,
    text           : text
  };

  const r = snoowrap.getUser("FizzClubBot").selectFlairUser(flairOptions);

  res.json({message: "Your flair has been updated"});
});

// https://www.reddit.com/api/v1/authorize?client_id=UOheMK6_cUy_jkfeBhXSsA&response_type=code&state=thisisatest&redirect_uri=https%3A%2F%2Ftundra.ngrok.io&duration=temporary&scope=identity

app.get("/", async (req, res) => {
  console.log(req.query);
  // const state = req.query.state; // Unused
  const code = req.query.code as string;

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
  const accessToken = response.data.access_token;
  const response2 = await axios.get("https://oauth.reddit.com/api/v1/me", {headers: {Authorization: `Bearer ${accessToken}`}});

  const flairOptions = {
    subredditName  : "FizzClubBotSandbox",
    flairTemplateId: "fb43632e-5960-11ec-9709-6addb9e175c5",
    text           : "This is a test"
  };

  const r = snoowrap.getUser(response2.data.name).selectFlairUser(flairOptions);

  const html = `
    <html>
      <head>
        <title>Fizz Club Bot</title>
        <meta charset="UTF-8">
        <meta name="author" content="Tundra Fizz">
        <meta name="description" content="Fizz Club Bot">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="icon" type="image/x-icon" href="https://i.imgur.com/64z2Nqa.png">
      </head>

      <body>
        <input id="btn1" type="button" value="Test 1"> <br/>
        <input id="btn2" type="button" value="Test 2"> <br/>
        <input id="btn3" type="button" value="Test 3"> <br/>
        <hr>
        <input type="text" id="name" name="name">
        <select name="region" id="region">
          <option value="na1">NA</option>
          <option value="euw1">EUW</option>
          <option value="eun1">EUNE</option>
          <option value="la1">LAN</option>
          <option value="la2">LAS</option>
          <option value="oc1">OCE</option>
          <option value="br1">BR</option>
          <option value="jp1">JP</option>
          <option value="ru1">RU</option>
          <option value="tr1">TR</option>
        </select>
        <br />
        <input id="btn-link" type="button" value="Link"> <br/>
      </body>

      <script>
        document.getElementById("btn-link").addEventListener("click", _ => {
          fetch("https://tundra.ngrok.io/link", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
              name  : document.getElementById("name").value,
              region: document.getElementById("region").value
            })
          });
        });

        document.getElementById("btn1").addEventListener("click", _ => {
          fetch("https://tundra.ngrok.io/testing1", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({qwe: "asd"})
          });
        });

        document.getElementById("btn2").addEventListener("click", _ => {
          fetch("https://tundra.ngrok.io/testing2", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({rty: "fgh"})
          });
        });

        document.getElementById("btn3").addEventListener("click", _ => {
          fetch("https://tundra.ngrok.io/testing3", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({uio: "jkl"})
          });
        });
      </script>
    </html>`;

  res.send(html);
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
