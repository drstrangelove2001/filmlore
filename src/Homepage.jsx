/* 
This React component is responsible for rendering the home page of the application.
*/

import React, { useContext } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { Context } from './Context.jsx';
import { useNavigate } from 'react-router-dom';
import graphQLFetch from '../graphql/graphQLFetch.js';

function Homepage() {
    const initialUserProperties = {
        access_token: '',
        expires_in: 0,
        id_token: '',
        scope: '',
        token_type: '',
    };

    const navigate = useNavigate();

    const navigateToRegister = () => {
        navigate('/register', { replace: true });
    };

    const [emailUser, setEmailUser] = React.useState(
        initialUserProperties
    );
    const { userProfile, setUserProfile } = useContext(Context);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setEmailUser(codeResponse),
        onError: (error) => console.error('Login Failed:', error)
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
                .catch((err) => console.error('err: ', err));
        }
    }, [emailUser]);

    return (
        <div className="home">
            <div className='container text-center title-caption'>
                <strong className='filmlore-font'>the movie goer experience</strong>
                <br />
                <strong className='filmlore-font'>you never knew you wanted.</strong>
            </div>
            {userProfile ? (<div className='container text-center title-caption-detail'>
                <p className='filmlore-font'>hello there, general!</p>
                <p className='filmlore-font'>start exploring our personalized cinema suggestions around you!</p>
            </div>) : (<div className='container text-center title-caption-detail'>
                <p className='filmlore-font'>sign up with your preferences and</p>
                <p className='filmlore-font'>subscribe to our personalized cinema suggestions around you.</p>
            </div>)}

            {userProfile ? (<div></div>) : (<div className='container register'>
                <div className="d-grid gap-2 col-3 mx-auto">
                    <a onClick={() => login()} className="btn btn-danger btn-lg register-btn filmlore-font" role="button">login with Google</a>
                </div>
            </div>)}

        </div>);
}

export default Homepage;