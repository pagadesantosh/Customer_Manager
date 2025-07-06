import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="about-page">
      <div class="page-content">
        <div class="hero-section">
          <div class="hero-icon">ℹ️</div>
          <h1>About Customer Manager</h1>
          <p class="hero-description">
            A comprehensive customer relationship management system built with modern web technologies.
          </p>
        </div>
        
        <div class="info-grid">
          <div class="info-card">
            <div class="info-icon">🚀</div>
            <h3>Version 1.0.0</h3>
            <p>Latest stable release with all core features implemented.</p>
          </div>
          
          <div class="info-card">
            <div class="info-icon">⚡</div>
            <h3>Built with Angular</h3>
            <p>Modern TypeScript framework for scalable web applications.</p>
          </div>
          
          <div class="info-card">
            <div class="info-icon">🎨</div>
            <h3>Responsive Design</h3>
            <p>Optimized for desktop, tablet, and mobile devices.</p>
          </div>
          
          <div class="info-card">
            <div class="info-icon">🔒</div>
            <h3>Secure & Reliable</h3>
            <p>Built with security best practices and data protection.</p>
          </div>
        </div>
        
        <div class="tech-stack">
          <h2>Technology Stack</h2>
          <div class="tech-grid">
            <div class="tech-item">
              <span class="tech-name">Angular 17+</span>
              <span class="tech-description">Frontend Framework</span>
            </div>
            <div class="tech-item">
              <span class="tech-name">TypeScript</span>
              <span class="tech-description">Programming Language</span>
            </div>
            <div class="tech-item">
              <span class="tech-name">NgRx</span>
              <span class="tech-description">State Management</span>
            </div>
            <div class="tech-item">
              <span class="tech-name">RxJS</span>
              <span class="tech-description">Reactive Programming</span>
            </div>
            <div class="tech-item">
              <span class="tech-name">CSS3</span>
              <span class="tech-description">Styling & Animations</span>
            </div>
            <div class="tech-item">
              <span class="tech-name">JSON Server</span>
              <span class="tech-description">Mock API Backend</span>
            </div>
          </div>
        </div>
        
        <div class="features-section">
          <h2>Key Features</h2>
          <div class="features-list">
            <div class="feature-item">
              <span class="feature-icon">👥</span>
              <div class="feature-content">
                <h4>Customer Management</h4>
                <p>Comprehensive customer data management with search and filtering capabilities.</p>
              </div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">📊</span>
              <div class="feature-content">
                <h4>Data Visualization</h4>
                <p>Interactive charts and graphs to visualize customer data and trends.</p>
              </div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🔍</span>
              <div class="feature-content">
                <h4>Advanced Search</h4>
                <p>Powerful search and filtering options to find specific customers quickly.</p>
              </div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">📱</span>
              <div class="feature-content">
                <h4>Mobile Responsive</h4>
                <p>Fully responsive design that works seamlessly across all devices.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .about-page {
      min-height: calc(100vh - 120px);
      padding: 40px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .page-content {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .hero-section {
      text-align: center;
      margin-bottom: 60px;
      background: white;
      padding: 60px 40px;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }
    
    .hero-icon {
      font-size: 80px;
      margin-bottom: 20px;
    }
    
    .hero-section h1 {
      font-size: 3rem;
      color: #2c3e50;
      margin-bottom: 20px;
      font-weight: 700;
    }
    
    .hero-description {
      font-size: 1.2rem;
      color: #6c757d;
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
      margin-bottom: 60px;
    }
    
    .info-card {
      background: white;
      padding: 40px 30px;
      border-radius: 15px;
      text-align: center;
      box-shadow: 0 10px 25px rgba(255, 255, 255, 0.1);
      transition: all 0.3s ease;
    }
    
    .info-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(255, 255, 255, 0.2);
    }
    
    .info-icon {
      font-size: 50px;
      margin-bottom: 20px;
    }
    
    .info-card h3 {
      font-size: 1.3rem;
      color: #2c3e50;
      margin-bottom: 15px;
      font-weight: 600;
    }
    
    .info-card p {
      color: #6c757d;
      line-height: 1.5;
    }
    
    .tech-stack, .features-section {
      background: white;
      padding: 50px;
      border-radius: 20px;
      margin-bottom: 40px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
    
    .tech-stack h2, .features-section h2 {
      text-align: center;
      font-size: 2.5rem;
      color: #2c3e50;
      margin-bottom: 40px;
      font-weight: 700;
    }
    
    .tech-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }
    
    .tech-item {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 25px 20px;
      border-radius: 12px;
      text-align: center;
      transition: all 0.3s ease;
    }
    
    .tech-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
    }
    
    .tech-name {
      display: block;
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .tech-description {
      font-size: 0.9rem;
      opacity: 0.9;
    }
    
    .features-list {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }
    
    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 20px;
      padding: 25px;
      background: #f8f9fa;
      border-radius: 15px;
      transition: all 0.3s ease;
    }
    
    .feature-item:hover {
      background: #e9ecef;
      transform: translateX(10px);
    }
    
    .feature-icon {
      font-size: 40px;
      min-width: 60px;
    }
    
    .feature-content h4 {
      font-size: 1.2rem;
      color: #2c3e50;
      margin-bottom: 10px;
      font-weight: 600;
    }
    
    .feature-content p {
      color: #6c757d;
      line-height: 1.5;
      margin: 0;
    }
    
    @media (max-width: 768px) {
      .about-page {
        padding: 20px 10px;
      }
      
      .hero-section {
        padding: 40px 20px;
      }
      
      .hero-section h1 {
        font-size: 2rem;
      }
      
      .hero-description {
        font-size: 1rem;
      }
      
      .info-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      
      .tech-stack, .features-section {
        padding: 30px 20px;
      }
      
      .tech-stack h2, .features-section h2 {
        font-size: 2rem;
      }
      
      .tech-grid {
        grid-template-columns: 1fr;
      }
      
      .feature-item {
        flex-direction: column;
        text-align: center;
      }
      
      .feature-item:hover {
        transform: translateY(-5px);
      }
    }
  `]
})
export class AboutPageComponent {
  constructor() {}
}
