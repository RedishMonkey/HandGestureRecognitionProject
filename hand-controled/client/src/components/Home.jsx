import React from "react";
import "../styles/home.css";
import { useState } from "react";
import { Card } from "./Card";


import ourMissionImage from "../assets/images/OurMissionImage.jpg";
import exploreProductsImage from "../assets/images/exploreProductsImage.jpg";
import unlockYourExperienceImage from "../assets/images/unlockYourExperienceImage.jpg";

export const Home = () => {

  const cards = [
    {
      title: "Our Mission",
      imageSrc: ourMissionImage,
      description:
        "Our mission is to revolutionize your interaction with technology, making it intuitive and engaging. Whether you need smart home solutions, educational robots, or innovative gadgets, you're in the right place.",
      altText: "Our Mission",
    },
    {
      title: "Explore Our Products",
      imageSrc: exploreProductsImage,
      description:
        "Explore our range of precision-crafted products designed to enhance your experience and simplify tasks with seamless control.",
      altText: "Explore Products",
    },
    {
      title: "Unlock Your Experience",
      imageSrc: unlockYourExperienceImage,
      description:
        "Explore our range of products designed to enhance your experience and simplify tasks, all crafted for seamless control and user satisfaction.",
      altText: "Unlock Experience",
    },
  ];
  

  return (
    <>
      <ul>
        <li className="content-item" id="welcome-to-our-site">
          <h3>Welcome to Our Site</h3>
          Welcome to our site! We're absolutely thrilled to have you here. At
          hand control, we specialize in creating cutting-edge devices and
          robots that can be controlled effortlessly by the movement of your
          hand.
        </li>
        <li className="content-item">
          <div className="cards-grid">
            {cards.map((card, index) => (
              <Card
                key={index}
                title={card.title}
                imageSrc={card.imageSrc}
                description={card.description}
                altText={card.altText}
              />
            ))}
          </div>
        </li>
        <li className="content-item">
          <h3>Your Journey Begins Now</h3>
          Feel free to explore our wide range of products designed to enhance
          your experience and make everyday tasks easier. Each device is crafted
          with precision, ensuring seamless control and user satisfaction.
        </li>
        <li className="content-item" id="enjoy-the-future-of-technology">
          <h3>Enjoy the Future of Technology</h3>
          Enjoy your time here, and we can't wait for you to experience the
          future of interactive technology!
        </li>
      </ul>
    </>
  );
};
