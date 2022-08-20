require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(morgan('tiny'))
app.use(cors())
app.use(express.json())
app.use(express.static('build'))


// Person.findOne({name:  "Bharath Raj"}, (err, docs)=>{
//   if (err){
//       console.log(err)
//   }
//   else{
//       console.log("Result : ", docs);
//   }
// } )

// let persons =[
//   { 
//     id: 1,
//     name: "Arto Hellas", 
//     number: "040-123456"
//   },
//   { 
//     id: 2,
//     name: "Ada Lovelace", 
//     number: "39-44-5323523"
//   },
//   { 
//     id: 3,
//     name: "Dan Abramov", 
//     number: "12-43-234345"
//   },
//   { 
//     id: 4,
//     name: "Mary Poppendieck", 
//     number: "39-23-6423122"
//   }
// ]

// const generateId = () => {
//   const maxId = persons.length > 0
//     ? Math.max(...persons.map(n => n.id))
//     : 0
//   return maxId + 1
// }

// app.delete('/api/persons/:id', (request, response) => {
//   const id = Number(request.params.id)
//   persons = persons.filter(person => person.id !== id)
//   response.status(202).end()
// })

// app.get("/:id", (request, response) => {
//   const id = Number(request.params.id)
//   const person = persons.find(person => person.id === id)
//   person ?
//     response.send(`
//     <p><b>ID</b>: ${person.id}</p>
//     <p><b>Name</b>: ${person.name}</p>
//     <p><b>Number</b>: ${person.number}</p>
//     `)
//     :
//     response.status(404).end()
// })


// app.get('/info', (request, response) => {
//   const date = new Date()
//   response.send(`<p>Phonebook has info for ${persons.length} people</p>
//   ${date}`)
// })

// app.get('/api/persons', (request, response) => {
//   response.json(persons)
// })

app.post("/api/persons", (request, response) => {
  const body = request.body
  if (body.name === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }
  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})


app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
  .then(person => {
    console.log(person)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => {
    console.log(error)
    response.status(400).send({ error: 'malformatted id' })
  })
})


app.delete('/api/persons/:number', (request, response) => {
  const number = request.params.number
  Person.findOneAndDelete({number: number}).then(
    console.log("Deleted")
  )
  response.status(202).end()
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})