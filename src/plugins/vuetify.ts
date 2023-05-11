/**
 * This file imports [vuetify](https://vuetifyjs.com/en/) into the project as a vuejs [plugin](https://fr.vuejs.org/v2/guide/plugins.html).
 * @module
 */

import { TKColors } from "@/domain/utils/TKColors";
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
import PDFIcon from "./Icons/PDFIcon.vue";
import CSVIcon from "./Icons/CSVIcon.vue";

export default new Vuetify({
  theme: {
    options: { customProperties: true }, // Generates CSS var
    themes: {
      light: {
        appBackground: "#fdfdfa",
        accent: TKColors.ACCENT,
        primary: "#333333",
        secondary: TKColors.SECONDARY,
        background: TKColors.BACKGROUND,
        discrete: "#d8d8d8",
        sectionTitle: "#a1a1a1",
        backgroundSecondary: TKColors.BACKGROUND_SECONDARY,
        autocomplete: TKColors.DARK_GREY,
        border: TKColors.DARK_GREY,
        thematicBackground: "#fff",
        thematicHeader: "#ffffff",
        thematicBorder: "#000000",
        placeholder: "#f3f3f3",
        placeholderAccent: "#f6f6f6",
        disabled: "#bdbdbd",
        selectedLanguage: "#EC6B4D",
        notSelectedLanguage: TKColors.DARK_GREY,
        selectedButton: TKColors.DARK_GREY,
        notSelectedButton: "#919191",
        boxShadow: "#000000"
      }
    }
  },
  icons: {
    values: {
      filePDF: {
        component: PDFIcon
      },
      fileCSV: {
        component: CSVIcon
      }
    }
  }
});
