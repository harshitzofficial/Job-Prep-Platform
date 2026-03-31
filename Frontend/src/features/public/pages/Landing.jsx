import React from "react";
import { useNavigate } from "react-router";
import "../style/landing.scss";
const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <nav className="navbar glass-panel">
        <div className="logo">
          <span className="text-gradient">HirePrep AI</span>
        </div>
        <div className="nav-actions">
          <button
            className="button secondary-button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="button primary-button"
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <div className="badge-pill glass-panel">
            <span className="pulse-dot"></span> New: Advanced Behavioral AI
            Analysis
          </div>
          <h1 className="hero-title">
            Don't just practice.
            <br />
            <span className="text-gradient">Dominate your interview.</span>
          </h1>
          <p className="hero-subtitle">
            Transform your resume into a complete job strategy—get personalized
            interview questions, skill insights, a preparation roadmap, and
            curated job opportunities tailored to your profile.
          </p>
          <div className="hero-cta">
            <button
              className="button primary-button large-cta"
              onClick={() => navigate("/register")}
            >
              Start Your Strategy For Free
            </button>
            <p className="cta-subtext">
              No credit card required. Generate your first plan immediately.
            </p>
          </div>
        </div>
      </header>

      {/* Social Proof */}
      <section className="social-proof">
        <p>Trusted by candidates who landed offers at top tech companies</p>
        <div className="company-logos">
          <span>Google</span>
          <span>Meta</span>
          <span>Amazon</span>
          <span>Netflix</span>
          <span>Apple</span>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <h2 className="section-title">The ultimate preparation toolkit.</h2>
        <div className="features-grid">
          {/* NEW FEATURE: AI Job Matcher */}
          <div className="feature-card glass-panel">
            <div className="feature-icon">🚀</div>
            <h3>AI Job Matcher</h3>
            <p>
              Our AI analyzes your unique profile and cross-references it with
              live job boards to find high-probability matches in your preferred
              location.
            </p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon">🔍</div>
            <h3>Deep Resume Analysis</h3>
            <p>
              We read your experience and logically map your career history
              directly to the job requirements, finding your strong suits
              automatically.
            </p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon">🎯</div>
            <h3>Targeted Strategy</h3>
            <p>
              Get custom-tailored technical and behavioral answers generated
              specific to your background and the company's culture.
            </p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon">⚡</div>
            <h3>Instant Roadmaps</h3>
            <p>
              Generate comprehensive day-by-day preparation plans in under 30
              seconds using state-of-the-art LLMs.
            </p>
          </div>
          <div className="feature-card glass-panel">
            <div className="feature-icon">🎙️</div>
            <h3>Live Voice Interviews</h3>
            <p>
              Experience real-time, voice-enabled mock interviews. Direct the AI's focus and practice your delivery with instant conversational feedback.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works glass-panel-container">
        <h2 className="section-title">How it works</h2>
        <div className="steps-container">
          <div className="step-item">
            <div className="step-number">1</div>
            <h3>Upload Profile</h3>
            <p>
              Drop in your resume (PDF/DOCX) or quickly describe your
              background.
            </p>
          </div>
          <div className="step-item">
            <div className="step-number">2</div>
            <h3>Paste Job Details</h3>
            <p>
              Provide the exact job listing and requirements you are aiming for.
            </p>
          </div>
          <div className="step-item">
            <div className="step-number">3</div>
            <h3>Get Action Plan</h3>
            <p>
              Receive custom answers, skill gap analysis, and a strict study
              roadmap.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <h2 className="section-title">Ready to ace your next round?</h2>
        <p>
          Join thousands of successful candidates who supercharged their
          interview prep.
        </p>
        <button
          className="button primary-button large-cta"
          onClick={() => navigate("/register")}
        >
          Create Free Account
        </button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          {/* Brand */}
          <div className="footer-brand">
            <h2 className="text-gradient logo-small">HirePrep AI</h2>
            <p>
              AI-powered resume analysis, interview prep, and job discovery.
            </p>
          </div>

          {/* Contact / Links */}
          <div className="footer-links">
            <a
              href="https://harshit-singh-profile.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Portfolio
            </a>

            <a href="mailto:harshit.official.281005@gmail.com">Email</a>

            <a
              href="https://github.com/harshitzofficial"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>

            <a
              href="https://www.linkedin.com/in/harshit-singh-7a209a282/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} HirePrep AI • Built by Harshit Singh
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
