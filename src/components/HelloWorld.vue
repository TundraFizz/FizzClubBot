<template>
  <div class="home">
    <div>
      sdkfljsdkfjsk
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// import { utils } from "ethers";
// import { useCookies } from "vue3-cookies";
// import GameHistoryGlobal from "@/components/game-history-global.vue";
// import { GAME_FLIP_ADDRESS, GAME_DICE_ADDRESS } from "@/contracts";
// import { HOMEPAGE } from "@/constants";

export default defineComponent({
  components: {
    // GameHistoryGlobal
  },
  setup: function () {
    // const { cookies } = useCookies();

    // return {
    //   cookies,
    //   GAME_FLIP_ADDRESS,
    //   GAME_DICE_ADDRESS
    // };
  },
  data: function () {
    return {
      ready: false,
      which: "all",
      loadedGame0: true,
      loadedGame1: false,
      loadedGame2: false
    };
  },
  created: function () {
    // this.ready = true;

    // if (this.$route.query.ref) {
    //   const referralAddress = this.$route.query.ref as string;

    //   try {
    //     const formattedAddress = utils.getAddress(referralAddress);
    //     this.cookies.set("ref", formattedAddress);
    //   } catch (error) {
    //     console.error(error);
    //   }

    //   window.location.replace(HOMEPAGE);
    // }
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
