<p align="center">
  <img src="assets/logo.svg" alt="GitShare.ch" width="280">
</p>

<p align="center">
  <strong>Beautiful GitHub repo screenshots for social media</strong><br>
  Generate shareable cards from any public GitHub repository — entirely in your browser.
</p>

<p align="center">
  <a href="https://gitshare.ch"><strong>gitshare.ch</strong></a> ·
  <a href="https://github.com/minoansecurity/gitshare/issues">Issues</a> ·
  <a href="https://buymeacoffee.com/dimiprasakis">Support</a>
</p>

---


## How it works

1. The browser fetches repo metadata from the [GitHub REST API](https://docs.github.com/en/rest)
2. A card is rendered as live DOM elements with inline styles

Then download the card at your prefered format (e.g. .png)

## Run locally

Any static file server works:

```bash
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

## Rate limits

GitHub allows 60 unauthenticated API requests per hour per IP address. Each card generation uses 1 request (2 if the contributors toggle is enabled). Your remaining quota is shown in real time below the input bar.

## Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change.

## License

MIT — [Minoan Security GmbH](https://minoansecurity.com/)
