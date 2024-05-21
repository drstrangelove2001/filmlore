/* 
This is the React component responsible for content in the search movie around page.
*/

import React, { Component } from 'react';
import '../styles.css';
import graphQLFetch from '../../graphql/graphQLFetch.js';
import '../spinner.css';

export default class SearchMovies extends Component {
	constructor() {
		super();
		this.state = {
			nowshowingMovies: [],
			moviesName: [],
			isLoading: [true]
		};
	}

	async fetchData() {
		const query = `query getFilmsNowShowing {
			getFilmsNowShowing {
				film_id
				imdb_id
				imdb_title_id
				film_name
				release_dates {
				  release_date
				  notes
				}
				age_rating {
				  rating
				  age_rating_image
				  age_advisory
				}
				trailers
				synopsis_long
				images
			  }
			}`;
		const data = await graphQLFetch(query);
		this.setState({ nowshowingMovies: data.getFilmsNowShowing });
		const moviesName = this.getFilmsNams(data);
		this.setState({ moviesName: moviesName, isLoading: false });
	}

	getFilmsNams(data) {
		if (!data || !data.getFilmsNowShowing) {
			return [];
		}
		const filmNames = data.getFilmsNowShowing.map(movie => movie.film_name);
		return filmNames;
	}

	componentDidMount() {
		this.fetchData();
	}

	render() {
		const { nowshowingMovies, isLoading } = this.state;
		const options = { day: 'numeric', month: 'long', year: 'numeric' };
		return (
			<div>
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
					<p className="loading">compiling the best movies from several galaxies...</p>
				</div>) : (<div> <p className="text-center recoresult-title">movies running</p><div className="container" >
					<hr style={{ borderTop: '1px solid white', margin: '20px 0' }} />
					<div className="row row-cols-5 row-cols-auto"  >
						{nowshowingMovies.map((movie) => {
							const releaseDate = new Date(movie.release_dates[0].release_date).toLocaleDateString('en-US', options).toUpperCase();
							return (
								<div key={movie.film_id} style={{ display: 'flex', 'justifyContent': 'center', 'marginBottom': '40px' }}>
									<div className="card" style={{ width: "200px" } /* src link to the movie details */}>
										<a href={`/movie-details/${movie.film_id}`}>
											{movie.images.poster["1"] && (
												<img key={movie.film_id} src={movie.images.poster["1"]["medium"].film_image} className="card-img-top" alt={movie.film_name} style={{ width: "200px", height: "300px", }} />
											) || (
													<img key={movie.film_id} src="https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg" className="card-img-top" alt={movie.film_name} style={{ width: "200px", height: "300px", }} />
												)}
										</a>
										<div style={{ textAlign: 'left', 'marginTop': '10px', }}>
											<h5 className="card-title">{movie.film_name}</h5>
											<p className="card-text" style={{ "textAlign": "right", "marginBottom": "0px", "color": "#B8B8B8" }}>{releaseDate}</p>
										</div>
									</div>
								</div>
							)
						})}
					</div>
				</div>
				</div>)}

			</div>);
	}
}