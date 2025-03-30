# Webpack Template Starter

This repository provides a clean and modular setup for modern JavaScript projects using **Webpack**. It supports development and production builds, and includes support for deploying to GitHub Pages via `dist/`.

## 📁 Project Structure

```
.
├── dist/                  # Compiled production files (generated)
├── node_modules/          # Installed dependencies
├── src/                   # Source code (HTML, JS, CSS)
│   └── template.html      # HTML template used by HtmlWebpackPlugin
├── .gitignore             # Ignores node_modules and dist from Git
├── package.json           # Project metadata and scripts
├── webpack.common.js      # Shared Webpack config
├── webpack.dev.js         # Dev-specific Webpack config
├── webpack.prod.js        # Prod-specific Webpack config
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

| Command         | Description                                                                 |
|----------------|-----------------------------------------------------------------------------|
| `npm run build` | Builds the project for production. Output goes to the `/dist` folder.      |
| `npm run dev`   | Runs the development server at `http://localhost:8080/` and opens browser. |
| `npm run deploy`| Deploys `/dist` to the `gh-pages` branch using Git Subtree.                |

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

3. **Start development server:**

   ```bash
   npm run dev
   ```

4. **Build for production:**

   ```bash
   npm run build
   ```

5. **Deploy to GitHub Pages (optional):**

   Make sure your repo has a `gh-pages` branch and run:

   ```bash
   npm run deploy
   ```

## 📦 What’s Included

- ✅ Webpack 5
- ✅ Dev server with live reload
- ✅ Source maps
- ✅ Production optimization (minified JS/CSS)
- ✅ HTML template integration via `HtmlWebpackPlugin`
- ✅ GitHub Pages deployment via `subtree push`
- ✅ `.gitignore` set up for `node_modules` and `dist`

## 🧠 Notes

- The actual source code goes in the `src/` folder.
- You can modify `src/template.html` and `src/index.js` to kick off your project.
- Use the `webpack.common.js`, `webpack.dev.js`, and `webpack.prod.js` files to customize your build process.

## 📝 License

This project is a boilerplate/template and is free to use under the [MIT License](LICENSE).
