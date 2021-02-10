import Head from 'next/head'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import Image from 'next/image'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'

export default function PlayerPage(props) {
  const playerData = props.data.player
  const playerImage = `https://resources.premierleague.com/premierleague/photos/players/110x140/p${props.data.player.photo.replace('.jpg', '.png')}`
  // Form the player's full name using string concat method this time - could have constructed different ways, but trying this out
  const metaDescription = `Fantasy League profile for ${playerData.team.name}'s ${playerData.first_name.concat(' ', playerData.second_name)}`
  return (
    <div className="container">
      <Head>
        <title>{playerData.web_name}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={metaDescription}/>
        <meta property="og:image" content={playerImage} />
      </Head>

      <Nav />

      <main>
        <div className="card">
          <Image
            src={playerImage}
            alt={playerData.web_name}
            width={220}
            height={280}
          />
          <h1 className="title">
            {playerData.first_name} {playerData.second_name}
          </h1>

          <h2>
            Price: <span>£{(playerData.now_cost / 10).toFixed(1)}m</span>
          </h2>

          <h3>Goals Scored: {playerData.goals_scored}</h3>

          <code>Total Points: {playerData.total_points}</code>

          <h4>Selected By: <span>{playerData.selected_by_percent}%</span></h4>

          {
            playerData.news.length ? <mark className="d-block">🚨 {playerData.news}</mark> : ''
          }
        </div>

      </main>

      <Footer />

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 3rem;
          margin-top: 15px;
        }

        .title {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
          display: inline-block;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
          text-align: center;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }

        mark {
          margin: 10px;
          display: block;
          border-radius: 5px;
          background: aliceblue;
          padding: 5px;
          border: 1px solid #daeeff;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
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