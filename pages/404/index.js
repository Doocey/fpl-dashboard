import Head from 'next/head'
import Image from 'next/image'

export default function FourOhFour() {
  return (
    <>
      <Head>
        <title>Nothing Here</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Nothing found" />
      </Head>
      <Image
        src='/lucy.jpg'
        alt={`Page not found, but here's a nice dog`}
        width='1500'
        height='500'
        className='nf-image'
      />
      <div className="container py-5">
        <main className="w-11/12 sm:w-8/12 mx-auto">
          <h1 className="text-3xl pb-4">Nowt Found For That</h1>
          <p>Nothing found for that page.....but here's a picture of my dog Lucy enjoying the beach to cheer you up.</p>
        </main>
      </div>
    </>
  )
}
