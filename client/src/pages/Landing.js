import React from 'react'
import main from '../assets/images/main.svg';
import Wrapper from '../assets/wrappers/LandingPage';
import { Link } from 'react-router-dom';
import { Logo } from '../components';

const Landing = () => {
  return (
    <Wrapper>
        <nav>
            <Logo />
        </nav>
        <div className="container page">
            <div className='info'>
                <h1>
                    task <span>tracking</span> app
                </h1>
                <p>
                Welcome to our task tracking app! Keeping track of all your daily tasks can be overwhelming, 
                but our app makes it easy to manage everything in one place. With our simple and intuitive interface, 
                you can create tasks, set due dates, and assign status to stay organized and focused.
                Sign up now and start organizing your tasks like a pro!
                </p>
                <Link to="/register" className='btn btn-hero'>
                    Login/Register
                </Link>
            </div>
            <img src={main} alt="task track" className='img main-img' />
        </div>
    </Wrapper>
  )
}

export default Landing