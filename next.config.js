const isPreview = process.env.VERCEL_TARGET_ENV !== "production";

module.exports = {
  bundlePagesRouterDependencies: true,
  images: {
    domains: ["resources.premierleague.com"],
    loader: "default", // Prevents Vercel's optimization
    unoptimized: true // Disables all image optimizations globally
  },
  webpack: (config) => {
    // this will override the experiments
    config.experiments = { ...config.experiments, ...{ topLevelAwait: true } };
    // this will just update topLevelAwait property of config.experiments
    // config.experiments.topLevelAwait = true
    return config;
  },
  async headers() {
    if (isPreview) {
      return [
        {
          source: "/:path*",
          headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]
        }
      ];
    }
    return [];
  }
};
