import Layout from '../components/Layout'
// import '../styles/global.css'
import 'tailwindcss/tailwind.css'
// This default export is required in a new `pages/_app.js` file.
export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
