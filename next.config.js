module.exports = {
  images: {
    domains: [
      'unsplash.it',
      'resources.premierleague.com',
      'source.unsplash.com'
    ],
  },
  webpack: (config) => {
    // this will override the experiments
    config.experiments = { ...config.experiments, ...{ topLevelAwait: true } };
    // this will just update topLevelAwait property of config.experiments
    // config.experiments.topLevelAwait = true 
    return config;
  },
}