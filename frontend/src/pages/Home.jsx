
import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "../styles/home.css";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the login page if the user is not authenticated
    const jwtoken = localStorage.getItem("jwtoken");
    if (!jwtoken) {
      navigate("/login");
    }
  }, [navigate]);

  // Helper function to handle navigation
  const handleFeatureClick = (route) => {
    navigate(route);
  };

  return (
    <div className="home-page">
      <main className="main">
        <section className="hero">
          <h1>Discover Zcoder</h1>
          <p>Elevate your coding journey with Zcoder: Solve challenges, connect with peers, stay updated on contests, and leverage AI-powered insights.</p>
          <button className="cta-btn" onClick={() => navigate("/dashboard")}>
            Explore Dashboard
          </button>
        </section>

        <section className="features">
          <div
            className="feature-card"
            onClick={() => handleFeatureClick("/profile")}
          >
            <h3>Your Profile</h3>
            <p>Personalize your account, monitor your achievements, and tailor your Zcoder journey.</p>
          </div>

          <div
            className="feature-card"
            onClick={() => handleFeatureClick("/rooms")}
          >
            <h3>Collaboration Hub</h3>
            <p>Engage with fellow coders, share ideas, and collaborate in real-time.</p>
          </div>

          <div
            className="feature-card"
            onClick={() => handleFeatureClick("/calendar")}
          >
            <h3>Contest Schedule</h3>
            <p>Stay ahead with our comprehensive coding contest calendar.</p>
          </div>

          <div
            className="feature-card"
            onClick={() => handleFeatureClick("/dashboard")}
          >
            <h3>Coding Challenges</h3>
            <p>Sharpen your skills with diverse coding problems.</p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© 2025 Zcoder. Empowering coders worldwide.</p>
      </footer>
    </div>
  );
}

export default Home;
