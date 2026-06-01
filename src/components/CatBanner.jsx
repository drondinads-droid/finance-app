import React from 'react'
import catImage from '../assets/cat-banner.jpg'

export default function CatBanner() {
  return (
    <section className="cat-banner card fade-in">
      <img className="cat-banner-img" src={catImage} alt="Моя кошка на деньгах" />
      <div className="cat-banner-content">
        <div className="label">Финансовый дневник</div>
        <h2>Дневник финансов 🐾</h2>
        <p>Следим за расходами вместе с кошкой-контролёром бюджета.</p>
      </div>
    </section>
  )
}
