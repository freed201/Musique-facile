// src/config/courseImages.ts
export function getCourseImages(slug: string) {
    return {
      hero: `/images/cours/${slug}/hero.jpg`,
      getTimeline: (index: number) => `/images/cours/${slug}/timeline-${index}.jpg`,
      testimonial1: `/images/cours/${slug}/testimonial-1.jpg`,
      testimonial2: `/images/cours/${slug}/testimonial-2.jpg`,
      testimonial3: `/images/cours/${slug}/testimonial-3.jpg`,
      teacher1: `/images/cours/${slug}/teacher-1.jpg`,
      teacher2: `/images/cours/${slug}/teacher-2.jpg`,
      guest1: `/images/cours/${slug}/guest-1.jpg`,
      guest2: `/images/cours/${slug}/guest-2.jpg`,
      guest3: `/images/cours/${slug}/guest-3.jpg`
    };
  }
  