import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import bannerImg1 from "../../../assets/banner1.jpg";
import bannerImg2 from "../../../assets/banner2.jpg";
import bannerImg3 from "../../../assets/banner3.jpg";
const Banner = () => {
  return (
    <Carousel autoPlay={true} infiniteLoop={true} showThumbs={false}  >
      <div>
        <img src={bannerImg1} className="h-[400px] w-full object-cover object-center md:h-[600px] lg:h-[500px]"/>
      </div>
      <div>
        <img src={bannerImg2} className="h-[400px] w-full object-cover object-center md:h-[600px] lg:h-[500px]"/>
      </div>
      <div>
        <img src={bannerImg3} className="h-[400px] w-full object-cover object-center md:h-[600px] lg:h-[500px]"/>
      </div>
    </Carousel>
  );
};

export default Banner;
