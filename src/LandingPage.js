// LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (



    <div className='landing-page'>

      {/* Button to navigate to the existing App component */}
      <Link to="/app">
        <div className='appButton'>



          <button className='choma'>
            <span>FORMULA 1</span>
          </button>

          {/* <button class="button" data-text="Awesome">
              <span class="actual-text">&nbsp;FORMULA 1&nbsp;</span>
              <div class="hover-car"></div>
            </button> */}
        </div>

      </Link>
    </div>


  );
};

export default LandingPage;
