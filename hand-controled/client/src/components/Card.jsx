import React from 'react'
import '../styles/Card.css'


export const Card = ({ title, imageSrc, description, altText }) => {
  return (
    <div className="card customCard">
      <img
        src={imageSrc}
        className="card-img-top p-0 m-0 customCardImg"
        alt={altText}
      />
      <div className="card-body">
        <h4 className="card-title customCardHeader">{title}</h4>
        <p className="card-text customCardTxt">{description}</p>
      </div>
    </div>
  )
}