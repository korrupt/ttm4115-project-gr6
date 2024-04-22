

const loadEnvPlugin = {
  name: 'load-var-plugin',
  setup(build) {
    const options = build.initialOptions;

    const envVars = {
      MAPS_KEY: process.env.MAPS_KEY,
      MAPS_ID: process.env.MAPS_ID
    };

    options.define['process.env'] = JSON.stringify(envVars);
  },
}

module.exports = loadEnvPlugin;
