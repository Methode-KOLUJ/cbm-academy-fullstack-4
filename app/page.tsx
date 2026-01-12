import About from "@/components/home/About";
import HeroBox from "@/components/home/hero";
import React from "react";
import { SEO } from "@/components/SEO/Seo";

export const metadata = SEO({
  title: "Coach Big Mike | Accueil",
  description: "Bienvenu sur la plateforme Coach BigMike Academy, site officiel du Coach Big Mike.",
  canonical: "https://www.coachbigmikeacademy.com/",
});

const Home = () => {
  return (
    <div>
      <HeroBox />
      <About />
    </div>
  );
};

export default Home;
