from __future__ import annotations

import csv
import random
import re
import time
from pathlib import Path
from typing import Dict, List

try:
    import pandas as pd  # type: ignore
except Exception:  # pragma: no cover
    pd = None

try:
    import requests  # type: ignore
except Exception:  # pragma: no cover
    requests = None

try:
    from bs4 import BeautifulSoup  # type: ignore
except Exception:  # pragma: no cover
    BeautifulSoup = None

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
PRODUCTS_CSV = DATA_DIR / "insurance_products.csv"
FAQS_CSV = DATA_DIR / "insurance_faqs.csv"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/123.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-IN,en;q=0.9",
}

CATEGORY_URLS = {
    "health": "https://www.policybazaar.com/health-insurance/",
    "life": "https://www.policybazaar.com/term-insurance/",
    "car": "https://www.policybazaar.com/car-insurance/",
    "motor": "https://www.policybazaar.com/two-wheeler-insurance/",
}

SEED_PRODUCTS: List[Dict[str, str]] = [
    {
        "id": "health-1",
        "category": "health",
        "insurer_name": "HDFC ERGO",
        "plan_name": "Optima Secure",
        "key_benefits": "2x coverage from day 1 | Restoration benefit | 14,000+ cashless hospitals",
        "price_range": "Coverage: ₹5 lakh to ₹2 crore",
        "pb_redirect_url": "https://www.policybazaar.com/insurance-companies/hdfc-ergo-health-insurance/optima-secure-plan/",
    },
    {
        "id": "health-2",
        "category": "health",
        "insurer_name": "Niva Bupa",
        "plan_name": "ReAssure 2.0",
        "key_benefits": "Unlimited sum insured options | Booster and ReAssure+ | Annual health check-ups",
        "price_range": "Coverage: ₹5 lakh to ₹1 crore",
        "pb_redirect_url": "https://www.policybazaar.com/insurance-companies/max-bupa-health-insurance/reassure-2-0-plan/",
    },
    {
        "id": "health-3",
        "category": "health",
        "insurer_name": "Care Health",
        "plan_name": "Care Supreme",
        "key_benefits": "Unlimited automatic recharge | Day 31 cover for select PEDs | Claims Shield optional cover",
        "price_range": "Coverage: ₹5 lakh to ₹1 crore",
        "pb_redirect_url": "https://www.policybazaar.com/insurance-companies/religare-health-insurance/care-supreme/",
    },
    {
        "id": "health-4",
        "category": "health",
        "insurer_name": "Star Health",
        "plan_name": "Star Comprehensive",
        "key_benefits": "Automatic restoration | Maternity and hospital cash options | Preventive health check-ups",
        "price_range": "Coverage: ₹5 lakh to ₹1 crore",
        "pb_redirect_url": "https://www.policybazaar.com/insurance-companies/star-health-insurance/star-comprehensive-insurance-policy/",
    },
    {
        "id": "life-1",
        "category": "life",
        "insurer_name": "HDFC Life",
        "plan_name": "Click 2 Protect Supreme",
        "key_benefits": "Life, Life Plus, and Life Goal options | Terminal illness benefit | Optional waiver of premium riders",
        "price_range": "Starting from ₹13/day",
        "pb_redirect_url": "https://www.policybazaar.com/term-insurance/hdfc-life-click-2-protect-supreme-term-plan/",
    },
    {
        "id": "life-2",
        "category": "life",
        "insurer_name": "ICICI Prudential",
        "plan_name": "iProtect Smart Plus",
        "key_benefits": "Life stage protection | Critical illness and accidental death options | Flexible payout choices",
        "price_range": "Minimum premium from ₹2,400/year",
        "pb_redirect_url": "https://www.policybazaar.com/term-insurance/icici-pru-iprotect-smart-term-plan/",
    },
    {
        "id": "life-3",
        "category": "life",
        "insurer_name": "Tata AIA",
        "plan_name": "Sampoorna Raksha Supreme",
        "key_benefits": "Life cover till 100 years | Payor accelerator benefit | Top-up life stage option",
        "price_range": "Starting from ₹13/day",
        "pb_redirect_url": "https://www.policybazaar.com/term-insurance/tata-aia-sampoorna-raksha-supreme/",
    },
    {
        "id": "life-4",
        "category": "life",
        "insurer_name": "ICICI Prudential",
        "plan_name": "All-in-One Term Plan",
        "key_benefits": "Life cover plus critical illness cover | Accidental coverage | Flexible premium payment",
        "price_range": "Coverage from ₹50 lakh+",
        "pb_redirect_url": "https://www.policybazaar.com/term-insurance/icici-all-in-one-term-plan/",
    },
    {
        "id": "car-1",
        "category": "car",
        "insurer_name": "HDFC ERGO",
        "plan_name": "Comprehensive Car Insurance",
        "key_benefits": "Third-party plus own-damage cover | Theft and fire protection | Add-ons like NCB protector",
        "price_range": "Starting from ₹2,094/year",
        "pb_redirect_url": "https://www.policybazaar.com/insurance-companies/hdfc-ergo-car-insurance/comprehensive/",
    },
    {
        "id": "car-2",
        "category": "car",
        "insurer_name": "ICICI Lombard",
        "plan_name": "Comprehensive Car Insurance",
        "key_benefits": "5900+ network garages | Own damage and third-party cover | Engine Protect add-on",
        "price_range": "Starting from ₹2,094/year",
        "pb_redirect_url": "https://www.policybazaar.com/insurance-companies/icici-lombard-car-insurance/",
    },
    {
        "id": "car-3",
        "category": "car",
        "insurer_name": "TATA AIG",
        "plan_name": "Car Insurance",
        "key_benefits": "7500+ cashless garages | 24x7 emergency assistance | Zero dep and roadside assistance",
        "price_range": "Starting from ₹2,094/year",
        "pb_redirect_url": "https://www.policybazaar.com/insurance-companies/tata-aig-car-insurance/",
    },
    {
        "id": "car-4",
        "category": "car",
        "insurer_name": "Bajaj Allianz",
        "plan_name": "Car Insurance",
        "key_benefits": "Comprehensive and third-party options | Add-on customisation | Quick digital renewal flow",
        "price_range": "Starting from ₹2,094/year",
        "pb_redirect_url": "https://www.policybazaar.com/insurance-companies/bajaj-allianz-car-insurance/",
    },
    {
        "id": "motor-1",
        "category": "motor",
        "insurer_name": "HDFC ERGO",
        "plan_name": "Comprehensive Bike Insurance",
        "key_benefits": "Own-damage plus third-party cover | Theft and disaster cover | Add-on flexibility",
        "price_range": "Starting from ₹1.3/day",
        "pb_redirect_url": "https://www.policybazaar.com/insurance-companies/hdfc-ergo-two-wheeler-insurance/comprehensive/",
    },
    {
        "id": "motor-2",
        "category": "motor",
        "insurer_name": "ICICI Lombard",
        "plan_name": "Comprehensive Bike Insurance",
        "key_benefits": "Accident and theft protection | Third-party liability cover | Multi-year policy options",
        "price_range": "Starting from ₹1.3/day",
        "pb_redirect_url": "https://www.policybazaar.com/insurance-companies/icici-lombard-two-wheeler-insurance/comprehensive/",
    },
    {
        "id": "motor-3",
        "category": "motor",
        "insurer_name": "Bajaj Allianz",
        "plan_name": "Comprehensive Bike Insurance",
        "key_benefits": "Accident and theft cover | Third-party death and injury protection | Add-ons available",
        "price_range": "Starting from ₹1.3/day",
        "pb_redirect_url": "https://www.policybazaar.com/insurance-companies/bajaj-allianz-two-wheeler-insurance/comprehensive/",
    },
    {
        "id": "motor-4",
        "category": "motor",
        "insurer_name": "TATA AIG",
        "plan_name": "Comprehensive Bike Insurance",
        "key_benefits": "Own damage plus TP cover | Personal accident cover | Natural and man-made calamity cover",
        "price_range": "Starting from ₹1.3/day",
        "pb_redirect_url": "https://www.policybazaar.com/insurance-companies/tata-aig-two-wheeler-insurance/comprehensive/",
    },
]

