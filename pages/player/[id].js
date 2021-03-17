import styles from '../../styles/Player.module.css'
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
    <div className={styles.container}>
      <Head>
        <title>{player.web_name}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={meta_description} />
        <meta property="og:image" content={player_image} />
      </Head>

      <main>
        <div className={styles.card}>
          <Image
            src={player_image}
            alt={player.web_name}
            width={220}
            height={280}
          />
          <h1 className={styles.title}>
            {player.first_name} {player.second_name}
          </h1>

          <h2>
            Price: <span>£{(player.now_cost / 10).toFixed(1)}m</span>
          </h2>

          <h3>Goals Scored: {player.goals_scored}</h3>

          <code>Total Points: {player.total_points}</code>

          <h4>Selected By: <span>{player.selected_by_percent}%</span></h4>

          <div className={styles.card}>
            <p>Transfers In:  <strong>{player.transfers_in_event}</strong></p>

            <p>Transfers Out: <strong>{player.transfers_out_event}</strong></p>
            <hr />
            <p>Net Transfers: <span className={styles.net_transfers}>{player.transfers_in_event - player.transfers_out_event}</span></p>
          </div>

          {
            player.news.length ? <mark className={styles.d_block}>🚨 {player.news}</mark> : ''
          }
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