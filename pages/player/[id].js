// import styles from '../../styles/Player.module.css'
import Head from 'next/head'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import Image from 'next/image'
import { getLivePlayerPrices } from '../../util/getLivePlayerPrices'

// Extract player object from data in 'props
export default function Player({ data: { player } }) {
  // Form player profile photo
  const player_image = `https://resources.premierleague.com/premierleague/photos/players/110x140/p${player.photo.replace('.jpg', '.png')}`
  // Form the player's full name using string concat method this time - could have constructed different ways, but trying this out
  const meta_description = `Fantasy League profile for ${player.team.name}'s ${player.first_name.concat(' ', player.second_name)}`
  return (
    <div>
      <Head>
        <title>{player.web_name}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={meta_description} />
        <meta property="og:image" content={player_image} />
      </Head>

      <main>
        <div className="container mx-auto">
          <div className="p-10 text-center">
            <div className="max-w-sm rounded overflow-hidden shadow-lg mx-auto">
              <Image
                src={player_image}
                alt={player.web_name}
                width={220}
                height={280}
                className="w-full"
              />
              <div className="py-4">
                <h1 className="font-bold text-2xl mb-4">{player.first_name} {player.second_name}</h1>

                <h2 className="inline-block rounded-full text-xl font-medium bg-gray-200 px-3 py-1 text-sm text-gray-700 mr-2 mb-1 text-lg">
                  £{(player.now_cost / 10).toFixed(1)}m
                </h2>

                {/* <div className="px-2 pt-4 pb-2 text-left text-lg text-gray-800">
                  <p>Total Points: <strong>{player.total_points}</strong></p>
                  <p>Goals Scored: <strong>{player.goals_scored}</strong></p>
                  <p>Selected By: <strong>{player.selected_by_percent}%</strong></p>
                  <p>Transfers In: <strong>{player.transfers_in_event}</strong></p>
                  <p>Transfers Out: <strong>{player.transfers_out_event}</strong></p>
                </div> */}

                <table class="table my-4 w-full">
                  <thead>
                    <tr className="py-2">
                      <th class="w-1/4">Goals</th>
                      <th class="w-1/4">Selected By</th>
                      <th class="w-1/4">Total Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-lg">
                      <td className="bg-gray-100 py-2">{player.goals_scored}</td>
                      <td className="bg-gray-200 py-2">{player.selected_by_percent}%</td>
                      <td className="bg-gray-300 py-2 font-bold">{player.total_points}</td>
                    </tr>
                  </tbody>
                </table>

                <p className="leading-relaxed font-bold text-lg py-3 text-gray-700">
                  GW Net Transfers: 
                  {
                    (player.transfers_in_event - player.transfers_out_event) > 0 
                      ? <span className="ml-3 bg-green-600 rounded-full px-3 py-1 text-sm font-semibold text-green-50">{player.transfers_in_event - player.transfers_out_event}</span> 
                      : <span className="ml-3 bg-red-600 rounded-full px-3 py-1 text-sm font-semibold text-red-50">{player.transfers_in_event - player.transfers_out_event}</span>
                  }
                </p>
                
                {player.news.length ? <mark className="block my-3 py-1 px-2 leading-relaxed bg-red-500 text-white text-sm">🚨 {player.news}</mark> : ''}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export async function getStaticProps({ params }) {

  const client = new ApolloClient({
    uri: 'https://graphql-fpl.herokuapp.com',
    cache: new InMemoryCache()
  });

  const { data } = await client.query({
    query: gql`
      query {
        player(id: ${params.id}) {
          first_name
          second_name
          goals_scored
          now_cost
          total_points
          transfers_in_event
          transfers_out_event
          selected_by_percent
          web_name
          photo
          news
          team {
            name
          }
        }
      }    
    `
  });

  return {
    props: {
      data
    },
    revalidate: 30
  }
}

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const players = await getLivePlayerPrices()

  // Get the paths we want to pre-render based on posts
  const paths = players.map((player) => ({
    params: { id: player.id.toString() },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}