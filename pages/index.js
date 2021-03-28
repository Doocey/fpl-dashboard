import Head from 'next/head'
import Link from 'next/link'
import { getLivePlayerPrices } from '../util/getLivePlayerPrices'

export default function Home({ players }) {
  return (
    <div className="lg:container mx-4 lg:mx-auto">
      <Head>
        <title>Fantasy Premier League Dashboard - Price Changes & Game Stats.</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="List of all registered Fantasy Premier League players."/>
      </Head>

      <main className="py-4">
        <h1 className="text-4xl sm:text-6xl font-semibold py-4 md:pt-6 md:pb-8">
          Fantasy League Players
        </h1>

        <p className="text-lg sm:text-2xl text-gray-700 pb-4">
          A list of all currently <em>available</em> players that have scored at least 100 points, with their unique idenifier.
          Anyone not on the list is out on loan, has left the club permanently, or has not made their club's registered squad list.
          Sorted by highest scoring players on the game.
        </p>

        <p className="text-lg sm:text-2xl text-gray-700 pb-5">Each tile should route you to a specific player profile - using Next.js' Dynamic Routing.</p>

        <div className="flex flex-wrap justify-between items-center">
          {players
            .sort((a, b) => a.total_points < b.total_points)
            .map((player) =>
              <Link href={'/player/' + (player.id).toString()} key={(player.id).toString()}>
                <div className="w-1/2 md:w-1/4 h-100 p-2">
                  <a className="block bg-gray border-2 border-gray-200 p-3 md:p-5 shadow-sm">
                    <h4 className="text-xl font-semibold">{player.web_name}</h4>
                    <h5 className="font-semibold text-blue-600 py-1">£{(player.now_cost / 10).toFixed(1)}m</h5>
                    <code>ID: {player.id}</code>
                  </a>
                </div>
              </Link>
            )} 
        </div>        
      </main>
    </div>
  )
}

export async function getStaticProps() {
  /**
   * Grab default FPL data from endpoint
   * Filter returned json to include all players
   * that do not have a status of 'u' - meaning unavailable
   * Only active players in the FPL will be included and further reduces the size
   * of data we pass through to component
   */
  
  const res = await getLivePlayerPrices()
  const players = res.filter(player => !(player.status === 'u') && player.total_points > 100)
  return {
    props: {
      players
    }
  }
}