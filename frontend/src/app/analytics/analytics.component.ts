import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
  analyticsData: any;
  viewMode: 'daily' | 'weekly' | 'monthly' | 'top' = 'daily';
  isDarkMode: boolean = false;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadDarkModePreference(); 
    this.http.get('http://localhost:8000/api/sales/analytics/').subscribe({
      next: (data) => {
        this.analyticsData = data;
        this.setupCharts();
      },
      error: (error) => {
        console.error('Failed to fetch analytics data', error);
      }
    });
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.applyDarkMode();
    localStorage.setItem('dark_mode', this.isDarkMode ? 'true' : 'false');
    this.cdr.detectChanges();
  }

  loadDarkModePreference() {
    const saved = localStorage.getItem('dark_mode');
    if (saved === 'true') {
      this.isDarkMode = true;
      this.applyDarkMode();
    }
  }

  applyDarkMode() {
    const body = document.body;
    if (this.isDarkMode) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  }

  showView(mode: 'daily' | 'weekly' | 'monthly' | 'top') {
    this.viewMode = mode;
  }

  dailyChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  weeklyChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  monthlyChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };

  dailyChartOptions: ChartConfiguration<'bar'>['options'] = {};
  weeklyChartOptions: ChartConfiguration<'bar'>['options'] = {};
  monthlyChartOptions: ChartConfiguration<'bar'>['options'] = {};

  setupCharts() {
    // Daily
    this.dailyChartData = {
      labels: ['Today'],
      datasets: [
        {
          label: 'Sales',
          data: [this.analyticsData.daily.total_sales],
          backgroundColor: 'rgba(30, 144, 255, 0.8)',
          borderRadius: 6,
          barThickness: 40,
        },
        {
          label: 'Profit',
          data: [this.analyticsData.daily.total_profit],
          backgroundColor: 'rgba(50, 205, 50, 0.8)',
          borderRadius: 6,
          barThickness: 40,
        }
      ]
    };
    this.dailyChartOptions = {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: `Daily Summary (${this.analyticsData.daily.label})` }
      },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true }
      },
      elements: {
        bar: {
        borderWidth: 0,    // ✅
        borderRadius: 8,   
        borderSkipped: false // ✅
      }
      }
    };

    // Weekly
    const weekLabels = this.analyticsData.weekly.breakdown.map((d: any) => d.label);
    const weekSales = this.analyticsData.weekly.breakdown.map((d: any) => d.total);
    const weekProfit = this.analyticsData.weekly.breakdown.map((d: any) => d.profit);

    this.weeklyChartData = {
      labels: weekLabels,
      datasets: [
        {
          label: 'Sales',
          data: weekSales,
          backgroundColor: 'rgba(30, 144, 255, 0.7)',
          barThickness: 30,
          borderRadius: 6,
        },
        {
          label: 'Profit',
          data: weekProfit,
          backgroundColor: 'rgba(144, 238, 144, 0.7)',
          barThickness: 30,
          borderRadius: 6,
        }
      ]
    };
    this.weeklyChartOptions = { 
      ...this.dailyChartOptions, 
      plugins: { 
        ...this.dailyChartOptions.plugins, 
        title: { display: true, text: `Weekly Summary (${this.analyticsData.weekly.label})` }
      }
    };

    // Monthly
    const monthLabels = this.analyticsData.monthly.breakdown.map((d: any) => d.label);
    const monthSales = this.analyticsData.monthly.breakdown.map((d: any) => d.total);
    const monthProfit = this.analyticsData.monthly.breakdown.map((d: any) => d.profit);

    this.monthlyChartData = {
      labels: monthLabels,
      datasets: [
        {
          label: 'Sales',
          data: monthSales,
          backgroundColor: 'rgba(255, 165, 0, 0.7)',
          barThickness: 30,
          borderRadius: 6,
        },
        {
          label: 'Profit',
          data: monthProfit,
          backgroundColor: 'rgba(138, 43, 226, 0.7)',
          barThickness: 30,
          borderRadius: 6,
        }
      ]
    };
    this.monthlyChartOptions = { 
      ...this.dailyChartOptions, 
      plugins: { 
        ...this.dailyChartOptions.plugins, 
        title: { display: true, text: `Monthly Summary (${this.analyticsData.monthly.label})` }
      }
    };
  }
}
