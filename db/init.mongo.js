/*
This is the initial mongo script to be run for getting started/resetting databases.
*/

db.userdetails.deleteMany({}); // collection for user details
db.userprefdetails.deleteMany({}); // collection for user preference details
db.moviedetails.deleteMany({}); // collection for movie details

const initUserDetails = [
    { email: 'sariha@gmail.com', name: 'Sariha', nickname: 'Sari', phone: 12345678, age: 26, gender: 'Female'},
    { email: 'sri@gmail.com', name: 'Sricharan', nickname: 'Sri', phone: 43534563, age: 24, gender: 'Male'},
    { email: 'wen@gmail.com', name: 'Wen', nickname: 'Wen', phone: 98456984, age: 26, gender: 'Female'}
];

const initUserPrefDetails = [
    { email: 'sariha@gmail.com', genresLoved: ['Comedy', 'Romance'], directorsLoved: ['Wong Kar-wai', 'Mani Ratnam'], actorsLoved: ['Leonardo di Caprio', 'Zendaya'], moviesLoved: ['Barbie', 'Dune']},
    { email: 'sri@gmail.com', genresLoved: ['Action', 'Drama'], directorsLoved: ['Wong Kar-wai', 'Spike Lee'], actorsLoved: ['Park So-dam', 'Christian Bale'], moviesLoved: ['In The Mood For Love', 'Dune']},
    { email: 'wen@gmail.com', genresLoved: ['Romance', 'Drama'], directorsLoved: ['Wong Kar-wai', 'Christopher Nolan'], actorsLoved: ['Park So-dam', 'Zendaya'], moviesLoved: ['Oppenheimer', 'Barbie']}
];

db.userdetails.insertMany(initUserDetails);
db.userprefdetails.insertMany(initUserPrefDetails);

const count = db.userdetails.countDocuments({});
print('Inserted', count, 'FilmLore users');

db.userdetails.createIndex({ email: 1 }, { unique: true });
db.userdetails.createIndex({ name: 1 });
db.userdetails.createIndex({ nickname: 1 });
db.userdetails.createIndex({ phone: 1 });
db.userdetails.createIndex({ age: 1 });
db.userdetails.createIndex({ gender: 1 });

db.userprefdetails.createIndex({ email: 1 }, { unique: true });
db.userprefdetails.createIndex({ genresLoved: 1 });
db.userprefdetails.createIndex({ directorsLoved: 1 });
db.userprefdetails.createIndex({ actorsLoved: 1 });
db.userprefdetails.createIndex({ moviesLoved: 1 });

db.moviedetails.createIndex({ id: 1 }, { unique: true });
db.moviedetails.createIndex({ title: 1 });
db.moviedetails.createIndex({ genres: 1 });
db.moviedetails.createIndex({ actors: 1 });
db.moviedetails.createIndex({ directors: 1 });
db.moviedetails.createIndex({ synopsis: 1 });