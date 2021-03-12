import Head from 'next/head'
import Link from 'next/link'
import styles from '../../styles/PriceChanges.module.css'
import { getPriceChanges } from '../../util/getPriceChanges'

export default function PriceChanges({ prices }) {
  // Parse our list of price changes for the week, since it's coming through as a <string>
  const price_changes_week = JSON.parse(prices)

  return (
    <section className="container">
      <Head>
        <title>Fantasy Premier League Price Changes</title>
        <meta name="description" content="Daily Fantasy Premier League price changes for the game we love to hate"/>
      </Head>

      <main>
        <h1 className={styles.h1}>Number of days on record: <span>{price_changes_week.length}</span></h1>
        
        {
        price_changes_week.map((pc) => 
          <section className={styles.table_container} key={pc._id}>
          <h2>{new Date(pc._id).toDateString()}</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Player:</th>
                <th>New Price:</th>
                <th>Owned By: (%)</th>
              </tr>
            </thead>
            <tbody>
              {
                pc.risers ? pc.risers.map((p) => 
                  <tr className={styles.risers} key={`riser-${p.id}`}>
                    <td>
                      <Link href={`/player/${p.id}`}>
                        <a>{p.short_name}</a>
                      </Link>
                    </td>
                    <td>
                      £{(p.new_price / 10).toFixed(1)}m
                    </td>
                    <td>
                      {p.percentage_ownership}%
                    </td>
                  </tr>
                    ) 
                  : ''
              }
              {
                pc.fallers ? pc.fallers.map((p) => 
                  <tr className={styles.fallers} key={`faller-${p.id}`}>
                    <td>
                      <Link href={`/player/${p.id}`}>
                        <a>{p.short_name}</a>
                      </Link>
                    </td>
                    <td>
                      £{(p.new_price / 10).toFixed(1)}m
                    </td>
                    <td>
                      {p.percentage_ownership}%
                    </td>
                  </tr>
                    ) 
                  : ''
                }
            </tbody>
          </table>
          </section>
        )
        }
        
      </main>
    </section>
  )
}

export async function getStaticProps() {
  // Grab our price changes, if there any & stringify to avoid date object issues when passing props
  const data = await getPriceChanges()
  const prices = JSON.stringify(data)
  
  return {
    props: {
      prices
    }
  }
}