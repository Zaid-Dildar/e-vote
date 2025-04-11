# E-Vote Web App

This is the frontend for **E-Vote**, a secure online voting system. It is built using **Next.js** and TypeScript.

## 🌍 Live Deployment

The application is deployed on **Vercel**:  
🔗 [https://e-vote-x.vercel.app/](https://e-vote-x.vercel.app/)

## 🛠️ Tech Stack

- Next.js – React framework for SSR & SSG.
- TypeScript – Strongly typed JavaScript.
- Tailwind CSS – Utility-first CSS framework.

## 📂 Project Structure

```

web/                            # Next.js web app (TypeScript)
│── app/
│       ├── api/                # API routes to communicate with backend
│         │ ├── admin/          # API routes for admin
│         │ ├── audit/          # API routes for auditor
│         │ ├── user/           # API routes for user
│       ├── admin/              # Admin Module Pages
│       ├── audit/              # Auditor Module Pages
│       ├── user/               # Voter Module Pages
│       ├── components/         # Reusable UI components
│── next.config.json            # next config
│── tailwind.config.json        # tailwind config
│── package.json
│── README.md

```

## 📝 License

This project is licensed under the [MIT License](LICENSE).
