// import styles from '../styles/Prices.module.css'

export default function Prices(props) {
    const priceRisers = [];
    const priceFallers = [];

    props.players.forEach(player => {
        if (player.cost_change_event > 0) {
            priceRisers.push(
                {
                    name: player.web_name,
                    price: player.now_cost,
                    sbp: player.selected_by_percent
                }
            )
        } else {
            priceFallers.push(
                {
                    name: player.web_name,
                    price: player.now_cost,
                    sbp: player.selected_by_percent
                }
            )
        }
    }
    )

    console.log('Risers: ' + priceFallers)
    console.log('Fallers: ' + priceFallers)
    return (
        <section>
            <strong>RISER:</strong>
            <tr>
                <td><strong>Player:</strong></td>
                <td><strong>Price:</strong></td>
                <td><strong>Selected By (%):</strong></td>
            </tr>
            {
                priceRisers.map(x =>
                    <tr>
                        <td>{x.name}</td>
                        <td>£{(x.price / 10).toFixed(1)}m</td>
                        <td>{x.sbp}%</td>
                    </tr>
                )
            }
            <hr />
            <strong>FALLER:</strong>
            <table>
                <tr>
                    <td><strong>Player:</strong></td>
                    <td><strong>Price:</strong></td>
                    <td><strong>Selected By (%):</strong></td>
                </tr>
                {
                    priceFallers.map(x =>
                        <tr>
                            <td>{x.name}</td>
                            <td>£{(x.price / 10).toFixed(1)}m</td>
                            <td>{x.sbp}%</td>
                        </tr>
                    )
                }
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

    return {
        props: {
            players
        }
    }
}