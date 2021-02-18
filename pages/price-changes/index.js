// import styles from '../styles/Prices.module.css'
import Link from 'next/link'

export default function Prices(props) {

    // Destructure priceRisers + priceFallers from passed props
    const { priceRisers, priceFallers } = props

    return (
        <section>
            <table style={{background: "seagreen"}}>
                <thead>
                    <th>Player</th>
                    <th>Price</th>
                </thead>
                <tbody>
                {priceRisers.map(player => 
                    <tr>
                        <td>
                            <Link href={`/player/${player.id}`}>
                                <a>{player.name}</a>
                            </Link>
                        </td>
                        <td>£{(player.price / 10).toFixed(1)}m</td>
                    </tr>
                )}
                </tbody>
            </table>

            <hr/>
            <table style={{background: "red"}}>
                <thead>
                    <th>Player</th>
                    <th>Price</th>
                </thead>
                <tbody>
                {priceFallers.map(player => 
                    <tr>
                        <td>
                            <Link href={`/player/${player.id}`}>
                                <a>{player.name}</a>
                            </Link>
                        </td>
                        <td>£{(player.price / 10).toFixed(1)}m</td>
                    </tr>
                )}
                </tbody>
            </table>
        </section>
    )
}

export async function getStaticProps() {
    const res = await fetch('https://www.newcastle360.com/kevin/')
    const allData = await res.json()
    const players = allData.elements.filter(player =>
        !(player.status === 'u') &&
        !(player.cost_change_event === 0)
    )

    const priceRisers = [];
    const priceFallers = [];

    players.forEach(player => {
        if (player.cost_change_event > 0) {
            priceRisers.push(
                {
                    name: player.web_name,
                    price: player.now_cost,
                    sbp: player.selected_by_percent,
                    id: player.id
                }
            )
        } else {
            priceFallers.push(
                {
                    name: player.web_name,
                    price: player.now_cost,
                    sbp: player.selected_by_percent,
                    id: player.id
                }
            )
        }
    })

    return {
        props: {
            priceRisers,
            priceFallers
        }
    }
}