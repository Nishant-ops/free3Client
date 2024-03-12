import React from "react";
import "./Landing.css";
import { FaSearch } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { useRef } from "react";
import { FaLinkedin } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import image1 from "../../assets/images/image1.png";
import mobile from "../../assets/images/mobile.jpg";
import digital from "../../assets/images/digital.jpg";
import content from "../../assets/images/content.jpg";
import video from "../../assets/images/video.jpg";
import web from "../../assets/images/web.jpg";
import design from "../../assets/images/design.jpg";
import image2 from "../../assets/images/image2.png";

import Header from "../../components/Header/Header";

function Landing() {
  return (
    <body className="landing-page__wrapper">
      <div className="hero">
        <Header></Header>
        <div className="text-hero" id="home">
          <h1>Welcome to Free3</h1>
          <p>First Decentralzied freelancer platform</p>
          <p>Find the best freelance services for your business</p>
          <div className="search-bar">
            <input type="text" placeholder="Search for any service..." />
            <FaSearch className="search-icon" />
          </div>
          <br></br>
          <br></br>
        </div>
        <div classe="svg-hero" style={{ height: "150px", overflow: "hidden" }}>
          <svg
            viewBox="0 0 500 150"
            preserveAspectRatio="none"
            style={{ height: "100%", width: "100%" }}
          >
            <path
              d="M0.00,49.98 C149.99,150.00 351.77,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"
              style={{ stroke: "none", fill: "#fff " }}
            ></path>
          </svg>
        </div>
      </div>

      <section className="wave-contenedor website" id="freelancers">
        <LazyLoadImage src={image1} alt="" />
        <div className="contenedor-textos-main">
          <h2 class="title left">For Freelancers</h2>
          <p class="parrafo">
            <FaStar class="etoile"></FaStar>
            <b style={{ color: "#2DB67C", fontSize: "20px" }}>
              {" "}
              Showcase benefits:
            </b>
            <br></br>
            <q>
              Boost your freelancing career with our website's unique
              advantages.
            </q>
            <br></br>
            <br></br>
            <FaStar class="etoile"></FaStar>
            <b style={{ color: "#2DB67C", fontSize: "20px" }}>
              {" "}
              Emphasize reliability:
            </b>
            <br></br>
            <q>
              Experience a hassle-free and trusted platform for freelancers like
              you.
            </q>
            <br></br>
            <br></br>
            <FaStar class="etoile"></FaStar>
            <b style={{ color: "#2DB67C", fontSize: "20px" }}>
              {" "}
              Highlight success stories:
            </b>
            <br></br>
            <q>
              Discover success through our website's proven track record and
              thriving freelancer community.
            </q>{" "}
          </p>
          <a href="/signup" id="quote" class="cta">
            Get Started
          </a>
        </div>
      </section>
      <section class="info-last" id="clients">
        <div class="contenedor last-section">
          <div class="contenedor-textos-main">
            <h2 class="title left">For Clients</h2>
            <p class="parrafo">
              <FaStar class="etoile"></FaStar>
              <b style={{ color: "#2DB67C", fontSize: "20px" }}>
                {" "}
                Showcase benefits:
              </b>
              <br></br>
              <q>
                Unlock your business potential with our website's exclusive
                features and growth opportunities.
              </q>
              <br></br>
              <br></br>
              <FaStar class="etoile"></FaStar>
              <b style={{ color: "#2DB67C", fontSize: "20px" }}>
                {" "}
                Emphasize reliability:
              </b>
              <br></br>
              <q>
                Trust in our platform's secure and seamless experience for
                businesses like yours.
              </q>
              <br></br>
              <br></br>
              <FaStar class="etoile"></FaStar>
              <b style={{ color: "#2DB67C", fontSize: "20px" }}>
                {" "}
                Highlight success stories:
              </b>
              <br></br>
              <q>
                Join a thriving community of satisfied clients who have achieved
                remarkable success through our website.
              </q>{" "}
            </p>
            <a href="/signup" class="cta">
              Get started
            </a>
          </div>
          <LazyLoadImage src={image2} alt="" />
        </div>
      </section>

      <section class="galery">
        <div class="contenedor">
          <h2 class="title">Categories</h2>
          <br></br>
          <br></br>
          <article class="galery-cont" id="categories">
            <LazyLoadImage src={mobile} alt="" />
            <LazyLoadImage src={digital} alt="" />
            <LazyLoadImage src={content} alt="" />
            <LazyLoadImage src={video} alt="" />
            <LazyLoadImage src={web} alt="" />
            <LazyLoadImage src={design} alt="" />
          </article>
        </div>
      </section>
      <div classe="svg-wave" style={{ height: "150px", overflow: "hidden" }}>
        <svg
          viewBox="0 0 500 150"
          preserveAspectRatio="none"
          style={{ height: "100%", width: "100%" }}
        >
          <path
            d="M0.00,49.98 C149.99,150.00 351.77,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"
            style={{ stroke: "none", fill: "#6575FB" }}
          ></path>
        </svg>
      </div>
      <footer id="contact">
        <div class="container-footer"></div>
        <h2 class="title">Contact us</h2>
        <div className="content-cards1">
          <article className="card1">
            <br></br>
            <h1>Free3</h1>
            <p>
              <a
                class="xx"
                href="https://www.linkedin.com/company/free3/?viewAsMember=true"
              >
                <FaLinkedin />
              </a>
            </p>
          </article>
        </div>
      </footer>
    </body>
  );
}

export default Landing;
