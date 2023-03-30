import { createPerson, editNumber } from '../services/people'

const Add = ({ persons, setPersons, newName, setNewName, newNumber, setNewNumber, setErrorMessage, setErrorType }) => {

  const addPerson = (e) => {
    e.preventDefault();
    const nameObj = {
      name: newName,
      number: newNumber
    }

    const names = persons.map(person => person.name)

    if (names.includes(newName)) {
      if(window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        const person = persons.find(el => el.name === newName)
        editNumber(person.id, nameObj)
          .then(setPersons(persons.map(el => el.name === newName ? {...el, number: newNumber} : el)))
          .then(() => {
            setErrorMessage(`Updated ${newName}`)
            setErrorType('success')
          })
          .then(setTimeout(() => {
            setErrorMessage()
          }, 5000))
          .catch(err => console.log(err))
      }
    } else {
      createPerson(nameObj)
        .then(res => setPersons(persons.concat(res.data)))
        .then(() => {
          setErrorMessage(`Added ${newName}`)
          setErrorType('success')
        })
        .then(setTimeout(() => {
            setErrorMessage()
          }, 5000))
        .catch(() => {
            setErrorMessage(`An error occured`)
            setErrorType('error')
            setTimeout(() => {
              setErrorMessage()
            }, 5000)
        })
    }
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <form onSubmit={addPerson}>
        <h2>add a new</h2>
        <div>
          name: <input value={newName} onChange={(e) => setNewName(e.target.value)} /><br />
          number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

export default Add