import { getLivePlayerPrices } from "@/util/getLivePlayerPrices";
import PlayerProfile from "@/components/PlayerProfile";
import SEO from "@/components/SEO";

// Extract player object from data in 'props
export default function Player({ player }) {
  const metaDescription = `Fantasy League profile for ${player.first_name} ${player.second_name}`;

  const playerImage = `https://resources.premierleague.com/premierleague25/photos/players/110x140/${player.photo.replace(
    ".jpg",
    ".png"
  )}`;

  return (
    <>
      <SEO
        title={player.web_name}
        description={metaDescription}
        url={`https://fpldashboard.dev/player/${player.id}`}
        image={playerImage}
      />

      <main className="container mx-auto">
        <PlayerProfile
          props={{
            ...player,
            photo: playerImage
          }}
        />
      </main>
    </>
  );
}

export async function getStaticProps({ params }) {
  const allPlayers = await getLivePlayerPrices();

  const player = allPlayers.find((player) => player.id == params.id);

  return {
    props: {
      player
    },
    revalidate: 30
  };
}

export async function getStaticPaths() {
  const players = await getLivePlayerPrices();

  const paths = players.map((player) => ({
    params: { id: player.id.toString() }
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}
