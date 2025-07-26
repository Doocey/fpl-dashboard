import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import { getLivePlayerPrices } from "@/util/getLivePlayerPrices";

export default function Home({ players }) {
  return (
    <div className="lg:container mx-4 lg:mx-auto">
      <Head>
        <title>
          Fantasy Premier League Dashboard - Price Changes & Game Stats
        </title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Daily FPL Price Changes & player statistics for the 2025/26 season."
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fpldashboard.dev/" />
        <meta
          property="og:title"
          content="Fantasy Premier League Dashboard - Price Changes & Game Stats."
        />
        <meta
          property="og:description"
          content="Daily FPL Price Changes & player statistics for the 2025/26 season."
        />
        <meta
          property="og:image"
          content="https://fpldashboard.dev/fpl-price-changes.png"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fpldashboard.dev/" />
        <meta
          property="twitter:title"
          content="Fantasy Premier League Dashboard - Price Changes & Game Stats."
        />
        <meta
          property="twitter:description"
          content="Daily FPL Price Changes & player statistics for the 2025/26 season."
        />
        <meta
          property="twitter:image"
          content="https://fpldashboard.dev/fpl-price-changes.png"
        />
      </Head>

      <main className="py-4">
        <h1 className="text-4xl sm:text-6xl font-semibold py-4 md:pt-6 md:pb-8">
          Fantasy League Players
        </h1>

        <p className="text-sm md:text-lg lg:text-xl text-gray-700 pb-4">
          A list of all currently <em>available</em> top 15 scoring players,
          with their unique idenifier. Anyone not on the list is out on loan,
          has left the club permanently, or has not made their club's registered
          squad list.
        </p>

        <p className="text-sm md:text-lg lg:text-xl text-gray-700 pb-6">
          Each tile should route you to a specific player profile - using{" "}
          <span className="underline">Next.js'</span> Dynamic Routing.
        </p>

        <div className="flex flex-wrap justify-between items-center">
          {players?.map((player) => (
            <Link
              href={`/player/${player.id}`}
              key={player.id}
              className="w-1/2 sm:w-1/3 md:w-1/6 h-100 cursor-pointer"
            >
              <div className="block bg-gray border-2 border-gray-200 shadow-sm m-1 p-3 md:px-3 text-center">
                <Image
                  src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${player.photo.replace(
                    ".jpg",
                    ".png"
                  )}`}
                  alt={player.web_name}
                  width={106}
                  height={130}
                  className="w-full"
                />
                <h4 className="text-xl font-semibold py-2">
                  {player.web_name}
                </h4>
                <h5 className="font-semibold text-emerald-600">
                  &pound;{(player.now_cost / 10).toFixed(1)}m
                </h5>
                <h6>Points: {player.total_points}</h6>
                <code className="text-xs">ID: {player.id}</code>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  // Grab top 15 scoring players on the game

  const res = await getLivePlayerPrices();
  const players = res
    .sort((player, nextPlayer) => nextPlayer.total_points - player.total_points)
    .slice(0, 15);
  return {
    props: {
      players
    }
  };
}
