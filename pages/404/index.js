import Head from 'next/head'
import Image from 'next/image'

export default function FourOhFour(props) {
  return (
    <div className="container">
      <Head>
        <title>Nothing Here</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Nothing found"/>
      </Head>

      <main>
        <h1>Nowt Found For That</h1>
        <Image
          src='/lucy.jpg'
          alt={`Page not found, but here's a nice dog`}
          width='1500'
          height='500'
          className='nf-image'
        />

        <p>Nothing found for that page.....but here's a picture of my dog enjoying the beach to cheer you up.</p>
      </main>
    </div>
  )
}
