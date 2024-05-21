/* 
This is the React component responsible for content in the recommend me a movie page.
*/

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../Context.jsx';
import Lottie from "lottie-react";
import animationData from '../../public/assets/MovieCustomizerAnimation.json';
import graphQLFetch from '../../graphql/graphQLFetch.js';
import axios from 'axios';
import '../spinner.css';


function MovieRecommender() {

	const [isLoading, setLoading] = useState(false);
	const { userProfile, setUserProfile } = useContext(Context);
	const [formData, setFormData] = useState({
		genre: '',
		language: '',
		companion: ''
	});
	const [moviesSuggested, setMoviesSuggested] = useState(null);
	const [moviesShowing, setMoviesShowing] = useState(null);

	const navigate = useNavigate();

	const navigateToReco = () => {
		navigate('/recommendation-engine', { replace: true });	// navigate to recommendation engine for user preferences
	};

	const navigateToRegister = () => {
		navigate('/register', { replace: true });
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value
		});
	};

	const frameQueryForGPT = async (e) => {
		e.preventDefault();
		const query = `query GetUserPref($email: String!) {
			getUserPref(email: $email) {
			  email
			  genresLoved
			  directorsLoved
			  actorsLoved
			  moviesLoved
			}
		  }`;
		const resp = await graphQLFetch(query, { email: userProfile.email });
		if (resp.getUserPref == null || resp.getUserPref.length < 1) {
			const query = `query GetUser($email: String!) {
				getUser(email: $email) {
				  email
				  name
				  nickname
				  phone
				  age
				  gender
				}
			  }`;
			const userResp = await graphQLFetch(query, { email: userProfile.email });
			if (userResp.getUser == null || userResp.getUser.length < 1) {
				window.alert("Please register your user details and preferences to use this feature!");
				navigateToRegister();
			} else {
				window.alert("Please register your user preferences to use this feature!");
				navigateToReco();
			}

		} else {
			setLoading(true);
			makeQuery(resp.getUserPref);
		}
	}

	const makeQuery = async (userPref) => {
		const genre = formData.genre;
		const company = formData.companion;
		const language = formData.language;
		const directors = userPref.directorsLoved;
		const actors = userPref.actorsLoved;
		const movies = userPref.moviesLoved;
		const query = `query getFilmsNowShowing {
			getFilmsNowShowing {
			  film_id
			  film_name
			  images
			}
		  }`;
		const res = await graphQLFetch(query);
		setMoviesShowing(res.getFilmsNowShowing);
		const ongoingMovies = res.getFilmsNowShowing.map(item => item.film_name).join(", ");
		let basicQuery = `A user has the following preferences with respect to movies: they want to watch a movie ${company} of preferred genre ${genre}, preferably in the language ${language}, their favorite directors are ${directors}, their favorite actors are ${actors}, their favorite past movies are ${movies}. Using this information recommend the best movies out of ${ongoingMovies} for the user to watch, maximum of three movies. Answer in the format - "XYZ" where XYZ are the 3 suggested movies comma separated and not from the user's favorite past movies and add no other text in your answer.`;
		handleGPT(basicQuery);
	}

	const handleGPT = async (basicQuery) => {
		const openai = axios.create({
			baseURL: "https://api.openai.com/v1",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer <TOKEN>`,
			},
		});

		try {
			let response = await openai.post("/chat/completions", {
				model: "gpt-3.5-turbo",
				messages: [
					{ role: 'system', content: 'You are a helpful assistant.' },
					{ role: 'user', content: basicQuery },
				]
			});
			let rawmovies = response.data.choices[0].message.content.split(',')
			rawmovies = rawmovies.map(film => film.toLowerCase().replace(/\s/g, '').replace('"', ''));
			setMoviesSuggested(rawmovies);
			setLoading(false);
		} catch (error) {
			console.error("Error creating chat completion:", error);
		}
	};


	return (
		<div className="container text-center mt-5">

			{isLoading ? (<div className="spinner-container">
				<div className="loader">
					<svg viewBox="0 0 80 80">
						<circle id="test" cx="40" cy="40" r="32"></circle>
					</svg>
				</div>

				<div className="loader triangle">
					<svg viewBox="0 0 86 80">
						<polygon points="43 8 79 72 7 72"></polygon>
					</svg>
				</div>

				<div className="loader">
					<svg viewBox="0 0 80 80">
						<rect x="8" y="8" width="64" height="64"></rect>
					</svg>
				</div>
				<p className="loading">Fasten your belts, locking in the perfect adventure for you...</p>
			</div>) : (<div>
				<p className='page-title text-center filmlore-font'>get ready for a cinematic adventure</p>
				<div className='container text-center'>

					<strong className='reco-title filmlore-font'> tailored just for you.</strong>
				</div>
				<Lottie animationData={animationData} style={{ width: "200px", height: "200px", marginLeft: "550px", alignSelf: 'flex-start' }} />
				{userProfile ? (<form onSubmit={frameQueryForGPT}>
					<div className="d-flex flex-column align-items-center">
						<div className="container">
							<div className="mb-3 row">
								<div className="col">
									<label htmlFor="genre" className="filmlore-font form-label">select genre</label>
									<select className="form-select mb-3" id="genre" name="genre" value={formData.genre} onChange={handleChange} required>
										<option value="">Genre</option>
										<option value="action">Action</option>
										<option value="anime">Anime</option>
										<option value="comedy">Comedy</option>
										<option value="horror">Horror</option>
										<option value="romance">Romance</option>
										<option value="science fiction">Science Fiction</option>
										<option value="thriller">Thriller</option>
										<option value="drama">Drama</option>
									</select>
								</div>
								<div className="col">
									<label htmlFor="language" className="filmlore-font form-label">select language</label>
									<select className="form-select mb-3" id="language" name="language" value={formData.language} onChange={handleChange} required>
										<option value="">Language</option>
										<option value="chinese">Chinese</option>
										<option value="english">English</option>
										<option value="korean">Korean</option>
										<option value="tamil">Tamil</option>
									</select>
								</div>
								<div className="col">
									<label htmlFor="companion" className="filmlore-font form-label">select companionship</label>
									<select className="form-select mb-3" id="companion" name="companion" value={formData.companion} onChange={handleChange} required>
										<option value="">Companion</option>
										<option value="with friends">Friends</option>
										<option value="with family">Family</option>
										<option value="with kids">Kids</option>
										<option value="with lover">Lover</option>
										<option value="alone">Alone</option>
									</select>
								</div>
							</div>

						</div>
						<div className="col-md-12 my-3">
							<button type="submit" className="btn btn-lg register-btn filmlore-font mx-auto" style={{ backgroundColor: '#c569b1', color: 'white' }}>recommend me movies</button>
						</div>
					</div>
				</form>) : (<p className="filmlore-font my-4">Sorry, this feature is restricted to registered users only.</p>)}

				{moviesSuggested ? (<div className="container my-4">
					<div className="movie-results"></div>
					<p className="filmlore-font">Based on your user profile and inputs, here is our curated list of movies you can right away go watch!</p>
					<div className="row">
						{moviesShowing.filter(film => moviesSuggested.includes(film.film_name.toLowerCase().replace(/\s/g, '').replace('"', ''))).map((film) => {
							return (
								<div key={film.film_name} className="card" style={{ width: "200px" } /* src link to the movie details */}>
									<a href={`/movie-details/${film.film_id}`}>
										{film.images.poster['1'] ? (<img src={film.images.poster['1']['medium']['film_image']} className="card-img-top" alt={film.film_name} style={{ width: "200px", height: "300px", }} />) : (<img src='/assets/emptyposter.jpg' className="card-img-top" alt={film.film_name} style={{ width: "200px", height: "300px", }} />)}
									</a>
									<div style={{ textAlign: 'left', 'marginTop': '10px', }}>
										<h5 className="card-title">{film.film_name}</h5>
									</div>
								</div>
							)
						})}
					</div>
				</div>) : (<div></div>)}
			</div>)}
			<p className="openai-footer">Powered by OpenAI.</p>

		</div>

	);
}
export default MovieRecommender;

