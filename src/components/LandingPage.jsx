import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              The Super Calendar That
              <span className="gradient-text"> Actually Works</span>
            </h1>
            <p className="hero-subtitle">
              Organize your life with intelligent task management, recurring events, 
              and seamless synchronization across all your devices.
            </p>
            <div className="hero-buttons">
              <Link to="/app" className="cta-button primary">
                Try It Free
              </Link>
              <Link to="/app" className="cta-button secondary">
                View Demo
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">100%</span>
                <span className="stat-label">Free</span>
              </div>
              <div className="stat">
                <span className="stat-number">∞</span>
                <span className="stat-label">Tasks</span>
              </div>
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Sync</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="calendar-preview">
              <div className="calendar-header">
                <div className="calendar-nav">
                  <button className="nav-btn">‹</button>
                  <span>December 2024</span>
                  <button className="nav-btn">›</button>
                </div>
                <div className="view-toggle">
                  <button className="view-btn active">Week</button>
                  <button className="view-btn">Month</button>
                  <button className="view-btn">Day</button>
                </div>
              </div>
              <div className="calendar-grid">
                <div className="day-header">Mon</div>
                <div className="day-header">Tue</div>
                <div className="day-header">Wed</div>
                <div className="day-header">Thu</div>
                <div className="day-header">Fri</div>
                <div className="day-header">Sat</div>
                <div className="day-header">Sun</div>
                
                <div className="time-slot">
                  <span className="time-label">9:00</span>
                  <div className="task-item meeting">
                    <span className="task-title">Team Meeting</span>
                    <span className="task-time">9:00 AM</span>
                  </div>
                </div>
                <div className="time-slot">
                  <span className="time-label">10:00</span>
                  <div className="task-item work">
                    <span className="task-title">Project Review</span>
                    <span className="task-time">10:00 AM</span>
                  </div>
                </div>
                <div className="time-slot">
                  <span className="time-label">11:00</span>
                  <div className="task-item personal">
                    <span className="task-title">Gym Session</span>
                    <span className="task-time">11:00 AM</span>
                  </div>
                </div>
                <div className="time-slot">
                  <span className="time-label">12:00</span>
                  <div className="task-item completed">
                    <span className="task-title">Lunch Break</span>
                    <span className="task-time">12:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Our Calendar?</h2>
            <p>Built for modern productivity with features that actually matter</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Smart Recurring Tasks</h3>
              <p>Set up daily, weekly, monthly, or yearly recurring tasks with intelligent instance management. Update one, some, or all instances with ease.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Subtasks & Progress</h3>
              <p>Break down complex tasks into manageable subtasks. Auto-complete parent tasks when all subtasks are done. Track progress visually.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🌙</div>
              <h3>Dark Mode & Customization</h3>
              <p>Beautiful dark mode and extensive customization options. Adjust time slots, task sizes, and focus modes to match your workflow.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">☁️</div>
              <h3>Cloud Sync & Multi-Device</h3>
              <p>Your data syncs instantly across all devices. Access your calendar anywhere, anytime with real-time updates.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Smart Search & Filtering</h3>
              <p>Find tasks instantly with powerful search and category filtering. Never lose track of important tasks again.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Responsive Design</h3>
              <p>Works perfectly on desktop, tablet, and mobile. Your calendar adapts to any screen size for optimal productivity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Get started in minutes with our intuitive interface</p>
          </div>
          
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Sign Up & Sync</h3>
                <p>Create your account with email or Google. Your existing data migrates automatically from your browser.</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Create & Organize</h3>
                <p>Add tasks, set up recurring events, and break them into subtasks. Organize with colors and categories.</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Stay Productive</h3>
                <p>Track progress, complete tasks, and let the system auto-complete parent tasks when subtasks are done.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="comparison">
        <div className="container">
          <div className="section-header">
            <h2>Why We're Different</h2>
            <p>See how we compare to other calendar apps</p>
          </div>
          
          <div className="comparison-table">
            <div className="comparison-header">
              <div className="feature-column">Features</div>
              <div className="our-app">Our Calendar</div>
              <div className="other-apps">Other Apps</div>
            </div>
            
            <div className="comparison-row">
              <div className="feature-name">Recurring Task Management</div>
              <div className="our-app">✅ Advanced (Update some/all instances)</div>
              <div className="other-apps">❌ Basic (All or nothing)</div>
            </div>
            
            <div className="comparison-row">
              <div className="feature-name">Subtasks with Auto-completion</div>
              <div className="our-app">✅ Yes</div>
              <div className="other-apps">❌ Limited or None</div>
            </div>
            
            <div className="comparison-row">
              <div className="feature-name">Real-time Cloud Sync</div>
              <div className="our-app">✅ Instant</div>
              <div className="other-apps">⚠️ Often delayed</div>
            </div>
            
            <div className="comparison-row">
              <div className="feature-name">Customizable Interface</div>
              <div className="our-app">✅ Extensive options</div>
              <div className="other-apps">⚠️ Limited</div>
            </div>
            
            <div className="comparison-row">
              <div className="feature-name">Free Forever</div>
              <div className="our-app">✅ 100% Free</div>
              <div className="other-apps">❌ Premium required</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Productivity?</h2>
            <p>Join thousands of users who have already upgraded their task management</p>
            <div className="cta-buttons">
              <Link to="/app" className="cta-button primary large">
                Start Free Today
              </Link>
              <Link to="/app" className="cta-button secondary large">
                See It In Action
              </Link>
            </div>
            <div className="cta-note">
              <span>✨ No credit card required • ✨ Setup in 30 seconds • ✨ Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Product</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#demo">Demo</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><a href="#help">Help Center</a></li>
                <li><a href="#contact">Contact Us</a></li>
                <li><a href="#status">Status</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#blog">Blog</a></li>
                <li><a href="#careers">Careers</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Connect</h4>
              <ul>
                <li><a href="#twitter">Twitter</a></li>
                <li><a href="#linkedin">LinkedIn</a></li>
                <li><a href="#github">GitHub</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 Super Calendar. All rights reserved.</p>
            <div className="footer-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}