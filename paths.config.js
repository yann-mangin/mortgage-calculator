module.exports = {
  src: {
    base: "src/",
    less: {
      base: "less/",
      sources: [
        "*.less",
        "**/*.less",
        "!font-awesome/*.less"
      ],
      styles: {
        base: "",
        sources: [
          "styles.less"
        ]
      },
      theme: {
        base: "theme/",
        sources: [
          "theme.less",
          "mixins.less",
          "variables.less",
          "theme/*.less"
        ]
      },
      anatwine: {
        base: "anatwine/",
        sources: [
          "styles.less"/*,
          "anatwine.less",
          "mixins.less",
          "variables.less",
          "anatwine/*.less"*/
        ]
      },
      integration: {
        base: "integration/",
        sources: [
          "integration.less",
          "mixins.less",
          "variables.less",
          "integration/*.less"
        ]
      }
    },
    js: {
      base: "js/app/",
      main: {
        base: "",
        sources: [
          "scripts.js",
          "app.js",
          "constants.js",
          "config.js",
          "run.js",
          "translations.js",
          "directives.js"
        ]
      },
      controllers: {
        base: "controllers/",
        sources: [
          "*.js",
          "**/*.js"
        ]
      },
      services: {
        base: "services/",
        sources: [
          "*.js",
          "**/*.js"
        ]
      },
      filters: {
        base: "filters/",
        sources: [
          "*.js",
          "**/*.js"
        ]
      },
      directives: {
        base: "directives/",
        sources: [
          "*.js",
          "**/*.js"
        ]
      }
    },
    html: {
      base: "views/",
      main: {
        base: "../",
        sources: [
          "index.html"
        ]
      },
      app: {
        base: "app/",
        sources: [
          "*.html",
          "**/*.html"
        ]
      },
      common: {
        base: "common/",
        sources: [
          "*.html",
          "**/*.html"
        ]
      },
      integration: {
        base: "integration/",
        sources: [
          "*.html",
          "**/*.html"
        ]
      },
      retailer: {
        base: "retailer/",
        sources: [
          "*.html",
          "**/*.html"
        ]
      },
      vendor: {
        base: "vendor/",
        sources: [
          "*.html",
          "**/*.html"
        ]
      }
    }
  },
  dist: {
    base: "dist/",
    css: {
      base: "css"
    },
    js: {
      base: "js/app/bundles/",
      main: {
        entry: "main.js"
      },
      controllers: {
        entry: "controllers.js"
      },
      services: {
        entry: "services.js"
      },
      filters: {
        entry: "filters.js"
      },
      directives: {
        entry: "directives.js"
      }
    },
    html: {
      base: "views/",
      main: {
        base: "../"
      },
      app: {
        base: "app/"
      },
      common: {
        base: "common/"
      },
      integration: {
        base: "integration/"
      },
      retailer: {
        base: "retailer/"
      },
      vendor: {
        base: "vendor/"
      }
    },
    build: {
      files: [
        "./src/index.html"
      ],
      directories: [
        "./src/*",
        "./src/**/*",
        "!./**/*.html",
        "!./src/css/app/*",
        "!./src/css/app/**/*",
        "!./src/less/**/*",
        "!./src/less/",
        "!./src/env.js"
      ]
    }
  },
  tmp: {
    base: "tmp/",
    css: {
      base: "css"
    },
    js: {
      base: "js/app/bundles/"
    },
    html: {
      base: "views/",
      main: {
        base: "../"
      },
      app: {
        base: "app/"
      },
      common: {
        base: "common/"
      },
      integration: {
        base: "integration/"
      },
      retailer: {
        base: "retailer/"
      },
      vendor: {
        base: "vendor/"
      }
    },
    build: {
      files: [
        "./src/index.html"
      ],
      directories: [
        "./src/*",
        "./src/**/*",
        "!./**/*.html",

        "!./src/css/app/*",
        "!./src/css/app/**/*",
        "!./src/less/**/*",
        "!./src/less/",
        "!./src/env.js"
      ]
    }
  },
  logs: {
    base: "logs/"
  }
};
