#  Retail Management System for Small Businesses

A full-stack POS and inventory management system built with **Django**, **Angular**, and **Docker**, designed for small-to-medium retail stores. It supports cashier workflows, real-time cart and receipts, batch-level inventory tracking, loyalty programs, discount codes, shift management, and sales analytics.

---

## Features

- Secure 4-digit user ID login (JWT auth)
- Barcode & non-barcode product handling
- Batch tracking with expiry dates and discounts
- Low-stock and expiry detection with CSV export
- Real-time cart with refund mode and keypad input
- PDF receipt generation with discount and loyalty display
- Automatic loyalty rewards 
- Customer-facing display screen
- Analytics dashboard (daily/weekly/monthly/top products)
- Admin interface for products, shifts, logs, and users
- Dockerized for fast deployment

---

## Getting Started

### Requirements

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

###  1. Navigate to the backend folder

```bash
cd backend
```
##  2. Build and start the containers
```bash
docker-compose up -d --build
```
This starts:

Django backend at http://localhost:8000

Angular frontend at http://localhost:4200

PostgreSQL database service

## 3. Create a superuser
```bash
docker-compose exec backend python manage.py createsuperuser
```
Then log in to the Django Admin:

http://localhost:8000/admin/

## Admin Dashboard
Create and manage products, batches, categories

Manage users (cashiers and managers)

View and download CSV reports (low stock, expiry)

Access analytics through the dummy "Analytics 📈" model

## Cashier POS
```bash
http://localhost:4200/
```
Scan barcoded products or select from image-based manual screen

Enter quantities or weights

Apply discount codes or loyalty phone numbers

Choose payment method: cash or card

Generate PDF receipts

## Customer Display Screen
http://localhost:4200/customer-view

Real-time display of scanned items and totals for customers


## Tech Stack

| Layer       | Stack                                      |
|-------------|---------------------------------------------|
| Backend     | Django + DRF, PostgreSQL                   |
| Frontend    | Angular, Angular Material, Chart.js        |
| Auth        | JWT via SimpleJWT                          |
| PDFs        | ReportLab                                  |
| Deployment  | Docker + Docker Compose                    |

## Python Dependencies
Django

djangorestframework

djangorestframework-simplejwt

django-filter

Pillow

psycopg2-binary

django-cors-headers

reportlab

## Angular Libraries

@angular/material

@angular/common/http

@angular/forms

ng2-charts (Chart.js)

## Notes

Use 4-digit numeric User ID and Password (e.g., 9998 / 1234)

Discount codes are set by manager first and validated before use

Loyalty codes are issued after reaching the spending target and printed on receipts

Admin can soft-delete products and monitor batch expiry and low stock via visual flags

Every cashier shift is logged with revenue, refunds, and closing summary


## License
This project was developed as part of a Computer Science final-year project at UWE Bristol. Use permitted for academic or demonstration purposes.

## Acknowledgements
Special thanks to:

My brother-in-law for helping me understand Angular and guiding UI/UX feedback as a real developer

Managers and small business owners for providing insights into real-world POS expectations

University of the West of England for the opportunity

