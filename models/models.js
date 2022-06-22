const mongoose = require('mongoose');

const testModelSchema = new mongoose.Schema({
    test: String
})

const TestModel = mongoose.model('Test', testModelSchema, 'tests');

module.exports = {TestModel}