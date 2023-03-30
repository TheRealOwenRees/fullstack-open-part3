import { useState, useEffect } from 'react'
import Results from './components/Results'
import Search from './components/Search'
import Add from './components/Add'
import Notification from './components/Notification'
import { getAll } from './services/people'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorType, setErrorType] = useState('')

  useEffect(() => {
    getAll()
      .then(response => setPersons(response.data))
      .catch(err => console.log(err))
  }, [])

  return (
    <div>
      <Search newFilter={newFilter} setNewFilter={setNewFilter} />
      <Notification message={errorMessage} type={errorType} />
      <Add persons={persons} 
            setPersons={setPersons} 
            newName={newName} setNewName={setNewName} 
            newNumber={newNumber} 
            setNewNumber={setNewNumber} 
            setErrorMessage={setErrorMessage}
            setErrorType={setErrorType}
      />
      <Results persons={persons} 
              setPersons={setPersons}
              newFilter={newFilter}
              setErrorMessage={setErrorMessage}
              setErrorType={setErrorType}
      />
    </div>
  )
}

export default App