import Head from "next/head";
import Link from "next/link";
import { getPriceChanges } from "@/util/getPriceChanges";

export default function PriceChanges({ prices }) {
  // Parse our list of price changes for the week, since it's coming through as a <string>
  const priceChangesWeek = JSON.parse(prices);

  return (
    <section className="mx-auto container my-4">
      <Head>
        <title>Fantasy Premier League Price Changes</title>
        <meta
          name="description"
          content="FPL Price Changes updated daily. Keep track of weekly price movers to help improve your game."
        />

        <meta name="title" content="Fantasy Premier League Price Changes" />

        {/* <!-- Open Graph / Facebook --> */}
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://fpldashboard.dev/price-changes"
        />
        <meta
          property="og:title"
          content="Fantasy Premier League Price Changes"
        />
        <meta
          property="og:description"
          content="FPL Price Changes updated daily. Keep track of weekly price movers to help improve your game."
        />
        <meta
          property="og:image"
          content="https://fpldashboard.dev/fpl-price-changes.png"
        />

        {/* <!-- Twitter --> */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://fpldashboard.dev/price-changes"
        />
        <meta
          property="twitter:title"
          content="Fantasy Premier League Price Changes"
        />
        <meta
          property="twitter:description"
          content="FPL Price Changes updated daily. Keep track of weekly price movers to help improve your game."
        />
        <meta
          property="twitter:image"
          content="https://fpldashboard.dev/fpl-price-changes.png"
        />

        <link rel="canonical" href="https://fpldashboard.dev/price-changes" />
      </Head>

      <main className="w-11/12 md:w-3/4 mx-auto">
        <h1 className="text-center text-4xl sm:text-6xl font-semibold py-3 md:pt-6 md:pb-5">
          FPL Price Changes
        </h1>
        <h2 className="text-center text-lg sm:text-2xl pb-4">
          Recorded price rises/falls for the past week in the FPL. <br />
          Auto-posted on Twitter{" "}
          <Link href="https://twitter.com/PriceChangeFPL" legacyBehavior>
            <a className="underline">@PriceChangeFPL</a>
          </Link>
        </h2>
        <hr />

        {priceChangesWeek.map((pc) => (
          <div className="w-100 md:w-3/4 mx-auto mb-5" key={pc._id}>
            <h2 className="text-2xl font-bold text-center pt-4 pb-3 text-gray-800">
              {new Date(pc._id).toDateString()}:
            </h2>
            <table className="w-full lg:w-4/5 mx-auto shadow-lg border-b border-gray-200 sm:rounded-lg">
              <thead className="bg-gray-200 text-gray-500">
                <tr>
                  <th className="px-4 sm:px-5 py-3 text-left text-xs uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs uppercase tracking-wider">
                    New Price:
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs uppercase tracking-wider">
                    Owned By:
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pc.risers
                  ? pc.risers.map((p) => (
                      <tr
                        className="bg-emerald-800 text-emerald-800"
                        key={p._id}
                      >
                        <td className="px-4 sm:px-6 py-3 text-md text-white font-medium">
                          <Link href={`/player/${p.id}`} legacyBehavior>
                            <a>{p.short_name}</a>
                          </Link>
                        </td>
                        <td className="px-4 sm:px-6 py-3 text-md text-white font-medium">
                          &pound;{(p.new_price / 10).toFixed(1)}m
                        </td>
                        <td className="px-4 sm:px-6 py-3">
                          <span className="px-2 sm:px-2 inline-flex text-xs sm:text-sm leading-5 sm:leading-7 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                            {p.percentage_ownership}%
                          </span>
                        </td>
                      </tr>
                    ))
                  : ""}

                {pc.fallers
                  ? pc.fallers.map((p) => (
                      <tr className="bg-red-700 text-red-800" key={p.id}>
                        <td className="px-4 sm:px-6 py-3 text-md font-medium text-white">
                          <Link href={`/player/${p.id}`} legacyBehavior>
                            <a>{p.short_name}</a>
                          </Link>
                        </td>
                        <td className="px-4 sm:px-6 py-3 text-md text-white font-medium">
                          &pound;{(p.new_price / 10).toFixed(1)}m
                        </td>
                        <td className="px-4 sm:px-6 py-3">
                          <span className="px-2 sm:px-2 inline-flex text-xs sm:text-sm leading-5 sm:leading-7 font-semibold rounded-full bg-red-100 text-red-800">
                            {p.percentage_ownership}%
                          </span>
                        </td>
                      </tr>
                    ))
                  : ""}
              </tbody>
            </table>
          </div>
        ))}
      </main>
    </section>
  );
}

export async function getStaticProps() {
  // Grab our price changes, if there any & stringify to avoid date object issues when passing props
  const data = await getPriceChanges();
  const prices = JSON.stringify(data);

  return {
    props: {
      prices
    }
  };
}
