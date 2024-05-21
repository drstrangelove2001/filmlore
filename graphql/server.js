/*
This file contains graphQL resolvers and methods to call the MovieGlu APIs and mongoDB.
*/

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const axios = require('axios');
const authHeaders = require('../headers/auth-headers');
const { connectToDb } = require('../db/server.js');
const { GraphQLScalarType } = require('graphql')
const { Kind } = require('graphql/language')


const fs = require('fs');
const endpoint = authHeaders.endpoint;

const app = express();

app.use(express.static('public'));

let db;

/*
  This is a default type created to account for the API response which sends results as a key-value pair with keys as integers.
  This scalar type is required.
*/
const ObjectScalarType = new GraphQLScalarType({
  name: 'Object',
  description: 'Arbitrary object',
  parseValue: (value) => {
    return typeof value === 'object' ? value
      : typeof value === 'string' ? JSON.parse(value)
      : null
  },
  serialize: (value) => {
    return typeof value === 'object' ? value
      : typeof value === 'string' ? JSON.parse(value)
      : null
  },
  parseLiteral: (ast) => {
    switch (ast.kind) {
      case Kind.STRING: return JSON.parse(ast.value)
      case Kind.OBJECT: throw new Error(`Not sure what to do with OBJECT for ObjectScalarType`)
      default: return null
    }
  }
});

const resolvers = {
  Object: ObjectScalarType,
  Query: {
    //Resolver to fetch movie details based on filmId
    getFilmDetails: async(_, args) => {
      const currentDate = new Date();
      try {
        const { filmId } = args;
        //Makes a GET request to the endpoint with filmId as a query parameter
        const response = await axios.get(`${endpoint}/filmDetails/?film_id=${filmId}`, {
            headers: {
                'client': authHeaders.client,
                'x-api-key': authHeaders.xApiKey,
                'Authorization': authHeaders.authorization,
                'territory': authHeaders.territory,
                'api-version': authHeaders.apiVersion,
                'geolocation': authHeaders.geolocation,
                'device-datetime': currentDate.toISOString()
            }
        });
        return response.data; //Returns the film details from movieglu API
      } catch (error) {//Handles any error that occurs during the data fetch
        console.error('Error fetching film details:', error);
        throw new Error(`Failed to fetch details for film ID ${filmId}`);
      }
    },
    //Resolver to fetch showtimes for selected film at nearest cinemas.
    getFilmShowTimes: async (_, args) => {
      const currentDate = new Date();
      const { filmId, date } = args;
      try {
        //Makes a GET request to the endpoint with filmId and date as a query parameter
        const response = await axios.get(`${endpoint}/filmShowTimes/?film_id=${filmId}&date=${date}`, {
          headers: {
            'client': authHeaders.client,
            'x-api-key': authHeaders.xApiKey,
            'Authorization': authHeaders.authorization,
            'territory': authHeaders.territory,
            'api-version': authHeaders.apiVersion,
            'geolocation': authHeaders.geolocation,
            'device-datetime': currentDate.toISOString()
          }
        });
        return response.data ; //Returns the film showtimes from movieglu API
      } catch (error) {//Handles any error that occurs during the data fetch
        console.error('Error fetching film showtimes:', error);
        throw new Error(`Failed to fetch showtimes for film ID ${filmId} on date ${date}`);
      }
    },
    //Resolver to fetch user details from DB.
    getUser: async(_, args) => {
      const { email } = args;
      try {
        result = await db.collection('userdetails').find({email: email}, {email: 1, name: 1, nickname: 1, phone: 1, age: 1, gender: 1}).toArray();
        return result[0];
      } catch (error) {
        throw new Error('Failed to get user from DB');
      }
    },
    //Resolver to fetch user preference details from DB.
    getUserPref: async(_, args) => {
      const { email } = args;
      try {
        result = await db.collection('userprefdetails').find({email: email}, {email: 1, genresLoved: 1, directorsLoved: 1, actorsLoved: 1, moviesLoved: 1}).toArray();
        return result[0];
      } catch (error) {
        throw new Error('Failed to get user pref from DB');
      }
    },
    //Resolver to link directly to cinema websites with film, time and date selected.
    getPurchaseConfirmation: async (_, args) => {
      const currentDate = new Date();
      const { filmId,cinemaId,date,time} = args;
      try {
         //Makes a GET request to the endpoint with cinemaId,filmId,date and time as a query parameter
        const response = await axios.get(`${endpoint}/purchaseConfirmation/?cinema_id=${cinemaId}&film_id=${filmId}&date=${date}&time=${time}`, {
          headers: {
            'client': authHeaders.client,
            'x-api-key': authHeaders.xApiKey,
            'Authorization': authHeaders.authorization,
            'territory': authHeaders.territory,
            'api-version': authHeaders.apiVersion,
            'geolocation': authHeaders.geolocation,
            'device-datetime': currentDate.toISOString()
          }
        });
        return response.data ;  //Returns the cinema website url from movieglu API
      } catch (error) {//Handles any error that occurs during the data fetch
        console.error('Error fetching Purchase Confirmation:', error);
        throw new Error(`Failed to fetch purchase confirmation for cinema ID ${cinemaId},film ID ${filmId} on date ${date} and time ${time}`);
      }
    },
    //Resolver to fetch upcoming film details.
    getFilmsComingSoon: async (_,) => {
      try {
        const currentDate = new Date();
        const response = await axios.get(`${endpoint}/filmsComingSoon/?n=10`, {
          headers: {
            'client': authHeaders.client,
            'x-api-key': authHeaders.xApiKey,
            'Authorization': authHeaders.authorization,
            'territory': authHeaders.territory,
            'api-version': authHeaders.apiVersion,
            'geolocation': authHeaders.geolocation,
            'device-datetime': currentDate.toISOString()
          }
        });
        return response.data.films;
      } catch (error) {
        console.error('Error fetching upcoming films:', error);
        throw new Error('Failed to fetch upcoming films');
      }
    },
    //Resolver to fetch currently running film details.
    getFilmsNowShowing: async (_,) => {
      try {
        const currentDate = new Date();
        const response = await axios.get(`${endpoint}/filmsNowShowing/?n=25`, {
          headers: {
            'client': authHeaders.client,
            'x-api-key': authHeaders.xApiKey,
            'Authorization': authHeaders.authorization,
            'territory': authHeaders.territory,
            'api-version': authHeaders.apiVersion,
            'geolocation': authHeaders.geolocation,
            'device-datetime': currentDate.toISOString()
          }
        });
        return response.data.films;
      } catch (error) {
        console.error('Error fetching nowshowing films:', error);
        throw new Error('Failed to fetch nowshowing films');
      }
    },
  },
  Mutation: {
    addUser: async (_, args) => {
      const {user} = args;
      try {
        result = await db.collection('userdetails').insertOne(user);
        return user.email;
      } catch (error) {
        throw new Error('Failed to add user to DB');
      }
    },
    addUserPref: async (_, args) => {
      const {userPref} = args;
      try {
        result = await db.collection('userprefdetails').insertOne(userPref);
        return userPref.email;
      } catch (error) {
        throw new Error('Failed to add user pref to DB');
      }
    }
  }
};

const server = new ApolloServer({ 
    typeDefs: fs.readFileSync('./graphql/schema.graphql', 'utf-8'), 
    resolvers: resolvers,
    port: 4000    
});

(async function() {
    await server.start();
    db = await connectToDb();
    server.applyMiddleware({ app, path: '/graphql' });
})();

// Start the server
app.listen(4000, function () {
    console.log('App start on port 4000 successfully');
});