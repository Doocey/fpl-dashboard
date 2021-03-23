import Link from "next/link";

function Nav() {
  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex-1 flex items-center justify-around md:justify-center sm:items-stretch sm:justify-start">
            <div className="flex sm:space-x-4">
              <Link href="/">
                <a className="text-white hover:bg-gray-700 px-3 py-3 sm:text-lg font-medium">Home</a>
              </Link>

              <Link href={`/player/${Math.floor(Math.random() * (649 - 1) + 1)}`}>
                <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-3 sm:text-lg font-medium">Random Player Profile</a>
              </Link>

              <Link href="/price-changes">
                <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-3 sm:text-lg font-medium">Price Changes</a>
              </Link>
            </div>
          </div>
      </div>
    </nav>
  );
}

export default Nav;
