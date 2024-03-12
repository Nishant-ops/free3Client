import React from "react";
import { NavLink } from "react-router-dom";
import "./About.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import image1 from "../../assets/images/image1.png";
import image4 from "../../assets/images/image4.jpg";
import Header from "../../components/Header/Header";
import Accordian from "../../components/Accordian/Accordian";

function About() {
  return (
    <>
      <Header></Header>
      <div className="about_us__wrapper">
        <div className="about_us__text_wrapper">
          <div className="about_us__section">
            <h2 className="about_us_text__heading">About Us</h2>
            <p className="about_us__text">
              Our company addresses challenges in the freelance market by
              streamlining payment processes and enhancing transparency. With a
              focus on mitigating financial risks for both freelancers and
              clients, we aim to create a more efficient and sustainable
              freelance ecosystem, offering significant social impact and
              financial returns.
            </p>
          </div>
          <LazyLoadImage src={image1} alt="" />
        </div>
        <div className="why_free3_text__wrapper">
          <LazyLoadImage src={image4} alt="" />
          <div className="why_free3__section">
            <h2 className="why_free3_text__heading">Why Free3?</h2>
            <ul>
              <li>
                Get Paid in Crypto(USDT,DAI,USDC) as well as direct bank
                transfer
              </li>
              <li>Less platform fee 10% for freelancer and 0% for Client</li>
              <li>Mandtory escrow</li>
              <li>
                Set the conditions of how you'll work together, including
                deadlines and payment terms, using the Contract module. We
                protect your financial engagement through digital escrow by
                locking all funds once the contract is signed - releasing them
                automatically once the work has been completed and accepted.
              </li>
              <li>
                While most of the Decentralzied platform charge gas fee from
                there user to use there website we charge no gas fees.
              </li>
            </ul>
          </div>
        </div>
        <Accordian></Accordian>
      </div>
    </>
  );
}

export default About;
