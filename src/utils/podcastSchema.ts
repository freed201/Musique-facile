// Utilitaire pour générer le schema.org des podcasts
export function generatePodcastSchema(podcast: any, datePublished: string) {
    return {
      "@context": "https://schema.org",
      "@type": "PodcastEpisode",
      "name": podcast.title,
      "url": podcast.url,
      "datePublished": datePublished,
      "audio": {
        "@type": "AudioObject",
        "url": podcast.url
      }
    };
  }