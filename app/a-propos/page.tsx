import AboutSection from '@/components/Great-About'
import React from 'react'
import { SEO } from '@/components/SEO/Seo';

export const metadata = SEO({
  title: "Coach Big Mike | A propos",
  description: "Apprenez davantage sur le Coach Big Mike et ses différents domaines d'expertise.",
  canonical: "https://www.coachbigmikeacademy.com/a-propos",
});

const About = () => {
  return (
    <div>
      <AboutSection/>
    </div>
  )
}

export default About
