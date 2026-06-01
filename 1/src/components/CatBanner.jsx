import catImage from "../assets/cat-banner.jpg";

export default function CatBanner() {
  return (
    <div className="cat-banner">
      <img src={catImage} alt="Cat" />

      <div className="cat-banner-content">
        <h2>Дневник финансов 🐾</h2>
        <p>
          Следим за расходами вместе с кошкой-контролёром бюджета
        </p>
      </div>
    </div>
  );
}