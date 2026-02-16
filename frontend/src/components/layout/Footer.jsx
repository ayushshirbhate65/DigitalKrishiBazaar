import "../../styles/footer.css";

function Footer() {
  return (
    <footer className="footer" id="about-section">
  <div className="footer-container">

    {/* LEFT */}
    <div className="footer-section">
      <h3>Explore</h3>

      <ul className="footer-links">
        <li><a href="/">Home</a></li>
        <li><a href="/about">About Us</a></li>
        <li><a href="/services">Our Services</a></li>
        <li><a href="/products">Products</a></li>
        <li><a href="/contact">Contact</a></li>
        <li><a href="/faq">FAQ</a></li>
      </ul>
    </div>

    {/* MIDDLE */}
    <div className="footer-section">
      <h3>Contact</h3>
      <p>support@digitalkrishi.com</p>
      <p>+91 9XXXXXXXXX</p>

      <div className="social-icons">
  <a href="https://ayushshirbhate.site/" target="_blank" rel="noopener noreferrer">
    🌐
  </a>

  <a href="https://www.instagram.com/ayushshirbhate19" target="_blank" rel="noopener noreferrer">
    📸
  </a>

  <a href="https://www.linkedin.com/in/ayush-shirbhate-a2455429a/" target="_blank" rel="noopener noreferrer">
    in
  </a>

  <a href="https://twitter.com/yourprofile" target="_blank" rel="noopener noreferrer">
    ✖
  </a>
</div>
    </div>

    {/* RIGHT */}
    <div className="footer-section">
      <h3>Subscribe</h3>

      <div className="subscribe-box">
        <input
          type="email"
          placeholder="Your email"
          className="footer-input"
        />
        <button className="footer-btn">
          Subscribe
        </button>
      </div>
    </div>

  </div>

  <div className="footer-bottom">
    © 2026 Digital Krishi Bazaar. All rights reserved.
  </div>
</footer>
  );
}

export default Footer;