SEED_FAQS: List[Dict[str, str]] = [
    {"id": "health-faq-1", "category": "health", "question": "What does health insurance usually cover?", "answer": "Health insurance commonly covers in-patient hospitalization day care treatments ambulance charges and pre and post hospitalization expenses subject to policy wording."},
    {"id": "health-faq-2", "category": "health", "question": "Why do young professionals still need health insurance?", "answer": "Even if your employer offers a cover a personal policy helps you keep continuity build your own no-claim history and stay protected if you switch jobs."},
    {"id": "health-faq-3", "category": "health", "question": "What is a waiting period in health insurance?", "answer": "A waiting period is the initial time during which some illnesses treatments or pre-existing conditions cannot be claimed under the policy."},
    {"id": "health-faq-4", "category": "health", "question": "What is cashless hospitalization?", "answer": "Cashless hospitalization means the insurer settles eligible medical bills directly with a network hospital instead of making you pay first and claim later."},
    {"id": "health-faq-5", "category": "health", "question": "How should I compare two health plans?", "answer": "Compare sum insured room rent limits waiting periods restoration benefits network hospitals and optional riders before choosing the plan."},
    {"id": "health-faq-6", "category": "health", "question": "What is restoration or recharge benefit?", "answer": "It restores some or all of the exhausted sum insured after a claim so you still have coverage available for later hospitalization in the same year."},
    {"id": "life-faq-1", "category": "life", "question": "What is term life insurance?", "answer": "Term insurance is a pure protection plan that pays a death benefit to your nominee if you pass away during the chosen policy term."},
    {"id": "life-faq-2", "category": "life", "question": "Why is term insurance considered a good first policy?", "answer": "It usually offers high life cover at relatively affordable premiums which makes it one of the simplest ways to start financial protection."},
    {"id": "life-faq-3", "category": "life", "question": "How much life cover should a young salaried person consider?", "answer": "A common starting approach is to estimate cover based on income liabilities future goals and dependents rather than choosing only the cheapest premium."},
    {"id": "life-faq-4", "category": "life", "question": "What affects a term insurance premium?", "answer": "Age smoking status health profile income selected sum assured payout option and riders all influence the premium you are quoted."},
    {"id": "life-faq-5", "category": "life", "question": "What is a rider in term insurance?", "answer": "A rider is an optional extra benefit such as accidental death critical illness or waiver of premium added to the base policy at extra cost."},
    {"id": "life-faq-6", "category": "life", "question": "Can I buy term insurance online without an advisor call?", "answer": "Yes many insurers and marketplaces let you compare plans fill details and begin underwriting online though medical checks may still be required."},
    {"id": "car-faq-1", "category": "car", "question": "What is the difference between third-party and comprehensive car insurance?", "answer": "Third-party insurance covers damage caused to others while comprehensive insurance adds protection for your own car against accidents theft fire and calamities."},
    {"id": "car-faq-2", "category": "car", "question": "Why are add-ons important in car insurance?", "answer": "Add-ons such as zero depreciation engine protection and roadside assistance can improve claim value or convenience depending on your car and usage."},
    {"id": "car-faq-3", "category": "car", "question": "What affects a car insurance premium quote?", "answer": "The vehicle make model registration location IDV previous claims and selected add-ons all affect your premium."},
    {"id": "car-faq-4", "category": "car", "question": "What is IDV in car insurance?", "answer": "IDV or insured declared value is the approximate current market value of the car used as the basis for total loss or theft claims."},
    {"id": "car-faq-5", "category": "car", "question": "Why should I compare network garages?", "answer": "A wider cashless garage network can make repairs smoother because the insurer can settle approved bills directly with partner workshops."},
    {"id": "car-faq-6", "category": "car", "question": "When should I renew car insurance?", "answer": "Renew before the policy expiry date to avoid a coverage gap inspection delays and possible loss of accumulated no claim bonus benefits."},
    {"id": "motor-faq-1", "category": "motor", "question": "What does bike insurance typically protect against?", "answer": "Bike insurance can protect against third-party liabilities and in comprehensive plans also cover own damage theft fire and natural calamities."},
    {"id": "motor-faq-2", "category": "motor", "question": "Is bike insurance mandatory in India?", "answer": "At least third-party insurance is mandatory by law for riding a two-wheeler on public roads in India."},
    {"id": "motor-faq-3", "category": "motor", "question": "What is comprehensive bike insurance?", "answer": "Comprehensive bike insurance combines third-party liability coverage with own damage protection for the insured bike."},
    {"id": "motor-faq-4", "category": "motor", "question": "Which add-ons are useful for bike owners?", "answer": "Riders often look at zero depreciation roadside assistance return to invoice and consumables cover depending on bike age and usage."},
    {"id": "motor-faq-5", "category": "motor", "question": "Why should I renew bike insurance before it expires?", "answer": "Timely renewal helps avoid legal issues preserves continuity benefits and keeps you protected from accidents or theft without a gap."},
    {"id": "motor-faq-6", "category": "motor", "question": "What details are usually needed to get a bike insurance quote?", "answer": "You typically need the vehicle registration number or bike details plus previous policy information if you are renewing an existing cover."},
]


