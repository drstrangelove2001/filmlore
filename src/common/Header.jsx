/* 
This is the React component responsible for content inside the side navbar, and contains methods to log in, log out, and navigate to other pages.
*/

import { Link } from 'react-router-dom';
import '../styles.css';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import React, { useContext } from 'react';
import { Context } from '../Context.jsx';
import { googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';


function Header() {
    const initialUserProperties = {
        access_token: '',
        expires_in: 0,
        id_token: '',
        scope: '',
        token_type: '',
    };
    const { userProfile, setUserProfile } = useContext(Context);

    const [emailUser, setEmailUser] = React.useState(initialUserProperties);

    const navigate = useNavigate();

    const navigateToRegister = () => {
        navigate('/register', { replace: true });
    };

    const navigateToHome = () => {
        navigate('/', { replace: true });
    };

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setEmailUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    React.useEffect(() => {
        if (!!emailUser.access_token) {
            axios
                .get(
                    `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${emailUser.access_token}`,
                    {
                        headers: {
                            Authorization: `Bearer ${emailUser.access_token}`,
                            Accept: 'application/json',
                        },
                    }
                )
                .then(async (res) => {
                    setUserProfile(res.data);
                    sessionStorage.setItem('userProfile', JSON.stringify(res.data));
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
                    const resp = await graphQLFetch(query, { email: res.data.email });
                    if (resp.getUser == null || resp.getUser.length < 1) {
                        navigateToRegister();
                    }
                })
                .catch((err) => console.log('err: ', err));
        }
    }, [emailUser]);

    const logOut = () => {
        googleLogout();
        setUserProfile(null);
        sessionStorage.removeItem('userProfile');
        navigateToHome();
    };


    return (
        <header data-bs-theme="dark">
            <div className="navbar navbar-dark bg-dark shadow-sm">
                <div className="container">
                    <a href="/" className="navbar-brand d-flex align-items-center">
                        <img className="logo" src="/assets/Logo.png" alt="FilmLore" />
                        <strong className="filmlore-font">filmLore.</strong>
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                        {userProfile && userProfile.name ? (
                            <img src={`https://robohash.org/${userProfile.name}?set=set2`} alt="Robohash" style={{ width: '50px', height: '50px' }} />) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-person-bounding-box" viewBox="0 0 16 16">
                                <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5M.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5" />
                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                            </svg>)}
                    </button>
                    <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                        <div className="offcanvas-header">
                            <img className="logo" src="/assets/Logo.png" alt="FilmLore" />
                            <h5 className="offcanvas-title filmlore-font fw-bolder" id="offcanvasNavbarLabel">filmLore.</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            <p className="filmlore-font fw-bolder">Welcome, {userProfile ? (userProfile.name) : ('Guest')}.</p>
                            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                                {userProfile == null ? (<li data-bs-dismiss="offcanvas" className="nav-item">
                                    <a role="button" className="nav-link filmlore-font" onClick={login} >login</a>
                                </li>) : (<div></div>)}
                                <li data-bs-dismiss="offcanvas" className="nav-item">
                                    <Link className="nav-link filmlore-font" to="/movies-around">movies around</Link>
                                </li>
                                <li data-bs-dismiss="offcanvas" className="nav-item">
                                    <Link className="nav-link filmlore-font" to="/upcoming-movies">upcoming movies</Link>
                                </li>
                                {userProfile ? (<li data-bs-dismiss="offcanvas" className="nav-item">
                                    <Link className="nav-link filmlore-font" to="/movie-recommender">recommend me a movie</Link>
                                </li>) : (<div></div>)}
                                <li data-bs-dismiss="offcanvas" className="nav-item">
                                    <Link className="nav-link filmlore-font" to="/about">about us</Link>
                                </li>
                                <li data-bs-dismiss="offcanvas" className="nav-item">
                                    <Link className="nav-link filmlore-font" to="/contactUs">contact</Link>
                                </li>
                                {userProfile ? (<li data-bs-dismiss="offcanvas" className="nav-item">
                                    <a role="button" className="nav-link filmlore-font" onClick={logOut} >logout</a>
                                </li>) : (<div></div>)}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;