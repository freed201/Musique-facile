// Utilitaire pour générer le schema.org des vidéos
export function generateVideoSchema(videos: any[], datePublished: string) {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": videos.map((video, index) => ({
        "@type": "VideoObject",
        "position": index + 1,
        "name": video.title,
        "url": video.url,
        "thumbnailUrl": `https://img.youtube.com/vi/${getYouTubeId(video.url)}/maxresdefault.jpg`,
        "uploadDate": datePublished
      }))
    };
  }
  
  // Extraire l'ID YouTube d'une URL
  export function getYouTubeId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }