import Head from 'next/head'
import Link from 'next/link'
import styles from '../../styles/PriceChanges.module.css'
import { getPriceChanges } from '../../util/getPriceChanges'

export default function PriceChanges({ prices }) {
  const price_changes_week = JSON.parse(prices)

  return (
    <section className="container">
      <Head>
        <title>Fantasy Premier League Price Changes - Updated Prices for the players you love!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.h1}>Number of days on record: <span>{price_changes_week.length}</span></h1>
        
        {
        price_changes_week.map((pc) => 
          <>
          <h2>{new Date(pc._id).toDateString()}</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Player:</th>
                <th>New Price:</th>
                <th>Owned By: (%)</th>
              </tr>
            </thead>
            {
              pc.risers ? pc.risers.map((p) => 
                <tr className={styles.risers}>
                  <td>
                    <Link href={`/player/${p.id}`} key={`riser-${p.id}`}>
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
                <tr className={styles.fallers}>
                  <td>
                    <Link href={`/player/${p.id}`} key={`faller-${p.id}`}>
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
          </table>
          </>
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
      prices: prices
    },
    revalidate: 30
  }
}