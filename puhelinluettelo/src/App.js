import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = (props) => {
  return (
    <p>Filter results with <input name={props.filter} placeholder={props.placeholder} value={props.value} onChange={props.onChange} /></p>
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
      {props.list.map(p => <li key={p.name}>{p.name}, {p.number}</li>)}
    </ul>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])

  const [newUser, setNewUser] = useState({})
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addName = event => {
    event.preventDefault()
    const phoneObject = {
      name: newUser.name,
      number: newUser.number
    }
    if (persons.find(p => p.name === newUser.name))
      alert(`${newUser.name} is already added to phonebook`)
    else if (persons.find(p => p.number === newUser.number))
      alert(`Number ${newUser.number} is already added to phonebook`)
    else
    setPersons(persons.concat(phoneObject)) 
  }

  const inputChange = event => {
    setNewUser({...newUser, [event.target.name]: event.target.value})
  }

  const inputFilter = event => {
    setFilter(event.target.value)
    console.log(filteredNumbers)
  }

  const filteredNumbers = persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()) || p.number.includes(filter))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter name="filter" placeholder="filter..." value={filter} onChange={inputFilter} />
     <h3>Add a new number</h3>
     <PersonForm onSubmit={addName} name={newUser.name} number={newUser.number} onChange={inputChange} />
      <h3>Numbers</h3>
      <Persons list={filteredNumbers}/>
    </div>
  )

}

export default App