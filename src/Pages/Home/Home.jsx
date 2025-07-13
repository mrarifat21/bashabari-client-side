import React from 'react';
import Banner from './Banner/Banner';
import Newsletter from './Newsletter/Newsletter';
import HowItWorks from './HowItWorks/HowItWorks';

const Home = () => {
    return (
        <div className=''>
            <Banner></Banner>
            <Newsletter></Newsletter>
            <HowItWorks></HowItWorks>

        </div>
    );
};

export default Home;