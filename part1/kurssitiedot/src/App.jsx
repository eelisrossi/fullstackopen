const Header = (props) => {
    return (
        <div>
            <h1>{props.course}</h1>
        </div>
    )
}

const Content = (props) => {
    const contentItems = props.parts.map(item =>
        <p key={item.id}>
            {item.part} {item.exercises}
        </p>
    )
    return (
        <div>
            {contentItems}
        </div>
    )
}

const Total = (props) => {
    var total = 0
    props.parts.map(item =>
        total += item.exercises
    )
    return (
        <p>Number of exercises {total}</p>
    )
}

const App = () => {
    const course = {
        name: 'Half Stack application development',
        parts: [
            {
                id: 0,
                part: 'Fundamentals of React',
                exercises: 10,
            }, {
                id: 1,
                part: 'Using props to pass data',
                exercises: 7,
            }, {
                id: 2,
                part: 'State of a component',
                exercises: 14,
            }
        ]
    }


    return (
        <div>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    )
}

export default App
