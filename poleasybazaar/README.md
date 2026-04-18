# PolEasyBazaar

PolEasyBazaar is a hackathon MVP that wraps PolicyBazaar's public catalog in a cleaner, self-serve discovery experience for first-time insurance buyers.

## Stack

- React + Vite
- TailwindCSS
- Framer Motion
- Fuse.js
- PapaParse
- Python scraper with CSV output

## Run the frontend

1. Install Node.js 18+.
2. From `poleasybazaar/`, run `npm install`.
3. Start the app with `npm run dev`.
4. Build for production with `npm run build`.

## Scraper flow

1. Run `python scraper/scrape_pb.py` from the repository root.
2. The scraper writes CSVs to `scraper/data/`.
3. Copy the generated files into `poleasybazaar/src/data/` if you refresh the dataset.

The committed CSVs are seed data for the demo. The scraper first tries live public PolicyBazaar pages, then falls back to the curated seed data if scraping is blocked or fields are missing.

## Deploy to Vercel

1. Push the repository to GitHub.
2. Import the repo in Vercel.
3. Set the root directory to `poleasybazaar`.
4. Build command: `npm run build`
5. Output directory: `dist`

## Hackathon constraints

- No OTP or SMS verification
- No checkout or payments
- No backend database
- All product CTAs redirect to PolicyBazaar
- Data ships as local CSV files
