/* 
This is the React component responsible for content in the user registration page.
*/

import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../Context.jsx';
import graphQLFetch from '../../graphql/graphQLFetch.js';

function Register() {
	const navigate = useNavigate();

	const { userProfile, setUserProfile } = useContext(Context);

	const navigateToReco = () => {
		navigate('/recommendation-engine', { replace: true });	// navigate to recommendation engine for user preferences
	};

	const addUserToFilmLore = async () => {
		const nickname = document.getElementById('name').value;
		const age = document.getElementById('age').value;
		const phone = document.getElementById('phone').value;
		const gender = document.getElementById('gender').value;
		const query = `mutation Mutation($user: UserDetails) {
			addUser(user: $user)
		  }`;
		await graphQLFetch(query, { user: { email: userProfile.email, name: userProfile.name, nickname: nickname, phone: parseInt(phone), age: parseInt(age), gender: gender } })
			.then(navigateToReco());
	};

	return (
		<div className="mt-5">
			<p className="page-title text-center filmlore-font">register with us</p>
			<div className="container registration">
				<form>
					<div className="mb-3">
						<label htmlFor="name" className="filmlore-font form-label">name</label>
						<input type="text" className="form-control" id="name" aria-describedby="nameHelp" required />
						<div id="nameHelp" className="form-text">How do we address you?</div>
					</div>
					<div className="mb-3">
						<label htmlFor="age" className="filmlore-font form-label">age</label>
						<input type="number" className="form-control" id="age" aria-describedby="ageHelp" required />
						<div id="ageHelp" className="form-text">How old are you?</div>
					</div>
					<div className="mb-3 row">
						<div className="col-md-4">
							<label htmlFor="gender" className="filmlore-font form-label">gender</label>
							<select className="form-select mb-3" id="gender" name="gender" required>
								<option value=""></option>
								<option value="Male">Male</option>
								<option value="Female">Female</option>
								<option value="Others">Others</option>
							</select>
							<div id="genderHelp" className="form-text">What is your orientation?</div>
						</div>
						<div className="col">
							<label htmlFor="phone" className="filmlore-font form-label">phone</label>
							<input type="tel" className="form-control" id="phone" aria-describedby="phoneHelp" required />
							<div id="phoneHelp" className="form-text">Where can we call you?</div>
						</div>
					</div>
					<div className="d-grid gap-2 mx-auto">
						<button onClick={addUserToFilmLore} type="submit" className="btn btn-danger btn-lg register-btn filmlore-font">move on to our recommendation engine!</button>
					</div>

				</form>
			</div>
		</div>);
}

export default Register;