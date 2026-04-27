import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ImageUp, Loader2, LogOut, RotateCcw, Save } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import {
  GalleryPhoto,
  StoryMilestone,
  WeddingContent,
  defaultWeddingContent,
  fetchWeddingContent,
  saveWeddingContent,
  uploadContentImage,
  useWeddingContent,
} from "@/components/wedding/content";

type Status =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved" }
  | { kind: "error"; message: string };

const SectionTitle = ({ eyebrow, title }: { eyebrow: string; title: string }) => (
  <div className="mb-8">
    <p className="font-serif tracking-[0.3em] uppercase text-xs text-gold-deep">{eyebrow}</p>
    <h2 className="mt-2 font-serif text-4xl text-cocoa">{title}</h2>
  </div>
);

const SignInPanel = ({ onSignedIn }: { onSignedIn: () => void }) => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { error: authError } =
        mode === "signin"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });
      if (authError) throw authError;
      onSignedIn();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-ivory via-ivory-warm to-blush/30 px-6 py-16 text-cocoa">
      <div className="mx-auto max-w-md">
        <div className="glass rounded-3xl p-8">
          <p className="font-serif tracking-[0.35em] uppercase text-xs text-gold-deep">Admin Access</p>
          <h1 className="mt-1 font-serif text-3xl">Sign in to edit</h1>
          <p className="mt-2 text-sm text-cocoa/65">
            Use your admin email and password. New admins can create an account once and reuse it everywhere.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="font-serif text-sm text-cocoa/70">Email</label>
              <Input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div>
              <label className="font-serif text-sm text-cocoa/70">Password</label>
              <Input
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            {error && (
              <div className="rounded-xl border border-rose/30 bg-rose/10 px-4 py-2 text-sm">{error}</div>
            )}

            <Button type="submit" disabled={busy} className="w-full bg-gradient-gold text-ivory hover:shadow-glow">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {mode === "signin" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <button
            type="button"
            className="mt-4 w-full font-serif text-sm text-cocoa/70 underline-offset-4 hover:underline"
            onClick={() => {
              setError(null);
              setMode((current) => (current === "signin" ? "signup" : "signin"));
            }}
          >
            {mode === "signin" ? "Create an admin account instead" : "Already have an account? Sign in"}
          </button>

          <div className="mt-6 text-center">
            <Link to="/" className="font-serif text-sm text-gold-deep hover:underline">
              Back to wedding site
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const { content, loading } = useWeddingContent();
  const [draft, setDraft] = useState<WeddingContent>(content);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setDraft(content);
  }, [content]);

  const updateStory = (index: number, next: Partial<StoryMilestone>) => {
    setStatus({ kind: "idle" });
    setDraft((current) => ({
      ...current,
      story: current.story.map((item, itemIndex) => (itemIndex === index ? { ...item, ...next } : item)),
    }));
  };

  const updateGallery = (index: number, next: Partial<GalleryPhoto>) => {
    setStatus({ kind: "idle" });
    setDraft((current) => ({
      ...current,
      gallery: current.gallery.map((item, itemIndex) => (itemIndex === index ? { ...item, ...next } : item)),
    }));
  };

  const handleStoryUpload = async (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const id = `story-${index}`;
    setUploadingId(id);
    try {
      const url = await uploadContentImage(file);
      updateStory(index, { image: url });
    } catch (caught) {
      setStatus({ kind: "error", message: caught instanceof Error ? caught.message : "Upload failed" });
    } finally {
      setUploadingId(null);
      event.target.value = "";
    }
  };

  const handleGalleryUpload = async (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const id = `gallery-${index}`;
    setUploadingId(id);
    try {
      const url = await uploadContentImage(file);
      updateGallery(index, { src: url });
    } catch (caught) {
      setStatus({ kind: "error", message: caught instanceof Error ? caught.message : "Upload failed" });
    } finally {
      setUploadingId(null);
      event.target.value = "";
    }
  };

  const handleSave = async () => {
    setStatus({ kind: "saving" });
    try {
      await saveWeddingContent(draft);
      setStatus({ kind: "saved" });
    } catch (caught) {
      setStatus({ kind: "error", message: caught instanceof Error ? caught.message : "Save failed" });
    }
  };

  const handleResetDefaults = async () => {
    setStatus({ kind: "saving" });
    try {
      await saveWeddingContent(defaultWeddingContent);
      const fresh = await fetchWeddingContent();
      setDraft(fresh);
      setStatus({ kind: "saved" });
    } catch (caught) {
      setStatus({ kind: "error", message: caught instanceof Error ? caught.message : "Reset failed" });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (!authReady) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ivory text-cocoa">
        <Loader2 className="h-6 w-6 animate-spin text-gold-deep" />
      </main>
    );
  }

  if (!session) {
    return <SignInPanel onSignedIn={() => undefined} />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-ivory via-ivory-warm to-blush/30 px-6 py-10 text-cocoa">
      <div className="mx-auto max-w-6xl">
        <div className="glass sticky top-4 z-20 mb-8 flex flex-col gap-4 rounded-3xl p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-serif tracking-[0.35em] uppercase text-xs text-gold-deep">Admin Panel</p>
            <h1 className="mt-1 font-serif text-4xl md:text-5xl">Edit Wedding Content</h1>
            <p className="mt-2 text-sm text-cocoa/65">
              Signed in as <span className="text-cocoa">{session.user.email}</span>. Saved changes appear instantly for every visitor.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="outline">
              <Link to="/">View Site</Link>
            </Button>
            <Button type="button" variant="outline" onClick={handleResetDefaults} disabled={status.kind === "saving"}>
              <RotateCcw className="h-4 w-4" />
              Reset to Defaults
            </Button>
            <Button type="button" variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={status.kind === "saving"}
              className="bg-gradient-gold text-ivory hover:shadow-glow"
            >
              {status.kind === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </Button>
          </div>
        </div>

        {loading && (
          <div className="mb-6 rounded-2xl border border-gold/20 bg-ivory/60 px-5 py-3 font-serif text-sm text-cocoa/70">
            Loading current content from the database…
          </div>
        )}

        {status.kind === "saved" && (
          <div className="mb-6 rounded-2xl border border-gold/30 bg-gold/10 px-5 py-3 font-serif text-cocoa">
            Saved. The wedding site is updated for every visitor.
          </div>
        )}
        {status.kind === "error" && (
          <div className="mb-6 rounded-2xl border border-rose/40 bg-rose/10 px-5 py-3 font-serif text-cocoa">
            {status.message}
          </div>
        )}

        <section className="glass mb-10 rounded-3xl p-6 md:p-8">
          <SectionTitle eyebrow="The Love Story Section" title="Story Chapters" />
          <div className="grid gap-6">
            {draft.story.map((item, index) => {
              const id = `story-${index}`;
              const isUploading = uploadingId === id;
              return (
                <article
                  key={id}
                  className="grid gap-5 rounded-2xl border border-gold/20 bg-ivory/60 p-5 md:grid-cols-[220px_1fr]"
                >
                  <div>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-64 w-full rounded-xl object-cover shadow-soft md:h-72"
                    />
                    <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-full border border-gold/30 bg-white/50 px-4 py-2 font-serif text-sm text-cocoa transition hover:bg-gold/10">
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-gold-deep" />
                      ) : (
                        <ImageUp className="h-4 w-4 text-gold-deep" />
                      )}
                      {isUploading ? "Uploading…" : "Upload Image"}
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        disabled={isUploading}
                        onChange={(event) => handleStoryUpload(index, event)}
                      />
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
              );
            })}
          </div>
        </section>

        <section className="glass rounded-3xl p-6 md:p-8">
          <SectionTitle eyebrow="Moments in Frame Section" title="Gallery Photos" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {draft.gallery.map((item, index) => {
              const id = `gallery-${index}`;
              const isUploading = uploadingId === id;
              return (
                <article key={id} className="rounded-2xl border border-gold/20 bg-ivory/60 p-4">
                  <img src={item.src} alt={item.alt} className="h-56 w-full rounded-xl object-cover shadow-soft" />
                  <div className="mt-4 grid gap-3">
                    <div>
                      <label className="font-serif text-sm text-cocoa/70">Photo Caption</label>
                      <Input
                        value={item.alt}
                        onChange={(event) => updateGallery(index, { alt: event.target.value })}
                      />
                    </div>
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-full border border-gold/30 bg-white/50 px-4 py-2 font-serif text-sm text-cocoa transition hover:bg-gold/10">
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-gold-deep" />
                      ) : (
                        <ImageUp className="h-4 w-4 text-gold-deep" />
                      )}
                      {isUploading ? "Uploading…" : "Upload Photo"}
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        disabled={isUploading}
                        onChange={(event) => handleGalleryUpload(index, event)}
                      />
                    </label>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
