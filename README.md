# ✈️ TripLedger — Travel Expense Tracker (React Native + Firebase)

TripLedger is a **cross-platform mobile application** that helps users track and manage expenses during trips, split bills with friends, and monitor spending in real-time.

Built using **React Native CLI**, **Firebase Authentication**, and **Cloud Firestore**, the app provides a smooth and modern UI with realtime updatess.

---


## Video




https://github.com/user-attachments/assets/7866cd27-0b06-4be7-bff8-27409a348ab3




---


## 📱 Features

### 🔐 Authentication

* Email & Password Sign In / Sign Up
* Google Sign-In
* Persistent login session
* Secure Firebase Authentication

### 🧳 Trip Management

* Create trips with place & country
* View all trips in a grid layout
* Delete trip (automatically deletes all related expenses)
* Profile shows total number of trips

### 💸 Expense Tracking

* Add expenses per trip
* Realtime expense updates using Firestore `onSnapshot`
* Automatic total trip spending calculation
* Beautiful animated expense cards

### 🤝 Bill Splitting

* Split a single expense among multiple people
* Per-person cost calculated instantly
* Quick split button inside each expense

### 👉 Gesture Controls

* Long-press to confirm delete
* Undo-style UX (toast feedback)

### 🎨 UI/UX

* Reanimated card animations (staggered list entry)
* Floating Action Buttons
* Toast notifications
* Clean modern design

---

## 🛠 Tech Stack

| Technology                   | Usage                       |
| ---------------------------- | --------------------------- |
| React Native CLI             | Mobile App Development      |
| Firebase Authentication      | User login & Google Sign-In |
| Cloud Firestore              | Database (Realtime)         |
| Redux Toolkit                | Global state management     |
| React Navigation             | Screen navigation           |
| React Native Reanimated      | Animations                  |
| Google Sign-In               | OAuth login                 |
| Toast Message                | Feedback notifications      |
| Tailwind RN (twrnc)          | Styling                     |

---

## 📂 Project Structure

```
src/
 ├── assets/            # Images & icons
 ├── components/        # Reusable UI components
 ├── navigation/        # Navigation stack
 ├── redux/             # Redux store & slices
 ├── screens/           # App screens
 ├── firebase/          # Firebase config & services
 └── utils/             # Helpers & toast utilities
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
https://github.com/Saurabh7763/TripLedger.git
cd tripledger
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Firebase Setup

Create a Firebase project at:
https://console.firebase.google.com

Then:

1. Enable **Authentication**

   * Email/Password
   * Google Provider

2. Enable **Cloud Firestore**

3. Add Android app:

   * Package name: `com.tripledger` (or yours)
   * Download `google-services.json`

Place file here:

```
android/app/google-services.json
```

---

### 5️⃣ Google Sign-In Setup

In Firebase Console:

Authentication → Sign-in method → Google → Enable

Add SHA-1 fingerprint:

---

## 🔥 Firestore Database Structure

### users

```
users
 └── uid
      ├── name
      ├── email
      ├── photo
      └── createdAt
```

### trips

```
trips
 └── tripId
      ├── userId
      ├── place
      ├── country
      └── createdAt
```

### expenses

```
expenses
 └── expenseId
      ├── tripId
      ├── title
      ├── amount
      ├── createdAt
```

---

## 📸 Screens

* Home Screen
* All Trips Screen
* Trip Expense Screen
* Add Expense
* Profile Screen
* Authentication Screens

*(Add screenshots here after uploading images to GitHub)*

---

## 🚀 Future Improvements

* Expense editing
* Balance settlement between friends
* Export trip report (PDF)
* Currency conversion
* Offline support

---

## 🤝 Contributing

Pull requests are welcome!
If you’d like to improve UI/UX or add features, feel free to fork the repo.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Your Name**

If you like this project, please ⭐ the repository!
