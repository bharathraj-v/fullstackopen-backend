const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})



if (process.argv.length < 3) {
    console.log("Please provide arguments: node mongo.js <password> <name> <number>")
    process.exit(1)
} else if (process.argv.length == 3) {
    const password = process.argv[2]
    const url = `mongodb+srv://bharathraj-v:${password}@cluster0.9ie5vmk.mongodb.net/?retryWrites=true&w=majority`
    const Person = mongoose.model('Person', personSchema)
    mongoose
        .connect(url)
        .then(() => {
            Person.find({})
                .then(persons => {
                    persons.forEach(person => {
                        console.log(person.name, person.number)
                        mongoose.connection.close()
                    })
                })
        })


} else {
    const password = process.argv[2]
    const newName = process.argv[3]
    const newNumber = process.argv[4]
    const url = `mongodb+srv://bharathraj-v:${password}@cluster0.9ie5vmk.mongodb.net/?retryWrites=true&w=majority`
    const Person = mongoose.model('Person', personSchema)

    mongoose
        .connect(url)
        .then((result) => {
            console.log('Connected')

            const person = new Person({
                name: newName,
                number: newNumber
            })

            return person.save()
        })
        .then(() => {
            console.log(`added ${newName} number ${newNumber} to phonebook`)
            return mongoose.connection.close()
        })
        .catch((err) => console.log(err))
}