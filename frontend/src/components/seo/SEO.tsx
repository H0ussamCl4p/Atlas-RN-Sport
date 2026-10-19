import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  type?: 'website' | 'article';
  url?: string;
  image?: string;
  keywords?: string;
}

const DEFAULT_SEO = {
  title: 'Atlas — L\'intelligence tactique du football par l\'IA',
  description: 'Atlas transforme les matchs de football en intelligence tactique grâce à l\'IA. Analysez, visualisez et décidez mieux.',
  type: 'website' as const,
  url: 'https://atlas-football.com',
  image: '/og-image.png',
  keywords: 'football, analyse tactique, IA, intelligence artificielle, analyse vidéo, heatmap, performance sportive',
};

/**
 * SEO component for metadata management
 * 
 * Provides:
 * - Page title
 * - Meta description
 * - Open Graph tags
 * - Twitter Card tags
 * - Semantic HTML optimization
 * 
 * @example
 * <SEO 
 *   title="Analyses - Atlas"
 *   description="Consultez vos analyses tactiques"
 * />
 */
export function SEO({
  title = DEFAULT_SEO.title,
  description = DEFAULT_SEO.description,
  type = DEFAULT_SEO.type,
  url = DEFAULT_SEO.url,
  image = DEFAULT_SEO.image,
  keywords = DEFAULT_SEO.keywords,
}: SEOProps) {
  // Construct full title with site name
  const fullTitle = title === DEFAULT_SEO.title 
    ? title 
    : `${title} | Atlas`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Atlas" />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#000000" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="French" />
      <meta name="author" content="Atlas" />
      
      {/* Viewport for responsive design */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
}

// Pre-configured SEO for common pages
export const PageSEO = {
  Landing: () => (
    <SEO 
      title={DEFAULT_SEO.title}
      description={DEFAULT_SEO.description}
      url={DEFAULT_SEO.url}
    />
  ),
  
  Dashboard: () => (
    <SEO 
      title="Dashboard"
      description="Tableau de bord de vos analyses tactiques et statistiques de performance."
      url={`${DEFAULT_SEO.url}/dashboard`}
    />
  ),
  
  Analyses: () => (
    <SEO 
      title="Analyses"
      description="Consultez toutes vos analyses tactiques de matchs de football."
      url={`${DEFAULT_SEO.url}/analyses`}
    />
  ),
  
  Upload: () => (
    <SEO 
      title="Importer un match"
      description="Importez une vidéo de match pour l'analyser avec l'IA d'Atlas."
      url={`${DEFAULT_SEO.url}/upload`}
    />
  ),
  
  Settings: () => (
    <SEO 
      title="Paramètres"
      description="Gérez votre compte et vos préférences Atlas."
      url={`${DEFAULT_SEO.url}/settings`}
    />
  ),
};
