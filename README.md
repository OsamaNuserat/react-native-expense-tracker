# React Native Expense Tracker 📲💰

A minimal yet powerful expense tracking app built with **React Native** and **Node.js**. It automatically syncs SMS messages containing financial transactions and displays them in a user-friendly mobile interface.

---

## 🚀 Features

- 📥 Parses SMS messages for income and expenses
- 🔒 Secure authentication with JWT
- 💾 Persists user sessions using AsyncStorage
- 📡 Backend powered by Node.js, PostgreSQL, and Express
- 🔁 Real-time refresh with React Query
- 📱 Clean and responsive mobile UI with React Native Paper

---

## 🧠 Tech Stack

| Frontend         | Backend              |
|------------------|----------------------|
| React Native     | Node.js + Express    |
| TypeScript       | PostgreSQL           |
| React Query      | JWT Auth             |
| AsyncStorage     | Sequelize ORM        |

---

## 🛠️ Setup

### 1. Clone the repository

```bash
git clone https://github.com/OsamaNuserat/react-native-expense-tracker.git
cd react-native-expense-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the backend server

Ensure your PostgreSQL database is running and update the `.env` file with:

```
DATABASE_URL=postgresql://expense_user:password@localhost:5432/expense_tracker
JWT_SECRET=your_jwt_secret
```

Then run:

```bash
npm run dev
```

### 4. Run the mobile app

Make sure your physical iOS/Android device is on the same network.

Update your `api.ts` with your local IP address:

```ts
baseURL: 'http://<your-ip-address>:3000'
```

Then run the app:

```bash
npx expo start
```

---

## 🤝 Contributing

Feel free to open issues or submit PRs for improvements, bug fixes, or feature suggestions.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 💬 Contact

Made with ❤️ by [Osama Nuserat](https://github.com/OsamaNuserat)