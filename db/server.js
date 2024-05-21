/*
This file contains methods to connect to the mongoDB.
*/

const { MongoClient } = require('mongodb');

let db;

async function connectToDb() {
    const url = 'mongodb://localhost/filmlore';
    const client = new MongoClient(url, { useNewUrlParser: true });
    await client.connect();
    console.log('Connected to FilmLore MongoDB at', url);
    db = client.db();
    return db;
}

module.exports.connectToDb = connectToDb;
