import Course from './components/Course'

const Courses = ({ courses }) => (
    <div>
        <h1>Web development curriculum</h1>
        {courses.map(course =>
            <Course key={course.id} course={course} />
        )}
    </div>
)


const App = () => {
    const courses = [
        {
            name: 'Half Stack application development',
            id: 1,
            parts: [
                {
                    id: 1,
                    part: 'Fundamentals of React',
                    exercises: 10,
                }, {
                    id: 2,
                    part: 'Using props to pass data',
                    exercises: 7,
                }, {
                    id: 3,
                    part: 'State of a component',
                    exercises: 14,
                }, {
                    id: 4,
                    part: 'Something or other',
                    exercises: 9,
                },
            ]
        },
        {
            name: 'Node.js',
            id: 2,
            parts: [
                {
                    id: 1,
                    part: 'Routing',
                    exercises: 3,
                }, {
                    id: 2,
                    part: 'Middlewares',
                    exercises: 7,
                },
            ]
        },
    ]


    return (
        <div>
            <Courses courses={courses} />
        </div>
    )
}

export default App
