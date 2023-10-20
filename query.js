const { OpenAI } = require('openai');
const { Pinecone } = require("@pinecone-database/pinecone");

require('dotenv').config()

const openai = new OpenAI();
openai.apiKey = process.env.OPENAI_API_KEY

let query = "product: apple laptop category: electronics price: 10000 rating: 4.5"

const findItems = async(query) => {
    console.log(query)
    const pinecone = new Pinecone()
    const index = pinecone.index("hackon");

    const embeddingResult = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: [query]
    })

    let vector = embeddingResult.data[0].embedding;
    // return console.log(vector)

    let pineconeResult = await index.query({
        vector: vector,
        topK: 5,
        includeMetadata: true,
        includeValues: false
    })

    let matches = pineconeResult.matches;
    console.log(matches)


    // to query the results from the json file  
    const data = require('./data.json')
    let inputs = []
    for (let i = 1; i < 1000; i++) {
        if ((i.toString() in data) === false) {
            continue
        }
        inputs.push(data[i.toString()])
    }

    const matchedID = matches.map(match => match.metadata.id)
    const res = inputs.filter(item => matchedID.includes(item.product_id))
    // console.log(res)
    return res
}

function displayItems(matched) {
    console.log('Hello world!')
}

// const matched = main(query)
// findItems(query)
module.exports = { findItems}
