<template>
  <div class="reddit-auth" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useCookies } from "vue3-cookies";
import axios from "axios";

export default defineComponent({
  setup: function () {
    const { cookies } = useCookies();

    return {
      cookies
    };
  },
  created: async function () {
    // const ref = this.cookies.get("ref");
    if ("code" in this.$route.query) {
      const code = this.$route.query.code as string;

      const body = {
        code: code
      };

      const response = await axios.post("https://fizz.ngrok.io/verify-reddit", body);

      if (response.status !== 200) {
        localStorage.setItem("error", response.data);
        this.$router.push({ name: "Home" });
        return;
      }

      this.cookies.set("code", code);
      this.$router.push({ name: "Home" });
    } else {
      this.cookies.remove("code");
      this.$router.push({ name: "Home" });
    }
  }
});
</script>

<style scoped lang="scss">
.reddit-auth {
  background-color: black;
}
</style>
