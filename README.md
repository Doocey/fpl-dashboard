# FPL Dashboard

#### Site: [FPL Dashboard](https://fpldashboard.dev)

A Fantasy Premier League Dashboard, _of sorts_, driven by the official FPL API, MongoDB, built with Next.js & a dash of styling using Tailwind.

![FPL Dashboard](https://fpldashboard.dev/fpl-dashboard.webp)

Data powered by the official EPL Fantasy Premier League API.

Price Changes are auto-posted on X **[@PriceChangeFPL](https://twitter.com/pricechangefpl)** & Bluesky **[@pricechangefpl.bsky.social](https://bsky.app/profile/pricechangefpl.bsky.social)** to an ever-growing organic follower count (~2k). The price change information is stored in a MongoDB collection and checked daily against the Premier League's official data. Serverless functions are invoked to carry out day-to-day operations (adding new players, recording official price movements).

Sites rebuild & social posts are triggered by specific CRON jobs which allows the generation, and deployment to Vercel & for the world to see.

⭐️ PRs are more than welcome!
