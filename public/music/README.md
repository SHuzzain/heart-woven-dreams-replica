# Wedding background music

Drop your background music MP3 here as **`wedding-bgm.mp3`** — that's the
filename `MusicToggle.tsx` looks for at runtime.

```
public/music/wedding-bgm.mp3
```

## Recommended royalty-free Tamil / Indian romantic tracks

All tracks below are free to use under the Pixabay Content License — no
attribution required, no copyright strikes. Click the link, hit
**Free download**, rename the file to `wedding-bgm.mp3`, and drop it in
this folder.

| Track | Vibe | Length | Pixabay link |
| --- | --- | --- | --- |
| **Love BGM (No Copyright)** by kamaleshsiddumusic | Tamil love BGM | 0:28 (loops) | <https://pixabay.com/music/acoustic-group-love-bgm-no-copyright-music-113843/> |
| **Indian Wedding** | Indian folk wedding instrumental | 2:09 | <https://pixabay.com/music/folk-indian-wedding-490659/> |
| **Indian Flute and Tabla New Tune** | Soft flute + tabla | 2:16 | <https://pixabay.com/music/world-indian-flute-and-tabla-new-tune-remastered-277266/> |
| **Indian Classical Flute & Tabla** | Short classical flute loop | 0:30 | <https://pixabay.com/music/india-indian-classical-flute-amp-tabla-140472/> |
| **Grand Bollywood Wedding Anthem** | Big Bollywood-style anthem | 2:33 | <https://pixabay.com/music/wedding-grand-bollywood-wedding-anthem-404795/> |

## Using your own audio

Any MP3 (or M4A renamed to `.mp3`) works. If you want to use a Tamil film
song you love, just save it here as `wedding-bgm.mp3` — note that for a
public site, prefer royalty-free music to avoid copyright issues.

## After adding the file

```bash
pnpm dev      # local preview
git add public/music/wedding-bgm.mp3
git commit -m "chore(music): add Tamil romantic BGM"
git push      # Vercel auto-deploys
```

The `MusicToggle` floating button (bottom-right corner of the page) will
play your track on a soft loop at 35% volume when the user taps it.
