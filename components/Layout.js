import Footer from "./Footer"
import Nav from "./Nav"

const Layout = ({ children }) => {
  return (
      <section className="bg-gray-50">
        <Nav />
        { children }
        <Footer />
      </section>
  );
}

export default Layout;