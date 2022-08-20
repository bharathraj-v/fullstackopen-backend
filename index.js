require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

app.post('/api/persons', (request, response) => {
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

app.get('/api/persons', (request, response, next) => {
	Person.find({}).then(person => {
		response.json(person)
	}).catch(error => next(error))
})


app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id)
		.then(person => {
			console.log(person)
			if (person) {
				response.json(person)
			} else {
				response.status(404).end()
			}
		})
		.catch(error => next(error))
})


app.delete('/api/persons/:number', (request, response, next) => {
	const number = request.params.number
	Person.findOneAndDelete({ number: number }).then(
		console.log('Deleted')
	)
		.catch(error => next(error))
	response.status(202).end()
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})