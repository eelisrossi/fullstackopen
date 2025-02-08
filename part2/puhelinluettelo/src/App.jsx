import { useState, useEffect } from 'react'
import personService from './services/persons'

const Persons = ({ persons, onClick }) => (
    <div>
        {persons.map(person =>
            <li key={person.id}>{person.name} {person.number}
                <button onClick={() => onClick(person)}>delete</button>
            </li>
        )}
    </div>
)

const PersonForm = ({ onSubmit, newPerson, handleName, handleNumber }) => (
    <div>
        <form onSubmit={onSubmit}>
            <div>
                name: <input
                    value={newPerson.name}
                    onChange={handleName}
                />
            </div>
            <div>
                number: <input
                    value={newPerson.number}
                    onChange={handleNumber}
                />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    </div>
)

const Filter = ({ filterStr, handleFilter }) => (
    <div>
        filter shown with <input
            value={filterStr}
            onChange={handleFilter}
        />
    </div>

)

const App = () => {
    const [persons, setPersons] = useState([])
    const [filterStr, setFilterStr] = useState('')
    const [newPerson, setNewPerson] = useState({ name: '', number: '' })

    useEffect(() => getPersons(), [])

    const getPersons = () => {
        personService
            .getAll()
            .then(initialPersons => {
                setPersons(initialPersons)
            })
    }

    const submitForm = (event) => {
        event.preventDefault()
        if (newPerson.number === '' || newPerson.name === '') {
            alert('Please add a name and a number before submitting')
            setNewPerson({ name: '', number: '' })
            return
        }
        const existingPerson = persons.find(person => person.name === newPerson.name)
        if (existingPerson) {
            if (window.confirm(`${existingPerson.name} is already in the phonebook!\nDo you want to replace their number with the new one?`)) {
                const updatedPerson = { ...existingPerson, number: newPerson.number }
                personService
                    .update(existingPerson.id, updatedPerson)
                    .then(returnedPerson => {
                        setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
                        setNewPerson({ name: '', number: '' })
                    })
                    .catch(error => {
                        alert(`the person '${existingPerson.name}' was already deleted from server`, error)
                        setPersons(persons.filter(person => person.id !== existingPerson.id))
                    })
            }
        } else {
            personService
                .create(newPerson)
                .then(returnedPerson => {
                    setPersons(persons.concat(returnedPerson))
                    setNewPerson({ name: '', number: '' })
                })
        }
    }

    const removePerson = (person) => {
        if (window.confirm(`Do you want to remove ${person.name} from the phonebook?`)) {
            personService
                .remove(person.id)
                .then(removedUser => {
                    console.log('removed user:', removedUser.name)
                    getPersons()
                })
        }
    }

    const handleNameChange = (event) => {
        setNewPerson({ ...newPerson, name: event.target.value })
    }

    const handleNumberChange = (event) => {
        setNewPerson({ ...newPerson, number: event.target.value })
    }

    const handleFilterChange = (event) => {
        setFilterStr(event.target.value)
    }

    return (
        <div>
            <h2>Phonebook</h2>

            <Filter filterStr={filterStr} handleFilter={handleFilterChange} />

            <h3>Add a new number</h3>

            <PersonForm
                onSubmit={submitForm}
                newPerson={newPerson}
                handleName={handleNameChange}
                handleNumber={handleNumberChange}
            />

            <h3>Numbers</h3>

            <Persons
                persons={persons.filter(person =>
                    person.name.toLowerCase()
                        .includes(filterStr.toLowerCase()))}
                onClick={removePerson}
            />
        </div>
    )
}

export default App
