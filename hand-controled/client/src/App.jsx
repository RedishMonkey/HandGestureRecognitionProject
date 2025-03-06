import React from 'react'
import './App.css';
import { Navbar } from './components/navbar';

// image imports
import exploreProducts from './assets/images/exploreProductsImage.jpg'
import OurMission from './assets/images/OurMissionImage.jpg'
import unlockYourExperience from './assets/images/unlockYourExperienceImage.jpg'




function App() {
  // setInterval(() => {console.log(window.innerWidth))},1000);

  return (
    <>
      <Navbar/>

      <div className="container">
        <ul className="px-3">
          <li className="mt-3 mb-1 noBullet">
            <h4>Welcome to Our Site</h4>
            Welcome to our site! We’re absolutely thrilled to have you here. At hand control, we specialize in creating cutting-edge devices and robots that can be controlled effortlessly by the movement of your hand.
          </li>
          <li className="mb-1 noBullet">
            <div className="row">
              <div className="card col-4">
                <img src={OurMission} alt="Our Mission" />
                <div className="card-body">
                  <h4 className="card-title">Our Mission</h4>
                  <p className="card-text">Our mission is to revolutionize your interaction with technology, making it intuitive and engaging.</p>
                </div>
              </div>
              <div className="card col-4">
                <img src={exploreProducts} alt="Explore Our Products" />
                <div className="card-body">
                  <h4 className="card-title">Explore Our Products</h4>
                  <p className="card-text">Explore our range of precision-crafted products designed to enhance your experience.</p>
                </div>
              </div>
              <div className="card col-4">
                <img src={unlockYourExperience} alt="Unlock Your Experience" />
                <div className="card-body">
                  <h4 className="card-title">Unlock Your Experience</h4>
                  <p className="card-text">Explore products crafted for seamless control and user satisfaction.</p>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}

export default App;
