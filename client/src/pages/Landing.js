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
                    Tousled small batch microdosing bespoke health goth craft beer ramps keffiyeh activated charcoal vape cronut. Etsy vibecession DSA, 
                    pork belly poutine hell of quinoa bicycle rights polaroid plaid palo santo art party gochujang selvage fingerstache. Iceland truffaut 
                    tumeric cronut sustainable tonx, PBR&B JOMO shabby chic marfa. Grailed williamsburg XOXO mumblecore pok pok vinyl.
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