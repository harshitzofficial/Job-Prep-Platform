# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


```
interview-ai-yt-main
├─ Backend
│  ├─ .env
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ server.js
│  └─ src
│     ├─ app.js
│     ├─ config
│     │  └─ database.js
│     ├─ controllers
│     │  ├─ auth.controller.js
│     │  └─ interview.controller.js
│     ├─ middlewares
│     │  ├─ auth.middleware.js
│     │  └─ file.middleware.js
│     ├─ models
│     │  ├─ blacklist.model.js
│     │  ├─ interviewReport.model.js
│     │  └─ user.model.js
│     ├─ routes
│     │  ├─ auth.routes.js
│     │  └─ interview.routes.js
│     └─ services
│        └─ ai.service.js
└─ Frontend
   ├─ eslint.config.js
   ├─ index.html
   ├─ package-lock.json
   ├─ package.json
   ├─ public
   │  └─ vite.svg
   ├─ README.md
   ├─ src
   │  ├─ App.jsx
   │  ├─ app.routes.jsx
   │  ├─ features
   │  │  ├─ auth
   │  │  │  ├─ auth.context.jsx
   │  │  │  ├─ auth.form.scss
   │  │  │  ├─ components
   │  │  │  │  └─ Protected.jsx
   │  │  │  ├─ hooks
   │  │  │  │  └─ useAuth.js
   │  │  │  ├─ pages
   │  │  │  │  ├─ Login.jsx
   │  │  │  │  └─ Register.jsx
   │  │  │  └─ services
   │  │  │     └─ auth.api.js
   │  │  └─ interview
   │  │     ├─ hooks
   │  │     │  └─ useInterview.js
   │  │     ├─ interview.context.jsx
   │  │     ├─ pages
   │  │     │  ├─ Home.jsx
   │  │     │  └─ Interview.jsx
   │  │     ├─ services
   │  │     │  └─ interview.api.js
   │  │     └─ style
   │  │        ├─ home.scss
   │  │        └─ interview.scss
   │  ├─ main.jsx
   │  ├─ style
   │  │  └─ button.scss
   │  └─ style.scss
   └─ vite.config.js

```