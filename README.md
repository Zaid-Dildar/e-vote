# E-Vote

E-Vote is a secure online voting system that leverages biometric authentication for verification. The project consists of a web application, a mobile application, and a backend service, all built using modern technologies.

## 🚀 Tech Stack

### **Frontend**

- **Web**: [Next.js](https://nextjs.org/) (React, TypeScript)
- **Mobile**: [React Native](https://reactnative.dev/) (TypeScript)

### **Backend**

- **Server**: [Express.js](https://expressjs.com/) (TypeScript)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Authentication**: WebAuthn for biometric authentication

### **Monorepo Management**

- [Turborepo](https://turbo.build/) for efficient builds and package management
- Shared utilities inside `/packages`

## 📂 Project Structure

```
e-vote/
│── apps/
│   ├── server/      # Express.js backend (TypeScript)
│   ├── web/         # Next.js web app (TypeScript)
│   ├── mobile/      # React Native app (TypeScript)
│── packages/
│   ├── eslint-config/
│   ├── typescript-config/
│   ├── utils/       # Shared utilities
│── .gitignore
│── package.json
│── turbo.json       # Turborepo config
│── README.md
```

## 📦 Installation & Setup

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/yourusername/e-vote.git
cd e-vote
```

### **2️⃣ Install Dependencies**

```sh
npm install  # or yarn install / pnpm install
```

### **3️⃣ Run the Applications**

#### Start the backend server

```sh
cd apps/server
npm run dev
```

#### Start the web application

```sh
cd apps/web
npm run dev
```

#### Start the mobile application (requires an emulator or physical device)

```sh
cd apps/mobile
npm run start
```

## 🛠 Development & Contribution

1. Create a new branch for your feature/fix:
   ```sh
   git checkout -b feature-name
   ```
2. Commit your changes:
   ```sh
   git commit -m "Add feature-name"
   ```
3. Push the branch and create a PR:
   ```sh
   git push origin feature-name
   ```

## 📝 License

This project is licensed under the [MIT License](LICENSE).

---

### ✨ Contributors

- **Muhammad Zaid Dildar** (Lead Developer)
