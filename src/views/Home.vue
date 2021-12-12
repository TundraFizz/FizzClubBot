<template>
  <div class="home">
    <div v-if="redditAccountLinked === true" class="float-top-right">
      <div class="button-disconnect" @click="Disconnect()">Disconnect</div>
    </div>

    <div v-if="redditAccountLinked === true" class="container">
      <div class="text">Your Reddit account</div>
      <div class="your-reddit-account">{{ redditAccount }}</div>
    </div>

    <div v-else-if="redditAccountLinked === false" class="container">
      <div class="text">Verify your Reddit account</div>
      <div class="button" style="margin-top: 8px;" @click="LinkRedditAccount()">Link Reddit Account</div>
    </div>

    <div v-if="redditAccountLinked === true" class="container">
      <div class="container-name-region">
        <input v-model="summonerName" type="text" placeholder="Your summoner name" @input="UpdateThirdPartyCode">

        <select v-model="summonerRegion">
          <option v-for="option in regionOptions" :key="option.value" :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>

      <div class="container">
        <div id="testing" class="text">Third-party code</div>
        <div class="third-party-code">{{ thirdPartyCode ? thirdPartyCode : "--------" }}</div>
        <div class="button" @click="CopyThirdPartyCodeToClipboard()">Copy</div>
      </div>

      <div class="container">
        <div class="league-buttons">
          <div class="button" style="margin-right: 4px;" @click="LinkLeagueAccount()">Link League Account</div>
          <div class="button" @click="Help()">Help</div>
        </div>
      </div>
    </div>

    <div v-if="message" class="container">
      <div class="message" :class="(messageType === 'ok' ? 'ok' : 'error')">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import { sha256 } from "sha.js";

axios.defaults.validateStatus = ():boolean => {return true;};

export default defineComponent({
  data: function () {
    return {
      redditAccountLinked: null as null|boolean,
      redditAccount: "",
      messageType: null as null|string,
      message: null as null|string,
      summonerName: "",
      summonerRegion: "na1",
      thirdPartyCode: null as null|string,
      regionOptions: [
        {text: "NA",   value: "na1"},
        {text: "EUW",  value: "euw1"},
        {text: "EUNE", value: "eun1"},
        {text: "LAN",  value: "la1"},
        {text: "LAS",  value: "la2"},
        {text: "OCE",  value: "oc1"},
        {text: "BR",   value: "br1"},
        {text: "JP",   value: "jp1"},
        {text: "RU",   value: "ru1"},
        {text: "TR",   value: "tr1"}
      ]
    };
  },
  created: async function () {
    if (localStorage.getItem("error")) {
      this.messageType = "error";
      this.message     = localStorage.getItem("error");
      localStorage.removeItem("error");
      this.redditAccountLinked = false;
      console.log(this.messageType);
      console.log(this.message);
      return;
    }

    const body = {
      secret: localStorage.getItem("code")
    };

    const response = await axios.post("https://fizz.ngrok.io/check-secret", body);

    if (response.status === 200) {
      if (response.data) {
        this.redditAccount       = response.data;
        this.redditAccountLinked = true;
      } else {
        this.redditAccountLinked = false;
      }
    } else {
      this.redditAccountLinked = false;
    }
  },
  methods: {
    LinkRedditAccount: function () {
      const CLIENT_ID     = "UOheMK6_cUy_jkfeBhXSsA";
      const RESPONSE_TYPE = "code";
      const STATE         = "0";
      const REDIRECT_URI  = encodeURIComponent("https://tundra.ngrok.io/reddit-auth");
      const DURATION      = "temporary";
      const SCOPE         = "identity";
      const url = `https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&state=${STATE}&redirect_uri=${REDIRECT_URI}&duration=${DURATION}&scope=${SCOPE}`;
      window.location.href = url;
    },
    LinkLeagueAccount: async function () {
      const body = {
        name  : this.summonerName,
        region: this.summonerRegion
      };

      const response = await axios.post("https://fizz.ngrok.io/verify-league", body);

      if (response.status === 200) {
        this.messageType = "ok";
        this.message = response.data;
      } else {
        this.messageType = "error";
        this.message = response.data;
      }
    },
    UpdateThirdPartyCode: function () {
      const name = this.summonerName;

      if (name) {
        this.thirdPartyCode = (new sha256().update(name.toLowerCase().replace(/\s/g, "")).digest("hex")).substring(0, 8); // eslint-disable-line
      } else {
        this.thirdPartyCode = null;
      }
    },
    CopyThirdPartyCodeToClipboard: function () {
      if (this.thirdPartyCode) {
        try {
          navigator.clipboard.writeText(this.thirdPartyCode);
          this.messageType = "ok";
          this.message = `The code ${this.thirdPartyCode} has been copied to your clipboard`;
        } catch (error) {
          this.messageType = "error";
          this.message = "Unable to copy the code to your clipboard, please copy it manually";
        }
      } else {
        this.messageType = "error";
        this.message = "There's no code to copy";
      }
    },
    Help: function () {
      window.open("https://i.imgur.com/6LFMQq5.png", "_blank");
    },
    Disconnect: function () {
      this.messageType         = null;
      this.message             = null;
      this.redditAccount       = "";
      this.redditAccountLinked = false;
      localStorage.removeItem("code");
    }
  }
});
</script>

