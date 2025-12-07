import Head from 'next/head'
import React from 'react'

type MetaProps = {
  title?: string
  description?: string
  url?: string
  image?: string
}

export default function Meta({ title, description, url, image }: MetaProps) {
  const site = process.env.NEXT_PUBLIC_SITE_NAME ?? 'TrekMapper'
  const pageTitle = title ? `${title} | ${site}` : site

  return (
    <Head>
      <title>{pageTitle}</title>
      {description && <meta name="description" content={description} />}
      {url && <meta property="og:url" content={url} />}
      {pageTitle && <meta property="og:title" content={pageTitle} />}
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
    </Head>
  )
}
