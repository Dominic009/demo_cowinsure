import React from "react";

import SwiperComponent from "../Helper/SwiperComponent";
import HomeInsuranceSection from "./HomeInsuranceSection";
import FaqSection from "./FaqSection";
import ContactUs from "@/components/Helper/ContactUs";
import FeedbackSlider from "./FeedbackSlider";
import GallerySection from "./GallerySection";
import HomeVedioBanner from "./HomeVedioBanner";
import AboutUsSection from "./AboutUsSection";
import CardsSection from "./CardsSection";
import WhyInvestWithUs from "./WhyInvestWithUsSection";
import AwardRecognitionSection from "../Helper/AwardRecognitionSection";
import PartnerAndInvestorSection from "../Helper/PartnerAndInvestorSection";
import InvestmentSection from "../Helper/InvestmentSection";
import SubscriptionPlans from "../SubscriptionPlans";

const Home = () => {
  return (
    <div className=" lg:h-auto w-auto h-auto overflow-hidden">

      <div className="h-screen">
        <SwiperComponent />
      </div>

      <section className=" mb-10 mx-auto flex flex:row items-center justify-center">
        <AboutUsSection />
      </section>


      <div className="h-auto lg:h-auto lg:pt-10 md:h-auto pb-10">
        <CardsSection />
      </div>

      <SubscriptionPlans />

      <HomeVedioBanner />

      <HomeInsuranceSection />
      
      <InvestmentSection />

      <div className="my-20">
        <WhyInvestWithUs />
      </div>

      <AwardRecognitionSection />

      <PartnerAndInvestorSection />

      <div className="bg-[#F6F4EC]">
        <FeedbackSlider />
      </div>

      <GallerySection />

      <div className="bg-white">
        <FaqSection />
      </div>

      <div className="py- bg-[#F6F4EC] ">
        <ContactUs />
      </div>
    </div>
  );
};

export default Home;
