import Header from './common/Header.jsx';
import Homepage from './Homepage.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import Register from './user/Register.jsx';
import Reco from './user/Reco.jsx';
import SearchMovies from './movies/SearchMovies.jsx';
import MovieRecommender from './recommendation/MovieRecommender.jsx';
import MovieDetail from './movies/MovieDetail.jsx';
import UpcomingMovies from './movies/UpcomingMovies.jsx';
import About from './info/About.jsx';
import ContactUs from './info/ContactUs.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ContextProvider } from './Context.jsx';


class FilmLore extends Component {
	constructor() {
		super();
	}

	render() {
		return (
			<Router>
				<Header />
				<Routes>
					<Route path="/" exact Component={Homepage} />
					<Route path="/register" Component={Register} />
					<Route path="/movies-around" Component={SearchMovies} />
					<Route path="/recommendation-engine" Component={Reco} />
					<Route path="/movie-recommender" Component={MovieRecommender}/>
					<Route path="/movie-details/:movieId" Component={MovieDetail}/>
					<Route path="/movie-details" Component={MovieDetail}/>
					<Route path="/upcoming-movies" Component={UpcomingMovies}/> 
					<Route path="/about" Component={About}/>
					<Route path="/contactUs" Component={ContactUs}/>
				</Routes>
			</Router>
		)
	}
}

const root = ReactDOM.createRoot(document.getElementById("contents"));
root.render(<GoogleOAuthProvider clientId="<GOOGLE_CLIENT_ID>">
<React.StrictMode>
<ContextProvider>
	<FilmLore />
</ContextProvider>
</React.StrictMode>
</GoogleOAuthProvider>);