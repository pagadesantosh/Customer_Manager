import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="orders-page">
      <div class="page-content">
        <div class="hero-section">
          <div class="hero-icon">📦</div>
          <h1>Orders Management</h1>
          <p class="hero-description">
            Manage and track customer orders, view order history, and process new orders.
          </p>
        </div>
        
        <div class="feature-grid">
          <div class="feature-card">
            <div class="feature-icon">📋</div>
            <h3>Order List</h3>
            <p>View all orders with status tracking and filtering options.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🔍</div>
            <h3>Order Search</h3>
            <p>Search orders by customer, product, date range, or order status.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Analytics</h3>
            <p>View order statistics, trends, and performance metrics.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3>Quick Actions</h3>
            <p>Process orders, update status, and manage fulfillment.</p>
          </div>
        </div>
        
        <div class="coming-soon">
          <h2>🚧 Coming Soon</h2>
          <p>The Orders management system is currently under development.</p>
          <div class="progress-bar">
            <div class="progress-fill" style="width: 25%"></div>
          </div>
          <span class="progress-text">25% Complete</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .orders-page {
      min-height: calc(100vh - 120px);
      padding: 40px 20px;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
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
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
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
    
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
      margin-bottom: 60px;
    }
    
    .feature-card {
      background: white;
      padding: 40px 30px;
      border-radius: 15px;
      text-align: center;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
    }
    
    .feature-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
    }
    
    .feature-icon {
      font-size: 50px;
      margin-bottom: 20px;
    }
    
    .feature-card h3 {
      font-size: 1.3rem;
      color: #2c3e50;
      margin-bottom: 15px;
      font-weight: 600;
    }
    
    .feature-card p {
      color: #6c757d;
      line-height: 1.5;
    }
    
    .coming-soon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 50px;
      border-radius: 20px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
    }
    
    .coming-soon h2 {
      font-size: 2.5rem;
      margin-bottom: 20px;
      font-weight: 700;
    }
    
    .coming-soon p {
      font-size: 1.2rem;
      margin-bottom: 30px;
      opacity: 0.9;
    }
    
    .progress-bar {
      background: rgba(255, 255, 255, 0.2);
      height: 10px;
      border-radius: 5px;
      overflow: hidden;
      margin-bottom: 15px;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .progress-fill {
      background: #4CAF50;
      height: 100%;
      border-radius: 5px;
      transition: width 0.3s ease;
    }
    
    .progress-text {
      font-size: 0.9rem;
      opacity: 0.8;
    }
    
    @media (max-width: 768px) {
      .orders-page {
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
      
      .feature-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      
      .coming-soon {
        padding: 30px 20px;
      }
      
      .coming-soon h2 {
        font-size: 2rem;
      }
    }
  `]
})
export class OrdersPageComponent {
  constructor() {}
}
