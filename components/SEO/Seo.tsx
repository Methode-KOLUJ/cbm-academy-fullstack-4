// components/SEO.ts
import type { Metadata } from "next";

export function DefaultSEO(): Metadata {
  return {
    title: {
      default: "Coach BigMike Academy - Officiel",
      template: "Coach BigMike Academy | %s",
    },
    description:
      "Bienvenu sur la plateforme Coach BigMike Academy, site officiel du Coach Big Mike.",
    keywords: ["Coaching", "Assistance", "Développement personnel", "Formation", "Entreprenariat"],
    metadataBase: new URL("https://www.coachbigmikeacademy.com"),
    authors: [{ name: "ONG SEED", url: "https://www.coachbigmikeacademy.com" }],
    creator: "Coach BigMike Academy",
    publisher: "Coach BigMike Academy",

    openGraph: {
      title: "Coach BigMike Academy - Officiel",
      description:
        "Bienvenu sur la plateforme Coach BigMike Academy, site officiel du Coach Big Mike.",
      url: "https://www.coachbigmikeacademy.com",
      siteName: "Coach BigMike Academy",
      images: [
        {
          url: "https://www.coachbigmikeacademy.com/Og.jpg",
          width: 1200,
          height: 630,
          alt: "Coach BigMike Academy - Officiel",
        },
      ],
      locale: "fr_FR",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      site: "@CoachBigMikeAcademy",
      creator: "@CoachBigMikeAcademy",
      title: "ONG SEED - Le site officiel",
      description:
        "Bienvenu sur la plateforme Coach BigMike Academy, site officiel du Coach Big Mike.",
      images: ["https://www.coachbigmikeacademy.com/Twitter.jpg"],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

// ---------------------------------------------

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
}

export function SEO({ title, description, canonical }: SEOProps): Metadata {
  const base = DefaultSEO();

  return {
    title: title || base.title as any,
    description: description || base.description,

    openGraph: {
      ...base.openGraph,
      title: title || base.openGraph?.title,
      description: description || base.openGraph?.description,
      url: canonical || base.openGraph?.url,
    },

    twitter: {
      ...base.twitter,
      title: title || base.twitter?.title,
      description: description || base.twitter?.description,
      images: base.twitter?.images,
    },

    alternates: {
      canonical: canonical || base.metadataBase?.toString(),
    },
  };
}
