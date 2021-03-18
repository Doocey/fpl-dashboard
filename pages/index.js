import styles from '../styles/Home.module.css'
import Head from 'next/head'
import Link from 'next/link'
import { getLivePlayerPrices } from '../util/getLivePlayerPrices'

export default function Home({ players }) {
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
          Sorted by most expensive to cheapest.
        </p>

        <p>Each tile should route you to a specific player profile - using Next.js' Dynamic Routing.</p>

        <nav className={styles.grid} style={{borderBottom: '0'}}>
          {players
            .sort((a,b) => a.now_cost < b.now_cost)
            .map((player) =>
              <Link href={'/player/' + (player.id).toString()} key={(player.id).toString()}>
                <a className={styles.card}>{player.web_name} - <code>{player.id}</code> - <strong>£{(player.now_cost / 10).toFixed(1)}m </strong></a>
              </Link>
            )} 
        </nav>        
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
  const players = res.filter(player => !(player.status === 'u'))
  return {
    props: {
      players
    }
  }
}