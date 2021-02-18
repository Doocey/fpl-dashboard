// import styles from '../styles/Prices.module.css'
import Head from 'next/head'
import Link from 'next/link'

export default function Prices(props) {
    // Destructure priceRisers + priceFallers from passed props
    const { priceRisers, priceFallers } = props
    const meta_description = 'Recent price risers/fallers in Fantasy Premier League.'
    return (
        <section className="container">
            <Head>
                <title>Fantasy Premier League Price Risers/Fallers</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="description" content={meta_description}/>
            </Head>      

            <h2>Risers:</h2>      
            <table style={{background: "seagreen", width: "400px", padding: "20px", color: "white"}}>
                <thead style={{textAlign: "left"}}>
                    <th>Player</th>
                    <th>Price</th>
                    <th style={{textAlign: "right"}}>Selected By: (%)</th>
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
                        <td style={{textAlign: "center"}}>{player.sbp}%</td>
                    </tr>
                )}
                </tbody>
            </table>

            <h2>Fallers:</h2>   
            <table style={{background: "tomato", width: "400px", padding: "20px"}}>
                <thead style={{textAlign: "left"}}>
                    <th>Player</th>
                    <th>Price</th>
                    <th style={{textAlign: "right"}}>Selected By: (%)</th>
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
                        <td style={{textAlign: "center"}}>{player.sbp}%</td>
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

    /**
     * Split players by price rise / drop
     * Can we do this in a nicer fashion?..
     */
    
    let priceRisers = [];
    let priceFallers = [];

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
        },
        revalidate: 10
    }
}