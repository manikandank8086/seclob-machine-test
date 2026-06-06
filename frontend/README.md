# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Product Management App (MERN Stack)

A full-stack product management web application built using **React, Node.js, Express, and MongoDB**.  
It includes product listing, category/subcategory filtering, wishlist feature, pagination, and product management features.

---

## Features

### Authentication

- Login & Register pages
- JWT-based authentication (token stored in client)

### Product Management

- Add Product
- Edit Product
- View Product Details

### Category System

- Add Category
- Add Subcategory
- Filter products by category & subcategory

### Wishlist

- Add/Remove wishlist products
- Wishlist counter in navbar
- Wishlist drawer view

### Search & Filter

- Search products by title
- Filter by category/subcategory

### Pagination

- Displays limited products per page (6 per page)
- Navigation through pages

---

## 🧑 Tech Stack

### Frontend

- React.js
- Tailwind CSS
- React Router DOM
- Axios
- React Icons
- React Toastify

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

---


## 📱 Responsiveness Note

This application is primarily optimized for **desktop (laptop) view**.  
Some UI sections may not be fully responsive on smaller screens (mobile devices).

For the best experience, please use the application on a laptop or desktop screen.

## Installation

### 1. Clone repo

```bash
git clone https://github.com/manikandank8086/seclob-machine-test.git


## Backend .env
PORT=5000
MONGO_URI=mongodb://localhost:27017/seclob
JWT_SECRET=your_secret_key
## Note: JWT_SECRET is required for authentication token generation. Without it, backend will fail to sign tokens.

## Backend

 cd backend
npm install
npm run dev ,npmn start

## Frontend
cd frontend
npm install
npm run dev


