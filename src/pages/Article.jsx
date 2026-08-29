import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { articles } from '../data/articles.js';
import '../styles/site.css';

export default function Article() {
  const { slug } = useParams();
  const article = articles.find(a => a.slug === slug);

  if (!article) {
    return (
      <div className="public-site">
        <nav id="nav">
          <Link to="/" className="nav-logo">Style<span>.</span>NG</Link>
        </nav>
        <section style={{ paddingTop: '9rem', textAlign: 'center' }}>
          <div className="container">
            <h2 className="section-title">Article not found</h2>
            <p className="section-sub"><Link to="/learn">← Back to Learn</Link></p>
          </div>
        </section>
      </div>
    );
  }

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

      <section style={{ paddingTop: '9rem', paddingBottom: '2rem' }}>
        <div className="container" style={{ maxWidth: '760px' }}>
          <Link to="/learn" style={{ fontSize: '.8rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--gold)', textDecoration: 'none' }}>← Back to Learn</Link>
          <div className="learn-cat" style={{ marginTop: '2rem' }}>{article.category} · {article.readTime}</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 500, lineHeight: 1.1, margin: '.6rem 0 1.6rem' }}>{article.title}</h1>
          <img src={article.image} alt={article.title} style={{ width: '100%', borderRadius: '4px', marginBottom: '2.2rem' }} />
          <div style={{ fontSize: '1.02rem', lineHeight: 1.75, color: 'var(--warm-gray)' }}>
            {article.body.map((block, i) =>
              block.type === 'h' ? (
                <h3 key={i} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontWeight: 600, color: 'var(--charcoal)', marginTop: '2.2rem', marginBottom: '.8rem' }}>{block.text}</h3>
              ) : (
                <p key={i} style={{ marginBottom: '1.2rem' }}>{block.text}</p>
              )
            )}
          </div>

          <div style={{ marginTop: '3rem', padding: '2rem', background: 'var(--charcoal)', color: 'var(--cream)', borderRadius: '4px', textAlign: 'center' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: '1.4rem', marginBottom: '.8rem' }}>
              {article.isMasterclass ? 'Ready to enrol?' : 'Prefer to leave it to the professionals?'}
            </h3>
            <p style={{ color: '#C9C2B4', marginBottom: '1.4rem', fontSize: '.92rem' }}>
              {article.isMasterclass
                ? 'Reach out on WhatsApp for the next available date and pricing.'
                : 'Book a Style NG stylist and get salon results without leaving home.'}
            </p>
            <a
              href={article.isMasterclass ? 'https://wa.me/2347066301079?text=' + encodeURIComponent("Hi Style NG! I'd like to enrol in the Advanced Extension Techniques masterclass.") : '/#book'}
              className="btn-primary"
              style={{ display: 'inline-block' }}
            >
              {article.isMasterclass ? 'WhatsApp to Enrol' : 'Book Now'}
            </a>
          </div>
        </div>
      </section>

      <footer style={{ padding: '3rem 4rem', textAlign: 'center', color: 'var(--mid-gray)', fontSize: '.85rem' }}>
        <Link to="/learn" style={{ color: 'var(--charcoal)' }}>← More from Learn</Link>
      </footer>
    </div>
  );
}
