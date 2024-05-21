/* 
This is the React component responsible for content in the movie details page.
*/

import React, { Component } from 'react';
import graphQLFetch from '../../graphql/graphQLFetch.js';

import {
	useLocation,
	useNavigate,
	useParams,
} from "react-router-dom";

function withRouter(Component) {
	function ComponentWithRouterProp(props) {
		let location = useLocation();
		let navigate = useNavigate();
		let params = useParams();
		return (
			<Component
				{...props}
				router={{ location, navigate, params }}
			/>
		);
	}

	return ComponentWithRouterProp;
}


export class MovieDetail extends Component {
	// props here is the film ID.
	constructor(props) {
		super(props);
		this.state = {
			filmDetails: {},
			selectedDate: '',
			timeslots: [],
		};
	}

	componentDidMount() {
		let movieId = parseInt(this.props.router.params.movieId, 10);
		this.fetchFilmDetails(movieId);
	}

	async fetchFilmDetails(filmId) {
		const query = `query GetFilmDetails($filmId: Int!) {
			getFilmDetails(filmId: $filmId) {
				film_id
				imdb_id
				film_name
				images
				synopsis_long
				distributor
				release_dates {
					release_date
					notes
				}
				duration_mins
				genres {
					genre_id
					genre_name
				}
				cast {
					cast_id
					cast_name
				}
				directors {
					director_id
					director_name
				}
				producers {
					producer_id
					producer_name
				}
				writers {
					writer_id
					writer_name
				}
				show_dates {
					date
				}
				trailers
			}
		}`;
		const data = await graphQLFetch(query, { filmId });
		if (data) {
			this.setState({ filmDetails: data.getFilmDetails });
		}
	}

	async fetchFilmShowTimes(filmId, date) {
		const query = `query GetFilmShowTimes($filmId: Int!, $date: String!) {
			getFilmShowTimes(filmId: $filmId, date: $date) {
				cinemas {
				  cinema_id
				  cinema_name
				  distance
				  showings {
					Standard {
					  film_id
					  film_name
					  times {
						start_time
						end_time
					  }
					}
				  }
				}
			  }
		  }`;
		const data = await graphQLFetch(query, { filmId, date });
		if (data && data.getFilmShowTimes.cinemas && data.getFilmShowTimes.cinemas.length > 0) {
			this.setState({ timeslots: data.getFilmShowTimes.cinemas });
		}

	}

	async fetchPurchaseConfirmation(cinemaId, time) {
		const filmId = this.state.filmDetails.film_id;
		const date = this.state.selectedDate;
		const query = `query GetPurchaseConfirmation($filmId: Int!, $cinemaId: Int!, $date: String!, $time: String!) {
			getPurchaseConfirmation(filmId: $filmId, cinemaId: $cinemaId, date: $date, time: $time) {
			  film_id
			  film_name
			  date
			  time
			  cinema_id
			  cinema_name
			  url
			}
		  }`;
		try {
			const data = await graphQLFetch(query, { filmId, cinemaId, date, time });
			if (data && data.getPurchaseConfirmation) {
				const url = data.getPurchaseConfirmation.url;
				this.setState({
					purchaseConfirmations: {
						[cinemaId]: url
					}
				});
				return url;
			}
		} catch (error) {
			console.error('Error fetching purchase confirmation:', error);
		}

	}


	handleShowtimeClick(cinemaId, time) {
		this.fetchPurchaseConfirmation(cinemaId, time)
			.then(url => {
				if (url) {
					window.open(url);
				} else {
					console.error('No URL found for:', cinemaId);
				}
			})
			.catch(error => {
				console.error('Error handling showtime click:', error);
			});
	}

	handleFilter = () => {
		const selectedDate = document.getElementById("dateSelect").value;
		this.setState({ selectedDate: selectedDate });
		this.fetchFilmShowTimes(this.state.filmDetails.film_id, selectedDate);
	}


