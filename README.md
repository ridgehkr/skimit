# SkimIt

An open-source Reddit client that provides a clean and simple way to browse Reddit without all the extra noise. See it live at [skimit.app](https://skimit.app).

**Disclaimer:** This app is currently in its early stages and is meant for fun use only. If you would like to contribute to the project, [please jump right in](https://github.com/ridgehkr/skimit)!

## 🚀 Development

1. Install dependencies

```sh
npm install
```

2. Run development server

```sh
npx next dev
```

## 📦 Build & Deploy

```sh
npx next build
```

This project is pre-configured to deploy to Netlify (see `./netlify.toml`), but you can just as easily deploy it to any Next.js-supporting environment.

## 🗺️ Roadmap

These are planned future features of SkimIt. If you have other ideas or suggestions, please [open an issue](https://github.com/ridgehkr/skimit/issues).

- [ ] Reddit authentication and limited account integration (e.g. importing saved subreddits)
- [ ] Upvoting/downvoting
- [ ] Adopt a more customized design, departing from the current shadcn/ui starter theme
- [x] Migrate saved subreddit management to persisted Zustand approach

---

SkimIt is built and maintained by [Caleb Pierce](https://calebpierce.dev).
