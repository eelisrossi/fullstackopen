const Course = ({ course }) => (
    <div>
        <Header name={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
    </div>
)

const Header = ({ name }) => (
    <h2>{name}</h2>
)

const Part = ({ part }) => (
    <div>{part.part} {part.exercises}</div>
)

const Content = ({ parts }) => (
    <div>
        {parts.map(part =>
            <Part key={part.id} part={part} />
        )}
    </div>
)

const Total = (props) => {
    const total = props.parts.reduce((prev, cur) =>
        prev + cur.exercises, 0)
    return (
        <p><b>total of {total} exercises </b></p>
    )
}

export default Course
