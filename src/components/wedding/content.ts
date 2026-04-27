import { useCallback, useEffect, useRef, useState } from "react";
import story1 from "@/assets/story-1.jpg";
import story2 from "@/assets/story-2.jpg";
import story3 from "@/assets/story-3.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";
import { supabase } from "@/integrations/supabase/client";

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

const CACHE_KEY = "heart-woven-dreams-content-cache";
const STORAGE_BUCKET = "wedding-content";

export const defaultWeddingContent: WeddingContent = {
  story: [
    {
      year: "Spring 2019",
      title: "First Glance",
      description:
        "A chance meeting at a small bookshop in Florence — neither expected the day would change everything.",
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

const readCache = (): WeddingContent => {
  if (typeof window === "undefined") return defaultWeddingContent;
  try {
    const stored = window.localStorage.getItem(CACHE_KEY);
    return stored ? mergeContent(JSON.parse(stored) as Partial<WeddingContent>) : defaultWeddingContent;
  } catch {
    return defaultWeddingContent;
  }
};

const writeCache = (content: WeddingContent) => {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(content));
  } catch {
    // ignore quota errors – the DB is the source of truth
  }
};

const isMissingTable = (error: { code?: string; message?: string } | null) => {
  if (!error) return false;
  if (error.code === "42P01" || error.code === "PGRST205") return true;
  return /relation .* does not exist|Could not find the table/i.test(error.message ?? "");
};

let warnedAboutMissingTables = false;

export async function fetchWeddingContent(): Promise<WeddingContent> {
  const [storyResult, galleryResult] = await Promise.all([
    supabase
      .from("wedding_story")
      .select("position, year, title, description, image_url")
      .order("position", { ascending: true }),
    supabase
      .from("wedding_gallery")
      .select("position, alt, image_url, span")
      .order("position", { ascending: true }),
  ]);

  if (isMissingTable(storyResult.error) || isMissingTable(galleryResult.error)) {
    if (!warnedAboutMissingTables) {
      warnedAboutMissingTables = true;
      console.info(
        "[wedding-content] Supabase tables not found yet. Showing bundled defaults until the migration is applied.",
      );
    }
    return defaultWeddingContent;
  }

  if (storyResult.error) throw storyResult.error;
  if (galleryResult.error) throw galleryResult.error;

  const next: WeddingContent = {
    story: defaultWeddingContent.story.map((fallback, index) => {
      const row = storyResult.data?.find((entry) => entry.position === index);
      if (!row) return fallback;
      return {
        year: row.year,
        title: row.title,
        description: row.description,
        image: row.image_url,
      };
    }),
    gallery: defaultWeddingContent.gallery.map((fallback, index) => {
      const row = galleryResult.data?.find((entry) => entry.position === index);
      if (!row) return fallback;
      return {
        alt: row.alt,
        src: row.image_url,
        span: row.span ?? fallback.span,
      };
    }),
  };

  writeCache(next);
  return next;
}

export async function saveWeddingContent(content: WeddingContent) {
  const storyRows = content.story.map((item, position) => ({
    position,
    year: item.year,
    title: item.title,
    description: item.description,
    image_url: item.image,
  }));

  const galleryRows = content.gallery.map((item, position) => ({
    position,
    alt: item.alt,
    image_url: item.src,
    span: item.span ?? null,
  }));

  const [storyError, galleryError] = await Promise.all([
    supabase.from("wedding_story").upsert(storyRows, { onConflict: "position" }),
    supabase.from("wedding_gallery").upsert(galleryRows, { onConflict: "position" }),
  ]).then((results) => results.map((result) => result.error));

  if (storyError) throw storyError;
  if (galleryError) throw galleryError;

  writeCache(content);
}

export async function uploadContentImage(file: File): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const safeName = file.name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9-_]+/gi, "-")
    .slice(0, 40);
  const path = `${Date.now()}-${safeName || "image"}.${extension}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });

  if (error) throw error;

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export function useWeddingContent() {
  const [content, setContent] = useState<WeddingContent>(() => readCache());
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  const refresh = useCallback(async () => {
    try {
      const next = await fetchWeddingContent();
      if (mounted.current) setContent(next);
    } catch (error) {
      console.warn("Failed to load wedding content from Supabase:", error);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    refresh();

    const channelName = `wedding-content-${Math.random().toString(36).slice(2)}`;
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wedding_story" },
        () => refresh(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wedding_gallery" },
        () => refresh(),
      )
      .subscribe();

    return () => {
      mounted.current = false;
      supabase.removeChannel(channel);
    };
  }, [refresh]);

  return { content, loading, refresh };
}