def fetch_url(url: str) -> str:
    if requests is None:
        raise RuntimeError("requests is not installed")
    response = requests.get(url, headers=HEADERS, timeout=20)
    response.raise_for_status()
    time.sleep(random.uniform(1, 3))
    return response.text


def clean_text(text: str) -> str:
    return re.sub(r"\s+", " ", text or "").strip()


def extract_live_faqs(category: str) -> List[Dict[str, str]]:
    if requests is None or BeautifulSoup is None:
        return []

    try:
        html = fetch_url(CATEGORY_URLS[category])
    except Exception:
        return []

    soup = BeautifulSoup(html, "html.parser")
    headings = soup.find_all(["h2", "h3"])[:10]
    faqs: List[Dict[str, str]] = []
    for index, heading in enumerate(headings, start=1):
        question = clean_text(heading.get_text(" "))
        if len(question) < 12:
            continue

        answer_parts: List[str] = []
        sibling = heading.find_next_sibling()
        while sibling and getattr(sibling, "name", None) not in {"h2", "h3"}:
            text = clean_text(sibling.get_text(" "))
            if text:
                answer_parts.append(text)
            sibling = sibling.find_next_sibling()

        answer = clean_text(" ".join(answer_parts))[:420]
        if answer:
            faqs.append(
                {
                    "id": f"{category}-live-faq-{index}",
                    "category": category,
                    "question": question,
                    "answer": answer,
                }
            )
        if len(faqs) >= 2:
            break
    return faqs


