import { useState } from 'react'

const StatisticsLine = (props) => (
    <tr>
        <td>{props.text}</td>
        <td>{props.value}</td>
    </tr>
)

const Statistics = (props) => {
    const good = props.values.good
    const neutral = props.values.neutral
    const bad = props.values.bad

    const all = good + neutral + bad
    const avg = ((good - bad) / all).toFixed(2)
    const positive = `${((good / all) * 100).toFixed(2)}%`


    if (all === 0) {
        return (
            <div>
                <p>No feedback given</p>
            </div>
        )
    }

    return (
        <div>
            <table>
                <tbody>
                    <StatisticsLine text="Good" value={good} />
                    <StatisticsLine text="Neutral" value={neutral} />
                    <StatisticsLine text="Bad" value={bad} />
                    <StatisticsLine text="All" value={all} />
                    <StatisticsLine text="Average" value={avg} />
                    <StatisticsLine text="Positive" value={positive} />
                </tbody>
            </table>
        </div>
    )
}

const Button = (props) => (
    <button onClick={props.handleClick}>{props.text}</button>
)



const App = () => {
    // tallenna napit omaan tilaansa
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    const values = {
        good: good,
        neutral: neutral,
        bad: bad,
    }

    return (
        <div>
            <div>
                <h1>Give Feedback</h1>
                <Button handleClick={() => setGood(good + 1)} text="Good" />
                <Button handleClick={() => setNeutral(neutral + 1)} text="Neutral" />
                <Button handleClick={() => setBad(bad + 1)} text="Bad" />
            </div>
            <div>
                <h1>Statistics</h1>
                <Statistics values={values} />
            </div>
        </div>
    )
}

export default App
