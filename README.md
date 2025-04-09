# Task Tracker App

**Task Tracker** is a modern web application for managing your daily tasks. Built on top off of my own [Webpack template repository](https://github.com/JunehyukYoo/template-webpack), this project combines a modular, up-to-date development environment with task management functionality to help you stay organized and boost your productivity. The tasks are currently being stored with the vanilla Web Storage API.

## 📁 Project Structure

```
.
├── dist/                  # Compiled production files (generated)
├── node_modules/          # Installed dependencies
├── src/                   # Application source code (HTML, JS, CSS)
|   ├── asset/             # Folder containing assets (images, svgs, etc.)
|   ├── includes/          # Folder containing core JavaScript logic
│   ├── template.html      # HTML template used by HtmlWebpackPlugin (includes initial Task Tracker UI)
│   ├── styles.css         # Main styles for the application
│   └── index.js           # Entry point for bundler
├── .gitignore             # Ignores node_modules and dist from Git
├── package.json           # Project metadata and scripts
├── webpack.common.js      # Shared Webpack configuration
├── webpack.dev.js         # Development-specific Webpack configuration
├── webpack.prod.js        # Production-specific Webpack configuration
├── README.md              # You're here!
```

## ⚙️ Scripts

Defined in `package.json`:

```json
"scripts": {
  "build": "webpack --config webpack.prod.js",
  "dev": "webpack serve --open --config webpack.dev.js",
  "deploy": "git subtree push --prefix dist origin gh-pages"
}
```

### 🔧 Script Breakdown:

| Command          | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| `npm run build`  | Builds the project for production. Output goes to the `/dist` folder.      |
| `npm run dev`    | Runs the development server at `http://localhost:8080/` and opens the browser. |
| `npm run deploy` | Deploys `/dist` to the `gh-pages` branch using Git Subtree.                |

## ✅ Setup Instructions

1. **Clone the repo:**

   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

   The app will open in your browser at [http://localhost:8080/](http://localhost:8080/).

4. **Build for production:**

   ```bash
   npm run build
   ```

5. **Deploy to GitHub Pages (optional):**

   Ensure your repository has a `gh-pages` branch, then run:

   ```bash
   npm run deploy
   ```

## 📦 What’s Included

- ✅ Webpack 5 for modular builds
- ✅ Development server with live reload
- ✅ Source maps for easier debugging
- ✅ Production optimizations (minified JS/CSS)
- ✅ HTML template integration via `HtmlWebpackPlugin`
- ✅ GitHub Pages deployment via `subtree push`
- ✅ `.gitignore` set up for `node_modules` and `dist`
- ✅ Task Tracker application logic (manage tasks with add, update, and delete functionality)

## 🧠 About the Task Tracker App

The Task Tracker App is designed to be simple yet powerful:

- **Add New Tasks:** Quickly add tasks to your list.
- **Bundle Tasks in Projects:** Keep your tasks organized in user-defined projects.
- **Mark as Completed:** Easily update task status.
- **Delete or Update Tasks:** Keep your task list current and manageable.
- **Sorting:** Sort your task list in multiple ways.
- **Pseudo-backend:** Save your updated tasks even on window close or refresh.
- **Modular & Scalable:** Built with a clean Webpack setup that encourages modular code and easy customizations.

This project leverages modern JavaScript and build tools to help you get up and running fast, while also serving as a robust foundation for further enhancements.