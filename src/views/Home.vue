<template>
  <div class="home">
    <div>
      {{ message }}
    </div>

    <br>

    <div v-if="redditAccountLinked === false">
      <input type="button" value="Link Reddit Account" @click="LinkRedditAccount()">
    </div>

    <div v-if="redditAccountLinked === true">
      <div>
        <input v-model="summonerName" type="text" placeholder="Enter your summoner name" @input="UpdateThirdPartyCode">

        <select v-model="summonerRegion">
          <option v-for="option in regionOptions" :key="option.value" :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>

      <div>
        Third-party code: {{ thirdPartyCode }}
      </div>

      <div>
        <input type="button" value="Link League Account" @click="LinkLeagueAccount()">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useCookies } from "vue3-cookies";
import axios from "axios";
import { sha256 } from "sha.js";

axios.defaults.validateStatus = ():boolean => {return true;};

export default defineComponent({
  components: {
  },
  setup: function () {
    const { cookies } = useCookies();

    return {
      cookies
    };
  },
  data: function () {
    return {
      redditAccountLinked: null as null|boolean,
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
      return;
    }

    const body = {
      secret: this.cookies.get("code")
    };

    const response = await axios.post("https://fizz.ngrok.io/check-secret", body);

    if (response.status === 200) {
      if (response.data) {
        this.messageType = "ok";
        this.message     = `Your verified Reddit account: ${response.data}`;
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
      const REDIRECT_URI  = encodeURIComponent("https://tundra.ngrok.io/reddit-auth"); // "https%3A%2F%2Ftundra.ngrok.io%2Freddit-auth";
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
        const data = response.data;
        console.log(data);
      } else {
        console.log(response);
      }
    },
    UpdateThirdPartyCode: function () {
      const name = this.summonerName;

      if (name) {
        this.thirdPartyCode = (new sha256().update(name.toLowerCase()).digest("hex")).substring(0, 8); // eslint-disable-line
      } else {
        this.thirdPartyCode = null;
      }
    }
  }
});
</script>

<style scoped lang="scss">
.home {
  .global-game-history {
    div {
      .open   { display: block; }
      .closed { display: none;  }
    }
  }
}
</style>
