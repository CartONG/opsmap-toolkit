import Vue from "vue";
import VueRouter from "vue-router";
import TKMainComponentLeftHome from "./primary/components/TKMainComponent/TKMainComponentLeftHome.vue";
import TKMainComponentLeftSite from "./primary/components/TKMainComponent/TKMainComponentLeftSite.vue";
import TKMainComponentContentHome from "./primary/components/TKMainComponent/TKMainComponentContentHome.vue";
import TKMainComponentContentSite from "./primary/components/TKMainComponent/TKMainComponentContentSite.vue";
import TKMainComponentIndicatorsHome from "./primary/components/TKMainComponent/TKMainComponentIndicatorsHome.vue";
import TKMainComponentIndicatorsSite from "./primary/components/TKMainComponent/TKMainComponentIndicatorsSite.vue";
import { TKSiteSelector } from "./primary/components/TKMainComponent/TKSiteComponents";

/*
he default mode for vue-router is hash mode – it uses the URL hash to simulate a full URL so that the page won’t be reloaded when the URL changes.
To get rid of the hash, we can use the router’s history mode, which leverages the history.pushState API to achieve URL navigation without a page reload.
*/
Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      components: {
        left: TKMainComponentLeftHome,
        indicators: TKMainComponentIndicatorsHome,
        content: TKMainComponentContentHome
      }
    },
    {
      path: "/site/:survey/:admin1?/:admin2?/:site?/:date?",
      name: "site",
      components: {
        header: TKSiteSelector,
        left: TKMainComponentLeftSite,
        indicators: TKMainComponentIndicatorsSite,
        content: TKMainComponentContentSite
      }
    },
    {
      path: "*",
      redirect: { name: "home" }
    }
  ]
});

export default router;
