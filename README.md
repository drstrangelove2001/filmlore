# filmLore

All things cinema and cinema. Experience our personalized movie booking service at its best with our modern user experience with a classic noir touch!
This project is done to satisfy the requirements of IT5007 in NUS.

## Salient features

1. Log in and register with us (in just a click!) using your Google account (easy peacy!)
2. Movie showtimes and cinema information for both non-registered and registered users
3. View upcoming movies
4. Recommendation engine powered by OpenAI for suggesting you the best movies currently running in cinemas! Exclusive to only registered users!
5. View our mission and contact information

## General analysis

a. Problem statement - Movie booking websites today are very manual, and dry. The difficult part of the booking process in most of the cases is deciding which movie to go to. FilmLore tries to explore in this avenue and aims in providing a potential solution to this. If expanded to countries like Singapore, this product could possibly be a game changer.

b. Solution architecture - We aimed the user experience to be simplistic yet modern, with a pinch of vintage style, which helps in capturing the user's emotions in the easiest and most accurate way. Figma was helpful in sketching our ideas, but we expanded our horizons more.

c. Legal/other aspects - We used a few open source ideas mainly for our UI (mentioned below). Currently the tokens and headers used for consuming APIs are individualistic, and need to be converted to project-level/enterprise-level which can open doors for more features from the APIs itself, but considering the monetary efforts which are not currently feasible, we chose to travel the non-commercial way. The main source code is original.

d. Competition analysis - There are a few market products available which includes BookMyShow, Popcorn.sg, Fandango, Regal - apart from the respective cinema websites. All of these solutions facilitate booking, but filmLore goes a step beyond and recommends best suited movies for the user to watch, and can be made available to any country on request. Certain aspects like payment and transactions are avoided in our product to make it more simple and do its job, but can be further explored in the future.

## UI features

- A homepage with realistic background job and a modern side navbar (Bootstrap)
- Dark and red themed web experience
- A futuristic spinner while loading pages
- Modernistic showtime boxes and date filter
- Used 'lottie-react' for animated logos on certain pages
- 3D About Us page experience

## Backend features

- 'concurrently' for running commands simultaneously
- 'axios' for making HTTP requests from GraphQL
- 'react-router' for navigating through multiple pages
- 'webpack' for efficient development experience (such as compile on save)

## Environment details

The following versions of technologies are required to be installed on the system to run the application:

- Nodejs: v20.x
- Mongod: v7.0.6 and Mongosh: v2.2.3

Rest of the dependencies are taken care of in package.json

## Third party APIs

We used some third party APIs to facilitate your experience, which includes:
- MovieGlu API: For movie and cinema information, consisting of different resources for each of list of current movies, upcoming movies, film details, cinema details, showtimes and ticket transaction websites
- Google Authentication API: For allowing users to log in to filmLore easily, using their Google accounts
- Robohash API: For generating unique alien personas for registered users
- OpenAI API: For the recommendation engine to suggest films based on given user inputs and preferences

## Other resources

Some of our code is referenced from a few open source projects, which includes:
- https://uiverse.io/mobinkakei/proud-ladybug-46: For the awesome spinner that we have
- https://polarnotion.github.io/starwarsintro/: For the more awesome Star Wars style 'About Us' page

Some code snippets were referenced from ChatGPT queries and StackOverflow for primarily solving minor bugs.  

## Further enhancements

There are a few more upgrades that we thought could make the product more marketable and valuable, but owing to time constraints and other course commitments, we have kept them for later:

- Check real time updates about what films are getting booked more at a particular period of time and suggest to users (trending movies around)
- Allow users to subscribe to films ongoing and upcoming, or cast and crew and notify them of real time news about these films (like trailer releases, cast and crew changes)
- Display reviews from social media platforms about the movie

## Project Setup Instructions

```sh
git clone https://github.com/drstrangelove2001/filmlore.git
git fetch
git checkout feature/<your name>
git pull (to ensure all latest changes are updated in local)
npm install (or npm install --force if you face any errors)
npm run init-db (if setting up application for the first time, or want to reset the DB)
npm run compile
npm run start
```
The app will run in http://localhost:3000/ if all things work well!

For GraphQL playground, go to http://localhost:4000/graphql/

## Copyright (C) 2024 - FilmLore
## Developers - Sariha Ganapthy, Sricharan Sriram, Wen Shu
## Advisor - Prasanna Karthik Vairam
## Part of module - IT5007
## University - NUS