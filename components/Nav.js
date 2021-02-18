import Link from "next/link";

function Nav() {
  return (
    <div className="full-width">
      <nav className="nav">
        <Link href="/">
          <a className="nav-link">Home</a>
        </Link>

        <Link href={'/player/' + (Math.floor(Math.random() * (649 - 1) + 1))}>
          <a className="nav-link">Random Player Profile</a>
        </Link>

        <Link href="/price-changes">
          <a className="nav-link">Price Changes <i><small>(Coming Soon)</small></i></a>
        </Link>
      </nav>
    </div>
  );
}

export default Nav;
