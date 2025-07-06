import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Header.css";
import Logo from '../assets/logo-noBg.png';

function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleHamburgerClick = () => {
    setMenuOpen((prev) => !prev);
  };

  // Optional: close menu after clicking a link (especially on mobile)
  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <nav>
        <img src={Logo} alt="Logo" className="nav-logo" />
        <button
          className={`hamburger${menuOpen ? " active" : ""}`}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={handleHamburgerClick}
          type="button"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className={`nav-links${menuOpen ? " show" : ""}`}>
          <li><NavLink to="/" onClick={handleLinkClick}>Home</NavLink></li>
          <li><NavLink to="/dashboard" onClick={handleLinkClick}>Dashboard</NavLink></li>
          <li><NavLink to="/rooms" onClick={handleLinkClick}>Rooms</NavLink></li>
          <li><NavLink to="/calendar" onClick={handleLinkClick}>Calender</NavLink></li>
          <li><NavLink to="/profile" onClick={handleLinkClick}>Profile</NavLink></li>
          <li><NavLink to="/codeeditor" onClick={handleLinkClick}>Code Editor</NavLink></li>
          <li className="logout-btn">
            <NavLink to="#" onClick={() => { handleLogout(); handleLinkClick(); }}>Logout</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
