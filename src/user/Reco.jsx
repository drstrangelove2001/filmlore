/* 
This is the React component responsible for content in the user preference page.
*/

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import graphQLFetch from '../../graphql/graphQLFetch.js';
import { Context } from '../Context.jsx';


function Reco() {
    const navigate = useNavigate();

    const { userProfile, setUserProfile } = useContext(Context);

    const navigateToHome = () => {
        navigate('/', { replace: true });	// navigate back to home
    };

    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedDirectors, setSelectedDirectors] = useState([]);
    const [selectedActors, setSelectedActors] = useState([]);
    const [selectedMovies, setSelectedMovies] = useState([]);

    const addUserPrefToFilmlore = async () => {
        const query = `mutation Mutation($userPref: UserPrefDetails) {
			addUserPref(userPref: $userPref)
		  }`;
        await graphQLFetch(query, { userPref: { email: userProfile.email, genresLoved: selectedGenres, directorsLoved: selectedDirectors, actorsLoved: selectedActors, moviesLoved: selectedMovies } })
            .then(navigateToHome());
    };

    const handleSelectChange = (event, setFunction) => {
        const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
        if (selectedOptions.length > 2) {
            event.target.value = Array.from(event.target.selectedOptions, option => option.defaultSelected ? option.value : null).filter(Boolean);
        }
        setFunction(selectedOptions);
    };

    return (
        <div className="mt-5">
            <p className="page-title text-center filmlore-font">recommendation engine</p>
            <p className="mt-3 fs-5 fw-lighter text-center filmlore-font">please fill out your preferences below to tune our recommendations for you!</p>
            <form>
                <div className="reco-container row">
                    <div className="col-3">
                        <label htmlFor="genres" className="filmlore-font form-label">genres that you love</label>
                        <select id="genres" className="form-select" required multiple onChange={(e) => handleSelectChange(e, setSelectedGenres)}>
                            <option value="Drama">Drama</option>
                            <option value="Romance">Romance</option>
                            <option value="Thriller">Thriller</option>
                            <option value="Horror">Horror</option>
                        </select>
                    </div>
                    <div className="col-3">
                        <label htmlFor="directors" className="filmlore-font form-label">directors that you love</label>
                        <select id="directors" className="form-select" required multiple onChange={(e) => handleSelectChange(e, setSelectedDirectors)}>
                            <option value="Christopher Nolan">Christopher Nolan</option>
                            <option value="Spike Lee">Spike Lee</option>
                            <option value="Wong Kar-wai">Wong Kar-wai</option>
                            <option value="Steven Spielberg">Steven Spielberg</option>
                        </select>
                    </div>
                    <div className="col-3">
                        <label htmlFor="actors" className="filmlore-font form-label">actors that you love</label>
                        <select id="actors" className="form-select" required multiple onChange={(e) => handleSelectChange(e, setSelectedActors)}>
                            <option value="Leonardo di Caprio">Leonardo di Caprio</option>
                            <option value="Emma Stone">Emma Stone</option>
                            <option value="Christian Bale">Christian Bale</option>
                            <option value="Park So-dam">Park So-dam</option>
                        </select>
                    </div>
                    <div className="col-3">
                        <label htmlFor="movies" className="filmlore-font form-label">movies that you love</label>
                        <select id="movies" className="form-select" required multiple onChange={(e) => handleSelectChange(e, setSelectedMovies)}>
                            <option value="Oppenheimer">Oppenheimer</option>
                            <option value="Malcolm X">Malcolm X</option>
                            <option value="Dune">Dune</option>
                            <option value="In The Mood For Love">In The Mood For Love</option>
                        </select>
                    </div>
                    <div className="d-grid gap-2 col-3 reco-submit mx-auto">
                        <button onClick={addUserPrefToFilmlore} href="#" type="submit" className="btn btn-danger btn-lg register-btn filmlore-font">submit</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Reco;
