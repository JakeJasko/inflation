# Pinflation Terminal

An institutional-grade **Personal Consumer Price Index (CPI)** and capital drag workstation tailored for tracking real warehouse grocery inflation from Costco purchase history.

Designed according to [Impeccable](https://impeccable.style)'s **Operate Mode** standards: high data density, zero AI-slop glows, dual Dark Terminal / Executive Light themes, and rigorous econometric attribution.

---

## Features

- **Quantity-Weighted Laspeyres Basket Index**: Calculates true personalized inflation using a repeat-purchase matched SKU basket (≥2 purchases) rather than naive averages.
- **Shelf List Basis vs. Net Paid Basis**: Isolates underlying product price inflation from promotional volatility by linking Costco's negative Instant Savings lines (`/<itemNumber>`) back to parent items.
- **US BLS Food-at-Home Benchmark**: Side-by-side spread against the official 2.9%/yr national CPI benchmark.
- **Annual Capital Drag & Savings Shield Ratio**: Computes exact dollar increases on annual staple spending and measures how effectively promotional rebates insulate against price hikes.
- **SKU Inflation Attribution Matrix**: Portfolio allocation table showing spend weight (%), purchase frequency, baseline vs. latest quotes, sparklines, and annualized YoY rates.
- **Forward 12-Month Grocery Budget Projection**: Forward regression forecast estimating annual budget requirements and promotional buffers.
- **10-Second Client-Side Ingestion**: Run a browser console script on Costco.com to export receipts without sharing credentials.
- **Privacy & Security First**: Zero personal credentials, tokens, or live receipts are stored in the git repository or exposed to public hosts.

---

## Local Development

```bash
# Clone the repository
git clone https://github.com/JakeJasko/pinflation.git
cd pinflation

# Start local server
npm start
# -> Running on http://localhost:3000
```

---

## Security & Privacy Architecture

- **No Remote Credential Storage**: Authentication tokens (`idToken`, `refreshToken`) and live scraped receipts are kept strictly on your local machine and excluded via `.gitignore`.
- **Client-Side Execution**: On static deployments (GitHub Pages), data parsing, indexing, and storage operate 100% in-browser via Web APIs and `localStorage`.
- **Anonymized Reference Data**: Bundled demo receipts contain no personal names, addresses, or membership identifiers.

---

## License

MIT
