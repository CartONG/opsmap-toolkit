// Ensure "" export behavior : "" === everything.
// It is needed because the project is a lib.
// cf: https://cli.vuejs.org/guide/build-targets.html#vue-vs-js-ts-entry-files
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { gitDescribeSync } = require("git-describe");
const gitInfos = gitDescribeSync();
process.env.VUE_APP_VERSION = gitInfos.raw ?? `v0.9.${gitInfos.hash}`;

module.exports = {
  configureWebpack: {
    output: {
      libraryExport: ""
    }
  },

  css: {
    extract: false
  },

  pages: {
    index: {
      entry: "src/entry-point-app.ts"
    }
  },

  transpileDependencies: ["vuetify"],

  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true
    }
  },

  publicPath: `${process.env.BASE_URL}/`
};