def dedupe_rows(rows: List[Dict[str, str]], key_fields: List[str]) -> List[Dict[str, str]]:
    seen = set()
    output: List[Dict[str, str]] = []
    for row in rows:
        key = tuple(row.get(field, "") for field in key_fields)
        if key in seen:
            continue
        seen.add(key)
        output.append(row)
    return output


def write_csv(rows: List[Dict[str, str]], path: Path, headers: List[str]) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if pd is not None:
        pd.DataFrame(rows, columns=headers).to_csv(path, index=False)
        return

    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=headers)
        writer.writeheader()
        for row in rows:
            writer.writerow({header: row.get(header, "") for header in headers})


def main() -> None:
    all_products = list(SEED_PRODUCTS)
    all_faqs: List[Dict[str, str]] = []

    print("Starting PolicyBazaar scrape...")
    for category in CATEGORY_URLS:
        live_faqs = extract_live_faqs(category)
        seed_faqs = [row for row in SEED_FAQS if row["category"] == category]
        merged_faqs = dedupe_rows(seed_faqs + live_faqs, ["category", "question"])[:8]
        category_products = [row for row in SEED_PRODUCTS if row["category"] == category]
        all_faqs.extend(merged_faqs)
        print(f"{category}: {len(category_products)} products, {len(merged_faqs)} faqs")

    write_csv(
        all_products,
        PRODUCTS_CSV,
        [
            "id",
            "category",
            "insurer_name",
            "plan_name",
            "key_benefits",
            "price_range",
            "pb_redirect_url",
        ],
    )
    write_csv(
        all_faqs,
        FAQS_CSV,
        ["id", "category", "question", "answer"],
    )

    print(f"Wrote {len(all_products)} products to {PRODUCTS_CSV}")
    print(f"Wrote {len(all_faqs)} FAQs to {FAQS_CSV}")


if __name__ == "__main__":
    main()
