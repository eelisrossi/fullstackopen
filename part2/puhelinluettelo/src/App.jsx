import { useState, useEffect } from 'react'
import personService from './services/persons'

const Persons = ({ persons, onClick }) => (
  <div>
    {persons.map(person =>
      <li className='person' key={person.id}>
        {person.name} {person.number}
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

const Notification = ({ message, type }) => {
  if (message === null && type === null) {
    return null
  }

  return (
    <div className={type}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [filterStr, setFilterStr] = useState('')
  const [newPerson, setNewPerson] = useState({ name: '', number: '' })
  const [notificationMessage, setNotificationMessage] = useState({ msg: '', type: '' })

  const msgTimeout = 2000

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
            notificationHandler(`Changed number of ${returnedPerson.name}`)
            setNewPerson({ name: '', number: '' })
          })
          .catch(error => {
            console.log('Error!', error.code)
            notificationHandler(`Person '${existingPerson.name}' was already deleted from the server`, true)
            setPersons(persons.filter(person => person.id !== existingPerson.id))
          })
      }
    } else {
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          notificationHandler(`Added ${returnedPerson.name}`)
          setNewPerson({ name: '', number: '' })
        })
    }
  }

  const removePerson = (person) => {
    if (window.confirm(`Do you want to remove ${person.name} from the phonebook?`)) {
      personService
        .remove(person.id)
        .then(removedUser => {
          notificationHandler(`Removed ${removedUser.name}`)
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

  const notificationHandler = (message, error) => {
    if (error === true) {
      setNotificationMessage({ message: message, type: 'error' })
    } else {
      setNotificationMessage({ message: message, type: 'notification' })
    }
    setTimeout(() => {
      setNotificationMessage({message: '', type: ''})
    }, msgTimeout)
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notificationMessage.message} type={notificationMessage.type} />
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
