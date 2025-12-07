import { getAllTreks } from '@/lib/data'
import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const treks = getAllTreks()

  const pages = [
    `${baseUrl}/`,
    `${baseUrl}/treks`,
    `${baseUrl}/inquiry`,
  ]

  const trekUrls = treks.map((t) => `${baseUrl}/treks/${t.slug}`)

  const urls = pages.concat(trekUrls)

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
      .map((u) => {
        return `<url><loc>${u}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`
      })
      .join('')}
  </urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
