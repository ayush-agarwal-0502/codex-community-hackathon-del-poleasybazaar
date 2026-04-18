import {
  Activity,
  Bike,
  Car,
  HeartHandshake,
  ShieldPlus,
  Sparkles,
} from "lucide-react";

export const categoryMeta = {
  health: {
    slug: "health",
    label: "Health",
    title: "Health Insurance",
    icon: HeartHandshake,
    accent: "var(--accent-health)",
    glow: "shadow-[0_0_50px_rgba(0,229,192,0.25)]",
    intro:
      "Learn how health cover, premiums, and hospital networks work without decoding a wall of insurance jargon.",
    landingUrl: "https://www.policybazaar.com/health-insurance/",
    calculatorUrl:
      "https://www.policybazaar.com/health-insurance/health-insurance-premium-calculator/",
  },
  life: {
    slug: "life",
    label: "Life",
    title: "Term Life Insurance",
    icon: ShieldPlus,
    accent: "var(--accent-life)",
    glow: "shadow-[0_0_50px_rgba(255,179,71,0.25)]",
    intro:
      "Understand why term insurance matters, what affects premiums, and how life cover can protect your family.",
    landingUrl: "https://www.policybazaar.com/term-insurance/",
    calculatorUrl:
      "https://www.policybazaar.com/term-insurance/2-crore-term-insurance-calculator/",
  },
  car: {
    slug: "car",
    label: "Car",
    title: "Car Insurance",
    icon: Car,
    accent: "var(--accent-car)",
    glow: "shadow-[0_0_50px_rgba(74,158,255,0.25)]",
    intro:
      "See how renewals, premium calculators, and add-ons work before you jump into a purchase flow.",
    landingUrl: "https://www.policybazaar.com/car-insurance/",
    calculatorUrl:
      "https://www.policybazaar.com/motor-insurance/car-insurance-calculator/",
  },
  motor: {
    slug: "motor",
    label: "Motor",
    title: "Two Wheeler Insurance",
    icon: Bike,
    accent: "var(--accent-motor)",
    glow: "shadow-[0_0_50px_rgba(181,106,255,0.25)]",
    intro:
      "Get the basics on bike coverage, renewals, and premium estimates in a simpler self-serve format.",
    landingUrl: "https://www.policybazaar.com/two-wheeler-insurance/",
    calculatorUrl: "https://www.policybazaar.com/two-wheeler-insurance/",
  },
};

export const calculatorCards = [
  {
    id: "health-calc",
    title: "Health Premium Calculator",
    description:
      "Estimate indicative mediclaim premiums based on members, age, and coverage preferences.",
    category: "health",
    icon: Activity,
    url: categoryMeta.health.calculatorUrl,
  },
  {
    id: "life-calc",
    title: "Term Insurance Calculator",
    description:
      "Jump into PolicyBazaar's premium estimator for life cover and compare likely premium ranges.",
    category: "life",
    icon: ShieldPlus,
    url: categoryMeta.life.calculatorUrl,
  },
  {
    id: "car-calc",
    title: "Car Insurance Calculator",
    description:
      "Check indicative car insurance premium ranges using vehicle details like RTO and model.",
    category: "car",
    icon: Car,
    url: categoryMeta.car.calculatorUrl,
  },
  {
    id: "motor-calc",
    title: "Bike Insurance Flow",
    description:
      "Continue to PolicyBazaar's two-wheeler flow for bike premium discovery and renewal options.",
    category: "motor",
    icon: Sparkles,
    url: categoryMeta.motor.calculatorUrl,
  },
];

export const categoryOrder = ["health", "life", "car", "motor"];
