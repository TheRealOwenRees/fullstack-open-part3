require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const port = process.env.PORT || 5000
const Person = require('./models/personModel')

const randomID = (req, res, next) => {
  if (req.method === 'POST') {
    req.id = Math.floor(Math.random() * 100)
    next()
  }
}

morgan.token('id', (req, res) => {
  return req.id
})

morgan.token('data', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))

app
  .get('/api/persons', (req, res, next) => {
    Person.find({}).then(people => {
      res.json(people)
    })
      .catch((error) => {
        next(error)
      })
  })
  .post(
    '/api/persons',
    randomID,
    morgan(':method :url :id :status :response-time ms :data '),
    (req, res, next) => {
      const { name, number } = req.body

      Person.findOneAndUpdate(
        { name: name },
        { number: number },
        { new: true, runValidators: true, context: 'query', upsert: true }
      )
        .then((updatedPerson) => {
          return updatedPerson.validate().then(() => {
            res.json(updatedPerson)
          })
        })
        .catch((error) => {
          next(error)
        })
    }
  )

app.get('/info', (req, res) => {
  res.send(
    `Phonebook has info for ${Person.length} people\n${new Date().toString()}`
  )
})

app
  .get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
      .then(person => {
        person ? res.json(person) : res.status(404).end()
      })
      .catch(error => next(error))
  })
  .delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
      .then(result => {
        res.status(204).end()
      })
      .catch(error => next(error))
  })

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
