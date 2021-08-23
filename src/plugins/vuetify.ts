/**
 * This file imports [vuetify](https://vuetifyjs.com/en/) into the project as a vuejs [plugin](https://fr.vuejs.org/v2/guide/plugins.html).
 * @module
 */

import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

/*
theme.options.customeProperties: generates css var
primary color --> var(--v-primary-base);
primary: because it's primary field
base: among 11 values:

REF:
interface ParsedThemeItem {
  base: string
  lighten5: string
  lighten4: string
  lighten3: string
  lighten2: string
  lighten1: string
  darken1: string
  darken2: string
  darken3: string
  darken4: string
  [name: string]: string
}
*/

export default new Vuetify({
  theme: {
    options: { customProperties: true }, // Generates CSS var
    themes: {
      light: {
        accent: "#428fdf",
        primary: "#333333",
        secondary: "#999999",
        tertiary: "#a6a6a6",
        quaternary: "#000000",
        background: "#ffffff",
        discrete: "#d8d8d8",
        sectionBG: "#ffffff",
        sectionTitle: "#a1a1a1",
        sectionBGSecondary: "#fafafa",
        sectionTitleSecondary: "#999",
        homeTitle: "#000000"
        // accent
        // anchor
        // error
        // info
        // success
        // warning
      }
    }
  }
});
