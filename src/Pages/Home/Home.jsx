import React from 'react';
import Banner from './Banner/Banner';
import Newsletter from './Newsletter/Newsletter';
import HowItWorks from './HowItWorks/HowItWorks';
import Advertise from './Advertise/Advertise';
import LatestReviews from './LatestReviews/LatestReviews';

const Home = () => {
    return (
        <div className=''>
            <Banner></Banner>
            <Advertise></Advertise>
            <LatestReviews></LatestReviews>
            <Newsletter></Newsletter>
            <HowItWorks></HowItWorks>

        </div>
    );
};

export default Home;