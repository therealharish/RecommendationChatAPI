const express = require('express')
const app = express()
app.use(express.json())
const PORT = 3000
const findItems = require('./query.js')

app.get('/', (request, response) => {
    response.json({ message: 'Hello world!' })
})

app.post('/query', (request, response) => {
    const body = request.body
  
    if (!body.query) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }

    const query = {
        query: body.query
    }

    findItems.findItems(query)
    .then(matchedProducts => {
        response.json(matchedProducts)
    })
    .catch(error => {
        console.log(error)
        response.status(500).end()
    })
    
  })

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})