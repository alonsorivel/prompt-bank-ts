# Prompt Bank TS: A React & TypeScript Project

## Quick Start Guide

This document outlines the steps to create a React.js project using TypeScript with Vite for the "prompt-bank-ts" project. It includes the installation of various dependencies necessary for a robust development setup.

### Prerequisites

- Ensure Node.js (version 12 or newer) is installed on your system.

### Step 1: Project Setup

1. **Create a New Project**

   Open your terminal and execute the following command to create a new React.js project with TypeScript using Vite:

   ```bash
   npm create vite@latest prompt-bank-ts -- --template react-ts
   ```

2. **Navigate to Your Project Directory**

   ```bash
   cd prompt-bank-ts
   ```

3. **Install Dependencies**

   ```bash
   npm install
   ```

### Step 2: Installing Dependencies

Install the necessary libraries for your project:

- **React Bootstrap and Bootstrap**

  ```bash
  npm install react-bootstrap bootstrap
  ```

- **Sass**

  ```bash
  npm install sass
  ```

- **Font Awesome**

  ```bash
  npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons @fortawesome/free-brands-svg-icons @fortawesome/free-regular-svg-icons
  ```

- **React Router**

  ```bash
  npm install react-router-dom
  npm install --save-dev @types/react-router-dom
  ```

- **React Redux and Redux Toolkit**

  ```bash
  npm install react-redux @reduxjs/toolkit
  ```

- **JSON Server**

  ```bash
  npm install -D json-server
  ```

- **Date-fns**

  ```bash
  npm install date-fns
  ```

- **Axios**

  ```bash
  npm install axios
  ```

### Step 3: Configure Vite and JSON Server

1. **Set Vite to Use Port 3000**

   Modify the `vite.config.ts` file to set the server port to 3000:

   ```ts
   import { defineConfig } from "vite";
   import react from "@vitejs/plugin-react";

   // https://vitejs.dev/config/
   export default defineConfig({
     plugins: [react()],
     server: {
       port: 3000
     }
   });
   ```

2. **Setup JSON Server (Optional)**

   To mock an API, create a `db.json` file with your data and add a script in `package.json`:

   ```json
   "scripts": {
     "start": "vite",
     "dev": "concurrently "npm run start" "json-server --watch db.json --port 5000"",
     "build": "tsc && vite build"
   }
   ```

   Install `concurrently`:

   ```bash
   npm install -D concurrently
   ```

### Step 4: Run Your Project

Execute the following command to start your development environment:

```bash
npm run dev
```

This will launch your React application on port 3000 and JSON Server if you've set it up.

### Conclusion

You have successfully set up a modern React.js project using TypeScript with Vite. This setup includes essential tools and libraries for developing high-quality web applications efficiently.
