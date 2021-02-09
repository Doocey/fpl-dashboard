import Link from "next/link";

function About() {
  return (
    <div className="full-width">
      <nav className="nav kevin">
        <Link href="/">
          <a className="nav-link">Home</a>
        </Link>

        <Link href={'/player/' + Math.floor(Math.random() * 6) + 10}>
          <a className="nav-link">Random Player Profile</a>
        </Link>

        <Link href="/player/">
          <a className="nav-link">Price Changes <i><small>(Coming Soon)</small></i></a>
        </Link>
      </nav>

      <style jsx>
        {`
          .full-width {
              width: 100%;
          }
          nav {
            width: 100%;
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #aeaeae;
          }

          nav a {
            padding: 10px 20px;
            color: black;
            font-size: 1.1em;
          }

          .nav-link {
              text-decoration: none;
          }

          @media (max-width: 600px) {
              nav a {
                  font-size: 14px;
                  padding: 10px;
              }
          }
        `}
      </style>
    </div>
  );
}

export default About;
