// IMPORTANT: Replace with your own domain address - it's used for SEO in meta tags and schema
const baseURL = "https://grimoire.app";

// Import and set font for each variant
import { Inter } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";

const primaryFont = Inter({
  variable: "--font-primary",
  subsets: ["latin"],
  display: "swap",
});

const monoFont = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});

const font = {
  primary: primaryFont,
  secondary: primaryFont,
  tertiary: primaryFont,
  code: monoFont,
};

// default customization applied to the HTML in the main layout.tsx
const style = {
  theme: "dark", // dark | light - not needed when using ThemeProvider
  neutral: "slate", // sand | gray | slate
  brand: "blue", // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan
  accent: "indigo", // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan
  solid: "contrast", // color | contrast | inverse
  solidStyle: "flat", // flat | plastic
  border: "playful", // rounded | playful | conservative
  surface: "filled", // filled | translucent
  transition: "all", // all | micro | macro
  scaling: "100", // 90 | 95 | 100 | 105 | 110
};

const effects = {
  mask: {
    cursor: false,
    x: 100,
    y: 0,
    radius: 100,
  },
  gradient: {
    display: true,
    opacity: 90,
    x: 100,
    y: 60,
    width: 70,
    height: 50,
    tilt: -40,
    colorStart: "accent-background-strong",
    colorEnd: "page-background",
  },
  dots: {
    display: true,
    opacity: 20,
    size: "2",
    color: "brand-on-background-weak",
  },
  grid: {
    display: true,
    opacity: 100,
    color: "accent-alpha-weak",
    width: "0.25rem",
    height: "0.25rem",
  },
  lines: {
    display: false,
    opacity: 100,
    color: "neutral-alpha-weak",
    size: "16",
    thickness: 1,
    angle: 45,
  },
};

// metadata for pages
const meta = {
  home: {
    path: "/",
    title: "Grimoire",
    description: "Task management and system logs for your projects.",
    image: "/images/og/home.jpg",
    canonical: "https://grimoire.app",
    robots: "index,follow",
    alternates: [
      { href: "https://grimoire.app", hrefLang: "en" },
    ],
  },
  // add more routes and reference them in page.tsx
};

// default schema data
const schema = {
  logo: "",
  type: "Organization",
  name: "Grimoire",
  description: meta.home.description,
  email: "info@grimoire.app",
};

// social links
const social = {
  twitter: "https://www.twitter.com/grimoire",
  linkedin: "https://www.linkedin.com/company/grimoire/",
  github: "https://github.com/grimoire",
};

export { baseURL, font, style, meta, schema, social, effects };
