# 🌸 Telle Mère, Telle Fille

<p align="center">

A modern cross-platform mobile application for browsing, customizing, and ordering event decorations.

Built with **React Native**, **Expo**, and **Firebase**.

</p>

<p align="center">

![React Native](https://img.shields.io/badge/React%20Native-0.7x-blue?logo=react)
![Expo](https://img.shields.io/badge/Expo-SDK-black?logo=expo)
![Firebase](https://img.shields.io/badge/Firebase-Backend-orange?logo=firebase)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow?logo=javascript)
![License](https://img.shields.io/badge/License-Educational-green)

</p>

# ✨ Overview

**Telle Mère, Telle Fille** is a full-featured mobile e-commerce application that allows customers to browse decorative products, personalize event decorations, manage their shopping cart, and complete orders through an intuitive mobile experience.

The application demonstrates modern mobile development practices using React Native, Firebase, Context API, and Expo while following a modular and scalable architecture.

---

# 🚀 Features

## Authentication

- Secure user registration
- User login
- Firebase Authentication
- Persistent user sessions

## Product Catalog

- Browse decoration collections
- Product details
- Occasion-based organization
- Image gallery

## Shopping Cart

- Add products
- Remove products
- Update quantities
- Dynamic price calculation

## Favorites

- Save favorite products
- Remove favorites
- Persistent wishlist

## Event Customization

Customers can personalize orders by choosing:

- Event type
- Theme
- Table decoration
- Quantity
- Budget
- Additional inspiration notes

## Checkout

- Order summary
- Purchase confirmation
- User information validation

---

# 🛠 Tech Stack

| Category | Technology |
|------------|----------------|
| Mobile Framework | React Native |
| Platform | Expo |
| Language | JavaScript (ES6) |
| Backend | Firebase |
| Authentication | Firebase Authentication |
| Database | Firebase Firestore |
| State Management | React Context API |
| Navigation | React Navigation |
| Maps | React Native Maps |
| Camera | Expo Camera |
| Image Picker | Expo Image Picker |
| Notifications | Expo Notifications |

---

# 🏛 Architecture

```
src
│
├── assets
├── components
├── context
├── navigation
├── screens
├── services
├── utils
└── constants
```

The project follows a modular architecture where UI components, business logic, navigation, and shared state are separated to improve maintainability and scalability.

---

# 📂 Project Structure

```
.
├── src
│   ├── assets
│   ├── components
│   ├── constants
│   ├── context
│   ├── navigation
│   ├── screens
│   ├── services
│   └── utils
│
├── docs
├── App.js
├── package.json
└── README.md
```

---

# 🔥 Firebase

Firebase provides:

- User Authentication
- Cloud Firestore
- Data Storage

For security reasons, Firebase credentials are **not included** in this repository.

Create a `firebaseConfig.js` file using your own Firebase project configuration.

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/tatianabazouni/telle-mere-telle-fille.git
```

Navigate into the project

```bash
cd telle-mere-telle-fille
```

Install dependencies

```bash
npm install
```

Start Expo

```bash
npx expo start
```

Run Android

```bash
npm run android
```

Run iOS

```bash
npm run ios
```

---

# 📸 Screens

- Home
- Login
- Register
- Product Catalog
- Product Details
- Favorites
- Shopping Cart
- Checkout
- Profile
- Event Customization
- Contact
- Location

---

# 🎯 Learning Outcomes

This project demonstrates experience with:

- Cross-platform mobile development
- Component-based architecture
- Firebase integration
- Authentication flows
- CRUD operations
- State management using Context API
- Mobile navigation
- Reusable UI components
- Responsive mobile design
- Modular project organization

---

# 🔮 Future Improvements

- Online payment integration
- Admin dashboard
- Product filtering
- Search functionality
- Push notifications
- Order tracking
- Customer reviews
- Dark mode
- Multi-language support
- Offline caching

