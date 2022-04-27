import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

const Filter = (props) => {
  return (
    <p>Filter results with <input placeholder={props.placeholder} value={props.value} onChange={props.onChange} /></p>
  )
}

const PersonForm = (props) => {
  return (
    <>
    <form onSubmit={props.onSubmit}>
      <div>
        name: <input name="name" value={props.name} onChange={props.onChange} /><br />
        number: <input name="number" value={props.number} onChange={props.onChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
    </>
  ) 
}

const Persons = (props) => {
  return(
    <ul>
      {props.list.map(p => <li key={p.name}>{p.name}, {p.number} <button onClick={id => props.btn(p.id, p.name)}>{props.btnText}</button></li>)}
    </ul>
  )
}

const Notification = ( {message, status} ) => {
  if (status === null) {
    return null
  }

  else if (status === 'updated' || status === 'added' || status === 'deleted') {
    return (
    <div className='success'>
      {message}
    </div>
    )
  }
  else if (status === 'error') {
  return (
    <div className="error">
      {message}
    </div>
  )
  }
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newUser, setNewUser] = useState({name: '', number: ''})
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState({message: null, status: null})
  const [personAddedMessage, setPersonAddedMessage] = useState({message: null, status: null})
  const [personUpdatedMessage, setPersonUpdatedMessage] = useState({message: null, status: null})
  const [personDeletedMessage, setPersonDeletedMessage] = useState({message: null, status: null})

  useEffect(() => {
    personService
      .getAll()
        .then(response => {
        setPersons(response.data)
      })
      .catch(error => {
        setErrorMessage({...errorMessage, message:
          `There was an error when loading phonebook`, status: 'error'
        })
        setTimeout(() => {
          setErrorMessage({...errorMessage, message: null, status: null})
        }, 5000) 
        
        })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    
    const phoneObject = {
      name: newUser.name,
      number: newUser.number
    }
    if (persons.find(p => p.name === newUser.name)) {
      
      const person = persons.find(p => p.name === newUser.name)
      const id = person.id
      console.log(id)
      
      const editPerson = persons.find(p => p.name === newUser.name)
      const newNumber = {...editPerson, number: newUser.number }

      const confirm = window.confirm(`${newUser.name} is already added to the phonebook, replace the ole number with a new one?`)
        if (confirm === true) { 
            if (persons.find(p => p.number === newUser.number)) { 
            alert(`Number ${newUser.number} is already added to phonebook`) 
            }
            else {
            personService
            .update(id, newNumber)
            .then(response => {
              setPersons(persons.map(editPerson => editPerson.id !== id ? editPerson : response.data))
              setPersonUpdatedMessage({...personUpdatedMessage, message: `${newUser.name} has been updated!`, status: 'updated'})
              setTimeout(() => {
                setPersonUpdatedMessage({message: null, status: null})
              }, 5000) 
              setNewUser({...newUser, name: '', number: ''})
              .catch(error => {
                setErrorMessage({message:
                  `There was an error when updating contact to the phonebook`, status: 'error'
                })
                setTimeout(() => {
                  setErrorMessage({...errorMessage, message: null, status: null})
                }, 5000) 
                
                })
            })  } 
        } 
    }
    else if (persons.find(p => p.number === newUser.number))
      alert(`Number ${newUser.number} is already added to phonebook`)
    else
    personService
      .create(phoneObject)
      .then(response => {
        setPersons(persons.concat(response.data))
        setPersonAddedMessage({message: `Added ${newUser.name}`, status: 'added'})
        setTimeout(() => {
          setPersonAddedMessage({message: null, status: null})
        }, 5000) 
        setNewUser({...newUser, name: '', number: ''})
      })
      .catch(error => {
        setErrorMessage({message:
          `There was an error when adding contact to the phonebook`, status: 'error' }
        )
        setTimeout(() => {
          setErrorMessage({...errorMessage, message: null, status: null})
        }, 5000) 
        }
        )
        
  }

  const deleteName = (id, name) => {
    window.confirm(`Delete ${name}?`)
    ? personService
      .erase(id)
      .then(response => {
        setPersons(response.data)
        reloadNames()
        setPersonDeletedMessage({...personDeletedMessage, message: `${name} deleted successfully!`, status: 'deleted'})
        setTimeout(() => {
          setPersonDeletedMessage({...personDeletedMessage, message: null, status: null})
        }, 5000) 
      })
      .catch(error => {
        setErrorMessage({message:
          `There was an error when deleting contact from the phonebook`, status: 'error' }
        )
        setTimeout(() => {
          setErrorMessage({...errorMessage, message: null, status: null})
        }, 5000) 
        
        })
    : console.log("Deleting canceled")
  }
const reloadNames = () => {
  personService
    .getAll()
      .then(response => {
      setPersons(response.data)
    })
    .catch(error => {
      setErrorMessage({message:
        `There was an error when loading contacts to the phonebook`, status: 'error'}
      )
      setTimeout(() => {
        setErrorMessage({...errorMessage, message: null, status: null})
      }, 5000) 
      
      })

}

  const inputChange = event => {
    setNewUser({...newUser, [event.target.name]: event.target.value})
  }

  const inputFilter = event => {
    setFilter(event.target.value)
  }

    const filteredNumbers = 
    Object.values(persons).filter(p => p.name.toLowerCase().includes(filter.toLowerCase()) || p.number.includes(filter))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage.message} status={errorMessage.status} />
      <Notification message={personAddedMessage.message} status={personAddedMessage.status}/>
      <Notification message={personUpdatedMessage.message} status={personUpdatedMessage.status}/>
      <Notification message={personDeletedMessage.message} status={personDeletedMessage.status} />
      <Filter name="filter" placeholder="filter..." value={filter} onChange={inputFilter} />
     <h3>Add a new number</h3>
     <PersonForm onSubmit={addName} name={newUser.name} number={newUser.number} onChange={inputChange} />
      <h3>Numbers</h3>
      <Persons list={filteredNumbers} btn={deleteName} btnText="Delete"/>
    </div>
  )

}

export default App