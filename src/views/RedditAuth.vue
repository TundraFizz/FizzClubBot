<template>
  <div class="reddit-auth" />
</template>

<script lang="ts">
/* eslint-disable no-process-env */
import { defineComponent } from "vue";
import axios from "axios";

export default defineComponent({
  created: async function () {
    if ("code" in this.$route.query) {
      const code = this.$route.query.code as string;

      const body = {
        code: code
      };

      const response = await axios.post(`${process.env.VUE_APP_BACKEND}/verify-reddit`, body);

      if (response.status !== 200) {
        localStorage.setItem("error", response.data);
        this.$router.push({ name: "Home" });
        return;
      }

      localStorage.setItem("code", code);
      this.$router.push({ name: "Home" });
    } else {
      localStorage.removeItem("code");
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
