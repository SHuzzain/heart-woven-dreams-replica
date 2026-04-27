import { useCallback, useEffect, useState } from "react";
import story1 from "@/assets/story-1.jpg";
import story2 from "@/assets/story-2.jpg";
import story3 from "@/assets/story-3.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";

export type StoryMilestone = {
  year: string;
  title: string;
  description: string;
  image: string;
};

export type GalleryPhoto = {
  src: string;
  alt: string;
  span?: string;
};

export type WeddingContent = {
  story: StoryMilestone[];
  gallery: GalleryPhoto[];
};

const STORAGE_KEY = "heart-woven-dreams-content";
const CONTENT_UPDATED_EVENT = "wedding-content-updated";

export const defaultWeddingContent: WeddingContent = {
  story: [
    {
      year: "Spring 2019",
      title: "First Glance",
      description: "A chance meeting at a small bookshop in Florence — neither expected the day would change everything.",
      image: story1,
    },
    {
      year: "Summer 2021",
      title: "Under the Stars",
      description: "A candlelit dinner in a Tuscan garden, where two became inseparable.",
      image: story2,
    },
    {
      year: "Winter 2024",
      title: "The Promise",
      description: "On a snowfall morning, a ring, a question — and a forever 'yes'.",
      image: story3,
    },
  ],
  gallery: [
    { src: g1, alt: "Bridal bouquet", span: "row-span-2" },
    { src: g2, alt: "Reception table" },
    { src: g3, alt: "Floral arch", span: "row-span-2" },
    { src: g4, alt: "Exchanging rings" },
    { src: g5, alt: "Champagne toast" },
    { src: g6, alt: "First dance", span: "col-span-2" },
  ],
};

const mergeContent = (content?: Partial<WeddingContent> | null): WeddingContent => ({
  story: defaultWeddingContent.story.map((item, index) => ({
    ...item,
    ...(content?.story?.[index] ?? {}),
  })),
  gallery: defaultWeddingContent.gallery.map((item, index) => ({
    ...item,
    ...(content?.gallery?.[index] ?? {}),
  })),
});

export const loadWeddingContent = () => {
  if (typeof window === "undefined") return defaultWeddingContent;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? mergeContent(JSON.parse(stored) as Partial<WeddingContent>) : defaultWeddingContent;
  } catch {
    return defaultWeddingContent;
  }
};

export const saveWeddingContent = (content: WeddingContent) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  window.dispatchEvent(new CustomEvent(CONTENT_UPDATED_EVENT));
};

export const resetWeddingContent = () => {
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(CONTENT_UPDATED_EVENT));
};

export function useWeddingContent() {
  const [content, setContent] = useState<WeddingContent>(() => loadWeddingContent());

  useEffect(() => {
    const reload = () => setContent(loadWeddingContent());
    window.addEventListener("storage", reload);
    window.addEventListener(CONTENT_UPDATED_EVENT, reload);

    return () => {
      window.removeEventListener("storage", reload);
      window.removeEventListener(CONTENT_UPDATED_EVENT, reload);
    };
  }, []);

  const save = useCallback((nextContent: WeddingContent) => {
    setContent(nextContent);
    saveWeddingContent(nextContent);
  }, []);

  const reset = useCallback(() => {
    resetWeddingContent();
    setContent(defaultWeddingContent);
  }, []);

  return { content, save, reset };
}
