import styles from '../../styles/Player.module.css'
import Head from 'next/head'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import Image from 'next/image'

export default function PlayerPage(props) {
  const playerData = props.data.player
  const playerImage = `https://resources.premierleague.com/premierleague/photos/players/110x140/p${props.data.player.photo.replace('.jpg', '.png')}`
  // Form the player's full name using string concat method this time - could have constructed different ways, but trying this out
  const metaDescription = `Fantasy League profile for ${playerData.team.name}'s ${playerData.first_name.concat(' ', playerData.second_name)}`
  return (
    <div className={styles.container}>
      <Head>
        <title>{playerData.web_name}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={metaDescription}/>
        <meta property="og:image" content={playerImage} />
      </Head>

      <main>
        <div className={styles.card}>
          <Image
            src={playerImage}
            alt={playerData.web_name}
            width={220}
            height={280}
          />
          <h1 className={styles.title}>
            {playerData.first_name} {playerData.second_name}
          </h1>

          <h2>
            Price: <span>£{(playerData.now_cost / 10).toFixed(1)}m</span>
          </h2>

          <h3>Goals Scored: {playerData.goals_scored}</h3>

          <code>Total Points: {playerData.total_points}</code>

          <h4>Selected By: <span>{playerData.selected_by_percent}%</span></h4>

          <div className={styles.card}>
            <p>Transfers In:  <strong>{playerData.transfers_in_event}</strong></p>

            <p>Transfers Out: <strong>{playerData.transfers_out_event}</strong></p>
            <hr />
            <p>Net Transfers: <span className={styles.net_transfers}>{playerData.transfers_in_event - playerData.transfers_out_event}</span></p>
          </div>

          {
            playerData.news.length ? <mark className={styles.d-block}>🚨 {playerData.news}</mark> : ''
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
  const res = await fetch('https://www.newcastle360.com/kevin/')
  const allData = await res.json()
  const players = allData.elements

  // Get the paths we want to pre-render based on posts
  const paths = players.map((player) => ({
    params: { id: player.id.toString() },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}