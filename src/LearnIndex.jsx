import React from 'react';
import { Link } from 'react-router-dom';
import { articles } from '../data/articles.js';
import '../styles/site.css';

export default function LearnIndex() {
  return (
    <div className="public-site">
      <nav id="nav">
        <Link to="/" className="nav-logo">Style<span>.</span>NG</Link>
        <div className="nav-links" id="navLinks">
          <Link to="/">Home</Link>
          <Link to="/#services">Services</Link>
          <Link to="/#stylists">Stylists</Link>
          <Link to="/learn">Learn</Link>
          <Link to="/#book" className="nav-cta">Book Now</Link>
        </div>
      </nav>

      <section style={{ paddingTop: '9rem' }}>
        <div className="container">
          <div className="section-label">Education</div>
          <h2 className="section-title">Learn &amp; Grow with Style NG</h2>
          <p className="section-sub">Expert tips, tutorials, and masterclasses to elevate your hair care knowledge and achieve salon results at home.</p>
          <div className="learn-grid">
            {articles.map(a => (
              <Link to={`/learn/${a.slug}`} className="learn-card reveal" key={a.slug} style={{ textDecoration: 'none', display: 'block' }}>
                <img src={a.image} alt={a.title} className="learn-img" />
                <div className="learn-body">
                  <div className="learn-cat">{a.category}</div>
                  <h3>{a.title}</h3>
                  <p>{a.excerpt}</p>
                  <span className="learn-link">{a.cta.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ padding: '3rem 4rem', textAlign: 'center', color: 'var(--mid-gray)', fontSize: '.85rem' }}>
        <Link to="/" style={{ color: 'var(--charcoal)' }}>Back to Style NG</Link>
      </footer>
    </div>
  );
}
