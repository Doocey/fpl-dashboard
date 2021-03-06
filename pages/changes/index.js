import Head from 'next/head'
import Link from 'next/link'
import { getPriceChanges } from '../../util/getPriceChanges'

export default function Home({ prices }) {
  const price_changes_week = JSON.parse(prices)
  // price_changers.forEach(element => {
  //   console.log(element)
  // });

  return (
    <section className="container">
      <Head>
        <title>Fantasy Premier League Price Changes - Updated Prices for the players you love!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 style={{fontSize: '40px'}}>Number of days on record: <span style={{color: 'seagreen'}}>{price_changes_week.length}</span></h1>
        {/* <code>{JSON.stringify(price_changes_week)}</code> */}
        
        {
        /* TODO: Lets inline the styling for now, and create css.mod later */
        price_changes_week.map((pc) => 
          <table style={{width: '100%', marginBottom: '20px'}}>
            <tr style={{background: 'gainsboro'}}>
              <th style={{padding: '15px'}}>{new Date(pc._id).toDateString()}</th>
            </tr>
            {
              pc.risers 
                ? pc.risers.map((x) => 
                <tr style={{display: 'block', background: 'seagreen', color: 'white', marginBottom: '1px'}}>
                  <td style={{padding: '10px 20px'}}>
                    <Link href={`/player/${x.id}`} key={`riser-${x.id}`}>
                      <a>{x.first_name} {x.second_name}</a>
                    </Link> - £{(x.new_price / 10).toFixed(1)}m - {x.percentage_ownership}%
                  </td>
                </tr>
                  ) 
                : ''
            }
            {
              pc.fallers 
                ? pc.fallers.map((x) => 
                <tr style={{display: 'block', background: 'firebrick', color: 'white', marginBottom: '1px'}}>
                  <td style={{padding: '10px 20px'}}>
                    <Link href={`/player/${x.id}`} key={`riser-${x.id}`}>
                      <a>{x.first_name} {x.second_name}</a>
                    </Link> - £{(x.new_price / 10).toFixed(1)}m - {x.percentage_ownership}%
                  </td>
                </tr>
                  ) 
                : ''
              }
          </table>
        )
        }
        
      </main>
    </section>
  )
}

export async function getStaticProps() {
  // Grab our price changes, if there any & strinify to avoid date object issues when passing props
  const data = await getPriceChanges()
  const prices = JSON.stringify(data)
  
  return {
    props: {
      prices: prices
    },
    revalidate: 30
  }
}