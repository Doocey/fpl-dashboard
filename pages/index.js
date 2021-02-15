import styles from '../styles/Home.module.css'
import Head from 'next/head'
import Link from 'next/link'

export default function Home(params) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Fantasy League Data</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="List of all registered Fantasy Premier League players."/>
      </Head>

      <main>
        <h1 className={styles.title}>
          Fantasy League Players
        </h1>

        <p className={styles.description}>
          A complete list of all currently <em>available</em> players, with their unique idenifier.
          Anyone not on the list is out on loan, has left the club permanently, or has not made their club's registered squad list.
        </p>

        <p>Each tile should route you to a specific player profile - using Next.js' Dynamic Routing.</p>

        <nav className={styles.grid}>
          {params.players.map((player) =>
            <Link href={'/player/' + (player.id).toString()} key={(player.id).toString()}>
              <a className={styles.card}>{player.web_name} - {player.id}</a>
            </Link>
          )} 
        </nav>        
      </main>

      <footer>
        <p>Just some good old footer stuff</p>
      </footer>
    </div>
  )
}

export async function getStaticProps() {
  /**
   * Grab default FPL data from endpoint
   * Filter 'elements' item in returned json to include all players
   * that do not have a status of 'u' - meaning unavailable
   * Only active players in the FPL will be included and further reduces the size
   * of data we pass through to component
   */
  const res = await fetch(`https://www.newcastle360.com/kevin/`)
  const allData = await res.json()
  const players = allData.elements.filter(player => !(player.status === 'u')) 
  return {
    props: {
      players
    }
  }
}