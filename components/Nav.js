import Link from "next/link";

function Nav() {
  return (
    <nav className="bg-emerald-800">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex-1 flex items-center justify-around md:justify-center">
          <div className="flex sm:space-x-4">
            <Link href="/" legacyBehavior>
              <a className="text-gray-200 hover:bg-emerald-700 hover:text-white p-3 text-sm sm:text-lg md:text-xl font-medium">
                Home
              </a>
            </Link>

            <Link href="/price-changes" legacyBehavior>
              <a className="text-gray-200 hover:bg-emerald-700 hover:text-white p-3 text-sm sm:text-lg md:text-xl font-medium">
                Price Changes
              </a>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