<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: column;

  .message {
    display: flex;
    font-weight: bold;
    font-size: 18px;
    padding: 2px 4px;

    &.ok {
      background-color: hsl(120deg, 100%, 10%);
      border: 1px solid hsl(120deg, 100%, 35%);
      border-radius: 4px;
      color: hsl(120deg, 100%, 75%);
    }

    &.error {
      background-color: hsl(0deg, 100%, 10%);
      border: 1px solid hsl(0deg, 100%, 35%);
      border-radius: 4px;
      color: hsl(0deg, 100%, 75%);
    }
  }

  .float-top-right {
    position: absolute;
    display: flex;
    top: 0;
    right: 0;
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 16px;
  }

  .text {
    display: flex;
    font-size: 20px;
  }

  .your-reddit-account {
    display: flex;
    font-size: 32px;
    font-weight: bold;
  }

  .third-party-code {
    font-size: 24px;
    font-weight: bold;
    font-family: monospace;
    white-space: pre;
  }

  .container-name-region {
    display: flex;

    input {
      width: 400px;
      padding: 8px;
      border-radius: 18px;
      color: black;
      border: 3px solid hsl(214deg, 100%, 50%);
      text-align: center;
      font-weight: bold;
      font-size: 32px;
      margin-right: 8px;

      &:focus {
        border: 3px solid hsl(196deg, 100%, 50%);;
        outline: none;
      }
    }

    select {
      color: black;
      border-radius: 18px;
      border: 3px solid hsl(214deg, 100%, 50%);
      font-weight: bold;
      font-size: 32px;

      &:focus {
        border: 3px solid hsl(196deg, 100%, 50%);;
        outline: none;
      }

      option {
        text-align: center;
        font-weight: bold;
        font-size: 32px;
      }
    }
  }

  .league-buttons {
    display: flex;
    flex-direction: row;
  }

  .button {
    display: flex;
    padding: 4px 10px;
    font-size: 20px;
    font-weight: bold;
    border-radius: 8px;
    background-color: hsl(213deg, 100%, 60%);
    border: 2px solid black;
    color: black;
    cursor: pointer;
    user-select: none;
    -ms-user-select: none;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;

    &:hover {
      background-color: hsl(213deg, 100%, 70%);
    }

    &:active {
      background-color: hsl(213deg, 100%, 50%);
      transform: translateY(1px);
    }
  }

  .button-disconnect {
    display: flex;
    padding: 0px 2px;
    font-weight: bold;
    border-radius: 4px;
    margin: 2px 2px 0 0;
    background-color: hsl(0, 100%, 60%);
    border: 2px solid black;
    color: black;
    cursor: pointer;
    user-select: none;
    -ms-user-select: none;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;

    &:hover {
      background-color: hsl(0, 100%, 70%);
    }

    &:active {
      background-color: hsl(0, 100%, 50%);
      transform: translateY(1px);
    }
  }
}
</style>
