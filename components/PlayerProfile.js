import Image from 'next/image'

export default function PlayerProfile({ props }) {
  const profile_image = `https://resources.premierleague.com/premierleague/photos/players/110x140/p${props.photo.replace('.jpg', '.png')}`
  return (
    <div className="p-10 text-center">
      <div className="max-w-sm rounded overflow-hidden shadow-lg mx-auto">
        <Image
          src={profile_image}
          alt={props.web_name}
          width={220}
          height={280}
          className="w-full"
        />
        <div className="py-4">
          <h1 className="font-bold text-2xl mb-4 px-3">{props.first_name} {props.second_name}</h1>
          <h2 className="inline-block rounded-full text-xl font-medium bg-gray-200 px-3 py-1 text-sm text-gray-700 mb-1">
            £{(props.now_cost / 10).toFixed(1)}m
          </h2>

          <table className="table mt-5 mb-3 w-full">
            <thead>
              <tr className="text-sm sm:text-base text-gray-700">
                <th className="w-1/4">Goals</th>
                <th className="w-1/4">Selected By</th>
                <th className="w-1/4">Total Points</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-lg">
                <td className="bg-gray-100 py-2">{props.goals_scored}</td>
                <td className="bg-gray-200 py-2">{props.selected_by_percent}%</td>
                <td className="bg-gray-300 py-2 font-bold">{props.total_points}</td>
              </tr>
            </tbody>
          </table>

          <p className="flex items-center w-full justify-center leading-relaxed font-bold text-lg py-3 text-gray-700">
            GW Net Transfers:
            {
              (props.transfers_in_event - props.transfers_out_event) > 0
                ? <span className="ml-4 bg-green-700 rounded-full px-3 py-1 text-sm font-semibold text-green-50">{props.transfers_in_event - props.transfers_out_event}</span>
                : <span className="ml-4 bg-red-700 rounded-full px-3 py-1 text-sm font-semibold text-red-50">{props.transfers_in_event - props.transfers_out_event}</span>
            }
          </p>
        </div>
        {props.news.length ? <mark className="block p-2 leading-relaxed bg-red-600 text-white text-sm">🚨 {props.news}</mark> : ''}
      </div>
    </div>
  )
}
