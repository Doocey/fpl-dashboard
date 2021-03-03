import { responsePathAsArray } from 'graphql';
import Head from 'next/head'
import { getPriceChanges } from '../../util/getPriceChanges'

export default function Home({ prices } = props) {
  const price_changers = JSON.parse(prices)
  console.log(price_changers)
  return (
    <div className="container">
      <Head>
        <title>Fantasy Premier League Price Changes - Updated Prices for the players you love!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Number of days on record: {price_changers.length}</h1>
      </main>
    </div>
  )
}

export async function getStaticProps(context) {
  const prices = await getPriceChanges()
  
  const result =  JSON.stringify(prices)
  
  return {
    props: {
      prices: result
    }
  }
}
