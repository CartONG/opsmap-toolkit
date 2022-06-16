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
        background: "#ffffff",
        discrete: "#d8d8d8",
        sectionTitle: "#a1a1a1",
        backgroundSecondary: "#fafafa",
        autocomplete: "#000000",
        border: "#f1f3f3",
        thematicBackground: "#f1f3f3",
        thematicHeader: "#ffffff",
        thematicBorder: "#f1f3f3",
        campSelector: "#f0fbff",
        placeholder: "#f3f3f3",
        placeholderAccent: "#f6f6f6",
        disabled: "#bdbdbd"
      },
      dark: {
        accent: "#428fdf",
        primary: "#aaaaaa",
        secondary: "#777777",
        background: "#121212",
        sectionTitle: "#a1a1a1",
        autocomplete: "#f2f2f2",
        border: "#2c2c2c",
        discrete: "#393939",
        thematicBackground: "#171717",
        thematicHeader: "#2c2c2c",
        thematicBorder: "#2c2c2c",
        backgroundSecondary: "#171717",
        campSelector: "#000305",
        placeholder: "#171717",
        placeholderAccent: "#1a1a1a",
        disabled: "#717171"
      }
    },
    dark: true
  }
});
