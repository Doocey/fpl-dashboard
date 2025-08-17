import Link from "next/link";
import Image from "next/image";
import SEO from "@/components/SEO";

import { getLivePlayerPrices } from "@/util/getLivePlayerPrices";

export default function Home({ players }) {
  return (
    <div className="lg:container mx-4 lg:mx-auto">
      <SEO
        title="Fantasy Premier League Dashboard - Price Changes & Game Stats"
        description="Daily FPL Price Changes & player statistics for the 2025/26 season."
        url="https://fpldashboard.dev/"
        image="https://fpldashboard.dev/fpl-price-changes.png"
      />

      <main className="py-4">
        <h1 className="text-3xl sm:text-5xl font-semibold py-4 md:pt-6 md:pb-8">
          25/26 EPL Fantasy League Players
        </h1>

        <p className="text-sm md:text-lg lg:text-xl text-gray-700 pb-4">
          A list of all currently <em>available</em> top 15 scoring players for
          the 25/26 Premier League season. Anyone not on the list is out on
          loan, has left the club permanently, or has not made their club's
          registered squad list.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {players?.map((player, index) => (
            <Link href={`/player/${player.id}`} key={player.id}>
              <div className="grid gap-3 border-2 border-gray-200 shadow-sm m-1 p-3 text-center rounded-lg h-full relative">
                {index === 0 && (
                  <span className="absolute top-0 left-0 text-sm px-2 py-1 border-r-2 border-b-2 bg-gray-200 font-semibold">
                    #1
                  </span>
                )}
                <Image
                  src={`https://resources.premierleague.com/premierleague25/photos/players/110x140/${player.photo.replace(
                    ".jpg",
                    ".png"
                  )}`}
                  alt={player.web_name}
                  width={180}
                  height={220}
                  className="mx-auto hover:opacity-70 transition"
                />
                <h3 className="text-lg sm:text-xl md:text-xl font-semibold">
                  {player.web_name}
                </h3>
                <span className="rounded-full mx-auto text-lg md:text-lg font-medium bg-gray-300 px-3 text-gray-600 w-fit">
                  &pound;{(player.now_cost / 10).toFixed(1)}m
                </span>
                <div className="text-md sm:text-lg">
                  Total:
                  <span className="text-emerald-700 font-bold pl-2">
                    {player.total_points}pts
                  </span>
                </div>

                <button className="bg-transparent hover:bg-emerald-700 hover:text-white text-emerald-700 font-semibold hover:text-white py-2 px-3 border border-gray-300 hover:border-transparent rounded text-xs sm:text-sm">
                  View {player.first_name}'s profile &rarr;
                </button>
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
  const allPlayers = await getLivePlayerPrices();

  const players = allPlayers
    .sort((player, nextPlayer) => nextPlayer.total_points - player.total_points)
    .slice(0, 15);
  return {
    props: {
      players
    }
  };
}
