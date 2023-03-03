import Head from 'next/head'
import { getLivePlayerPrices } from '../../util/getLivePlayerPrices'
import PlayerProfile from '../../components/PlayerProfile';

// Extract player object from data in 'props
export default function Player({ player }) {
  // Form the player's full name using string concat method this time - could have constructed different ways, but trying this out
  const meta_description = `Fantasy League profile for ${player.team.name}'s ${player.first_name.concat(' ', player.second_name)}`
  // Form player profile photo
  const player_image = `https://resources.premierleague.com/premierleague/photos/players/110x140/p${player.photo.replace('.jpg', '.png')}`

  return (
    <>
      <Head>
        <title>{player.web_name}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={meta_description} />
        <meta property="og:image" content={player_image} />
      </Head>

      <main>
        <div className="container mx-auto">
          <PlayerProfile props={player} />
        </div>
      </main>
    </>
  )
}

export async function getStaticProps({ params }) {
  const all_players = await getLivePlayerPrices()

  // Find Player from list of player based on {params} id, which we need to turn into a string
  const player = all_players.find(player => player.id == params.id.toString())

  return {
    props: {
      player
    },
    revalidate: 30
  }
}

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const players = await getLivePlayerPrices()

  // Get the paths we want to pre-render based on posts, needs to be string
  const paths = players.map((player) => ({
    params: { id: player.id.toString() },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}