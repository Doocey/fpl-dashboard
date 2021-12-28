# FPL Dashboard

#### Site: [FPL Dashboard](https://fpldashboard.dev)

A Fantasy Premier League Dashboard, _of sorts_, driven by the official FPL API, MongoDB, built with Next.js & a dash of styling using Tailwind.

![FPL Dashboard](https://fpldashboard.dev/fpl-dashboard.png)

Data powered by the official EPL Fantasy Premier League API & a snazzy GraphQL wrapper for the former (top work, [@lastmaj](https://github.com/lastmaj)).

Price Changes are auto-tweeted [@PriceChangeFPL](https://twitter.com/pricechangefpl) to a growing follower count using Twitter's JavaScript API. The actual price changes are stored in a MongoDB collection and checked daily for any movement. The sites rebuild is triggered by a CRON job, which allows webhooks to carry out the generation, and deployment to Vercel for the world to see.

⭐️ PRs are more than welcome!
