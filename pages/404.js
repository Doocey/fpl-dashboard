import Head from 'next/head'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Image from 'next/image'

export default function FourOhFour(props) {
  return (
    <div className="container">
      <Head>
        <title>Nothing Here</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Nothing found"/>
      </Head>

      <Nav />

      <main>
        <h1>Nowt Found For That</h1>
        <Image
          src='https://source.unsplash.com/700x500/?dog'
          alt={`Page not found, but here's a nice dog`}
          width='750'
          height='500'
          className='nf-image'
        />

        <p>Nothing found for that page.....but here's a picture of a dog to cheer you up.</p>
      </main>

      <Footer />

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }

        .nf-image {
          padding: 2em !important;
        }
      `}</style>
    </div>
  )
}
