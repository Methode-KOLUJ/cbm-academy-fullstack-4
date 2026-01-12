import React from 'react'
import Albums from '@/components/Album'
import { SEO } from '@/components/SEO/Seo';

export const metadata = SEO({
  title: "Coach Big Mike | Album",
  description: "Visitez notre historique photographique des conférences passées.",
  canonical: "https://www.coachbigmikeacademy.com/album",
});


const Album = () => {
  return (
    <div>
      <Albums/>
    </div>
  )
}

export default Album
