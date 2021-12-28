import Link from "next/link";

function Nav() {
  return (
    <nav className="bg-green-800">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex-1 flex items-center justify-around md:justify-center">
          <div className="flex sm:space-x-4">
            <Link href="/">
              <a className="text-gray-200 hover:bg-green-700 hover:text-white p-3 text-sm sm:text-lg md:text-xl font-medium">Home</a>
            </Link>

            <Link href={`/player/${Math.floor(Math.random() * (649 - 1) + 1)}`}>
              <a className="text-gray-200 hover:bg-green-700 hover:text-white p-3 text-sm sm:text-lg md:text-xl font-medium">Random Player Profile</a>
            </Link>

            <Link href="/price-changes">
              <a className="text-gray-200 hover:bg-green-700 hover:text-white p-3 text-sm sm:text-lg md:text-xl font-medium">Price Changes</a>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
