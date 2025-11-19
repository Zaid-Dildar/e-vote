# E-Vote

E-Vote is a secure online voting system that leverages biometric authentication for verification. The project consists of a web application, a mobile application, and a backend service, all built using modern technologies.

## 📄 Thesis Documents

> **Note:** If the direct-view link does not load in your browser, use the **GitHub View (Fallback)** link right below it.

### 📘 Final Thesis  
- **[Open in Browser](https://docs.google.com/viewer?url=https://raw.githubusercontent.com/Zaid-Dildar/e-vote/chore/project-documentation/docs/thesis/Thesis_(E-Vote)_Final.pdf)**  
- **[GitHub View (Fallback)](https://github.com/Zaid-Dildar/e-vote/blob/chore/project-documentation/docs/thesis/Thesis_(E-Vote)_Final.pdf)**  

### 📊 Presentation Slides  
- **[Open in Browser](https://docs.google.com/viewer?url=https://raw.githubusercontent.com/Zaid-Dildar/e-vote/chore/project-documentation/docs/thesis/Final_Presentation_(E-Vote).pdf)**  
- **[GitHub View (Fallback)](https://github.com/Zaid-Dildar/e-vote/blob/chore/project-documentation/docs/thesis/Final_Presentation_(E-Vote).pdf)**  

### 📘 User Manual  
- **[Open in Browser](https://docs.google.com/viewer?url=https://raw.githubusercontent.com/Zaid-Dildar/e-vote/chore/project-documentation/docs/thesis/User_Manual.pdf)**  
- **[GitHub View (Fallback)](https://github.com/Zaid-Dildar/e-vote/blob/chore/project-documentation/docs/thesis/User_Manual.pdf)**  

### 🎥 Video Demo  
- **[Watch Video](https://res.cloudinary.com/dmx66oic1/video/upload/v1763535964/E-Vote/E-Vote_Demo_mbv1os.mp4)**  

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
│── packages/
│   ├── eslint-config/
│   ├── typescript-config/
│   ├── utils/       # Shared utilities
│── docs/
│   ├── thesis/
│   │   ├── Thesis_(E-Vote)_Final.pdf
│   │   ├── Final_Presentation_(E-Vote).pdf
│   │   ├── User_Manual.pdf
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