	render() {
		const filmDetails = this.state.filmDetails;
		if (Object.keys(filmDetails).length === 0) {
			return <div className="spinner-container">
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
				<p className="loading">'project'ing movie information...</p>
			</div>;
		}
		const filmImage = filmDetails.images ? filmDetails.images.poster["1"]["medium"].film_image : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";
		const filmtrailer = filmDetails.trailers ? filmDetails.trailers.high[0].film_trailer : "https://www.youtube.com/watch?v=6ZfuNTqbHE8";
		const currentDate = new Date();
		const showdates = filmDetails.show_dates.map(date => date.date).filter(date => new Date(date) >= currentDate);
		return (
			<div className="movie">
				<div className="movie-detail">
					<div style={{ paddingTop: '40px' }}>
						<img src={filmImage} alt={filmDetails.film_name} className="movie-image" />
						<a href={filmtrailer} style={{ marginLeft: "50px", color: "white" }}>watch trailer</a>
					</div>
					<div className="movie-info">
						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
							<h2>{filmDetails.film_name}</h2>
							<div style={{ display: 'flex', whiteSpace: 'nowrap' }}>
								<span style={{ color: 'grey', fontSize: '15px' }}>{`${filmDetails.release_dates[0].release_date}/`}</span>
								<span style={{ color: 'grey', fontSize: '15px' }}>{`${Math.floor(filmDetails.duration_mins / 60)} hr ${filmDetails.duration_mins % 60} min`}</span>
							</div>
						</div>
						<div className="genres-container">
							{filmDetails.genres.map((genreObject) => (genreObject.genre_name.split('/').map((genre, index) => (<span key={index} className="genres">{genre.trim()}</span>))))}</div>
						<p><b><span style={{ color: '#27d8fb' }}>CAST</span></b></p>
						<p>{filmDetails.cast.map(member => member.cast_name).join(', ')}</p>
						<p><b><span style={{ color: '#27d8fb' }}>DIRECTOR</span></b></p>
						<p>{filmDetails.directors.map(director => director.director_name).join(', ')}</p>
						<p><b><span style={{ color: '#27d8fb' }}>SYNOPSIS</span></b></p>
						<p>{filmDetails.synopsis_long}</p>
					</div>
				</div>
				<div style={{ "marginBottom": '20px', "marginLeft": '20px' }}>
					<label htmlFor="dateSelect" className='select-label'>select show date:</label>
					<select id="dateSelect" className="select-box">
						{showdates.length > 0 ? (
							showdates.map(date => (
								<option key={date} value={date}>{date}</option>
							))
						) : (
							<option value="no-available">Shows not available at the moment!</option>
						)}
					</select>
					<button onClick={this.handleFilter} className="apply-button" disabled={showdates.length === 0}>apply</button>
				</div>

				{this.state.timeslots.length === 0 && (
					<div></div>
				) || (
						<div style={{ marginLeft: '20px' }}>
							<h5><span style={{ color: 'white' }}>SHOWTIMES & CINEMAS</span></h5>
							<div className="showtimes_cinemas">
								{this.state.timeslots.map(cinema => (
									<div className='showtimes-container' key={cinema.cinema_id}>
										<div className='timeslots-container' key={cinema.cinema_id}>
											{cinema.showings.Standard.times.slice(0, 9).map(slot => (
												<div className='showtime' >
													<button onClick={() => this.handleShowtimeClick(cinema.cinema_id, slot.start_time)} style={{ fontSize: '1.1em', backgroundColor: '#147dc3', color: 'white', border: 'none', 'whiteSpace': 'nowrap' }}>
														{`${slot.start_time}-${slot.end_time}`}
													</button>
													{/* {`${slot.start_time}-${slot.end_time}`} */}
												</div>
											))}
										</div>
										<div className='cinema-info'>
											<div className="cinema-name" >{cinema.cinema_name}</div>
											<div className="cinema-distance">{`${cinema.distance.toFixed(2)} km`}</div>
										</div>
									</div>
								),)}

							</div>
						</div>)}
			</div>
		);



	}
}

export default withRouter(MovieDetail);