import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://restaurantemarques.es');

  return [
    { url: base,                      lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/carta`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/reservations`,    lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/nosotros`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/contacto`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/privacidad`,      lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${base}/aviso-legal`,     lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.2 },
  ];
}
