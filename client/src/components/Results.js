import { deletePerson } from "../services/people"

const Results = ({ persons, setPersons, newFilter, setErrorMessage, setErrorType }) => {

    const filtered = persons.filter(person => {
        return Object.values(person).join('').toLowerCase().includes(newFilter.toLowerCase())
    })

    const handleDelete = ({ id, name }) => {
        if(window.confirm(`Delete ${name}?`)) {
            deletePerson(id)
                .then(setPersons(persons.filter(person => person.id !== id)))
                .then(setErrorMessage(`Deleted ${name}`))
                .then(setTimeout(() => {
                    setErrorMessage()
                }, 5000))
                .catch(() => {
                    setErrorMessage(`${name} has already been removed from the server`)
                    setErrorType('error')
                    setTimeout(() => {
                      setErrorMessage()
                    }, 5000)
                })
        }
    }

    return (
        <div>
            <h2>Numbers</h2>
            {filtered.map(person => {
                return (
                    <li key={person.id}>{person.name} {person.number} 
                        <button onClick={() => handleDelete({...person})}>delete</button>
                    </li>)
            })
            }
        </div>
    )
}

export default Results