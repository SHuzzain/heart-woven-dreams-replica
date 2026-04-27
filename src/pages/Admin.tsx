import { ChangeEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ImageUp, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GalleryPhoto, StoryMilestone, WeddingContent, useWeddingContent } from "@/components/wedding/content";

type SaveState = "idle" | "saved" | "error";

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const SectionTitle = ({ eyebrow, title }: { eyebrow: string; title: string }) => (
  <div className="mb-8">
    <p className="font-serif tracking-[0.3em] uppercase text-xs text-gold-deep">{eyebrow}</p>
    <h2 className="mt-2 font-serif text-4xl text-cocoa">{title}</h2>
  </div>
);

export default function Admin() {
  const { content, save, reset } = useWeddingContent();
  const [draft, setDraft] = useState<WeddingContent>(content);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  useEffect(() => {
    setDraft(content);
  }, [content]);

  const updateStory = (index: number, next: Partial<StoryMilestone>) => {
    setSaveState("idle");
    setDraft((current) => ({
      ...current,
      story: current.story.map((item, itemIndex) => (itemIndex === index ? { ...item, ...next } : item)),
    }));
  };

  const updateGallery = (index: number, next: Partial<GalleryPhoto>) => {
    setSaveState("idle");
    setDraft((current) => ({
      ...current,
      gallery: current.gallery.map((item, itemIndex) => (itemIndex === index ? { ...item, ...next } : item)),
    }));
  };

  const uploadStoryImage = async (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    updateStory(index, { image: await fileToDataUrl(file) });
  };

  const uploadGalleryImage = async (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    updateGallery(index, { src: await fileToDataUrl(file) });
  };

  const handleSave = () => {
    try {
      save(draft);
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  };

  const handleReset = () => {
    reset();
    setSaveState("idle");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-ivory via-ivory-warm to-blush/30 px-6 py-10 text-cocoa">
      <div className="mx-auto max-w-6xl">
        <div className="glass sticky top-4 z-20 mb-8 flex flex-col gap-4 rounded-3xl p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-serif tracking-[0.35em] uppercase text-xs text-gold-deep">Admin Panel</p>
            <h1 className="mt-1 font-serif text-4xl md:text-5xl">Edit Wedding Content</h1>
            <p className="mt-2 text-sm text-cocoa/65">
              Changes are saved in this browser and update the public page immediately.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="outline">
              <Link to="/">View Site</Link>
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button type="button" onClick={handleSave} className="bg-gradient-gold text-ivory hover:shadow-glow">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>

        {saveState === "saved" && (
          <div className="mb-8 rounded-2xl border border-gold/30 bg-gold/10 px-5 py-3 font-serif text-cocoa">
            Saved. Open the wedding page to see the updated story and gallery.
          </div>
        )}
        {saveState === "error" && (
          <div className="mb-8 rounded-2xl border border-rose/30 bg-rose/10 px-5 py-3 font-serif text-cocoa">
            Could not save. Try smaller images if browser storage is full.
          </div>
        )}

        <section className="glass mb-10 rounded-3xl p-6 md:p-8">
          <SectionTitle eyebrow="The Love Story Section" title="Story Chapters" />
          <div className="grid gap-6">
            {draft.story.map((item, index) => (
              <article key={index} className="grid gap-5 rounded-2xl border border-gold/20 bg-ivory/60 p-5 md:grid-cols-[220px_1fr]">
                <div>
                  <img src={item.image} alt={item.title} className="h-64 w-full rounded-xl object-cover shadow-soft md:h-72" />
                  <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-full border border-gold/30 bg-white/50 px-4 py-2 font-serif text-sm text-cocoa transition hover:bg-gold/10">
                    <ImageUp className="h-4 w-4 text-gold-deep" />
                    Upload Image
                    <input type="file" accept="image/*" className="sr-only" onChange={(event) => uploadStoryImage(index, event)} />
                  </label>
                </div>
                <div className="grid gap-4">
                  <div>
                    <label className="font-serif text-sm text-cocoa/70">Chapter Label</label>
                    <Input value={item.year} onChange={(event) => updateStory(index, { year: event.target.value })} />
                  </div>
                  <div>
                    <label className="font-serif text-sm text-cocoa/70">Title</label>
                    <Input value={item.title} onChange={(event) => updateStory(index, { title: event.target.value })} />
                  </div>
                  <div>
                    <label className="font-serif text-sm text-cocoa/70">Description</label>
                    <Textarea
                      value={item.description}
                      onChange={(event) => updateStory(index, { description: event.target.value })}
                      className="min-h-32"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="glass rounded-3xl p-6 md:p-8">
          <SectionTitle eyebrow="Moments in Frame Section" title="Gallery Photos" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {draft.gallery.map((item, index) => (
              <article key={index} className="rounded-2xl border border-gold/20 bg-ivory/60 p-4">
                <img src={item.src} alt={item.alt} className="h-56 w-full rounded-xl object-cover shadow-soft" />
                <div className="mt-4 grid gap-3">
                  <div>
                    <label className="font-serif text-sm text-cocoa/70">Photo Caption</label>
                    <Input value={item.alt} onChange={(event) => updateGallery(index, { alt: event.target.value })} />
                  </div>
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-full border border-gold/30 bg-white/50 px-4 py-2 font-serif text-sm text-cocoa transition hover:bg-gold/10">
                    <ImageUp className="h-4 w-4 text-gold-deep" />
                    Upload Photo
                    <input type="file" accept="image/*" className="sr-only" onChange={(event) => uploadGalleryImage(index, event)} />
                  </label>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
