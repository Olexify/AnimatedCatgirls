<h1 align="center">🐾 Animated Catgirls</h1>

<p align="center">
  <i>A self-hosted, animated, config-driven visitor counter for your GitHub profile.</i><br/>
  Booru-style catgirls holding your visit count. Because static counters are boring.
</p>

<p align="center">
  <img src="https://animated-catgirls.vercel.app/api/counter" width="425" alt="Animated Catgirl Counter" />
</p>

<p align="center">
  <sub>Live demo counter powered by Vercel + Upstash Redis (Use Google Chrome)</sub>
</p>

<br>

<p align="center">
  <strong>Overview</strong>
</p>

<p align="center">
  <code>count.getloli.com</code> gives you a <b>static</b> anime counter.
</p>

<p align="center">
  This gives you an <b>animated</b> one - your own catgirl GIFs, your own server, your own rules.
</p>

```txt
🚀 Loading AnimatedCatgirls.exe...

[OK] Fetching visit count from Redis
[OK] Padding number with catgirls
[OK] Rendering SVG
[WARN] Catgirls became self-aware (working as intended)
```

<p align="center">
  You host it yourself on Vercel, store the count in Upstash Redis, and tweak everything through one config file.
</p>

---

<p align="center"><strong><i>Digit Showcase</i></strong></p>
<p align="center">
  <img width="40" height="89" alt="0" src="https://github.com/user-attachments/assets/d0b116fe-8fa8-4bda-aa57-2576653407c9" />
  <img width="40" height="89" alt="1" src="https://github.com/user-attachments/assets/27cf5157-a926-4437-8ea5-7e2f706dd5f8" />
  <img width="40" height="89" alt="2" src="https://github.com/user-attachments/assets/a299c41a-bdf8-4546-91a4-31bfc5584896" />
  <img width="40" height="89" alt="3" src="https://github.com/user-attachments/assets/338f54c8-62be-4283-bcdc-04d634262598" />
  <img width="40" height="89" alt="4" src="https://github.com/user-attachments/assets/f09f6a38-1d75-45a3-9a80-945632e2797e" />
  <img width="40" height="89" alt="5" src="https://github.com/user-attachments/assets/a55ccb2d-a7e1-4ab1-8a17-918e52dfd6bb" />
  <img width="40" height="89" alt="6" src="https://github.com/user-attachments/assets/cd61ec35-48ec-4235-b3dd-9cbc4f3fbbba" />
  <img width="40" height="89" alt="7" src="https://github.com/user-attachments/assets/191aa33e-b23c-42d0-afa5-9719a6989915" />
  <img width="40" height="89" alt="8" src="https://github.com/user-attachments/assets/98672b7e-885d-41aa-ab1a-884d4046fb9d" />
  <img width="40" height="89" alt="9" src="https://github.com/user-attachments/assets/9e3b0ece-51df-4aa2-978e-001a37344b60" />
</p>
<p align="center">
  <sub><i>The 10 animated digit sprites used to build the live counter</i></sub>
</p>

---

## Features

* 🐈 Animated digit GIFs (0–9) - bring your own art
* ⚙️ Everything configurable via `counter.config.json`
* 🎨 Opacity, brightness, contrast, saturation, shadow, scale, spacing
* 🔢 Adjustable digit count
* 📈 Counting modes: `strict`, `unique`, `aggressive`
* ☁️ Fully self-hosted on Vercel (free tier)
* 🧠 Count persisted in Upstash Redis (free tier)
* 🔒 No third-party tracking

---

## 🛠️ How it works

```txt
GitHub README loads image
        ↓
Vercel runs api/counter.js
        ↓
Redis increments / reads the count
        ↓
Number gets padded → matched to digit GIFs
        ↓
GIFs fetched + embedded into one SVG
        ↓
Returned as image/svg+xml → catgirls appear
```

---

## 📦 Project structure

```txt
AnimatedCatgirls/
├── api/
│   └── counter.js        ← the serverless function (JavaScript!)
├── counter.config.json   ← all your settings (JSON!)
├── package.json
├── vercel.json
└── README.md             ← you are here
```

> ⚠️ **Don't mix these up.** `counter.js` is JavaScript. `counter.config.json` is JSON.  
> Pasting JSON into the `.js` file = instant 500 crash. Ask me how I know. 💀

---

## 🚀 Setup

### 1) Get your digit assets 🎨

You need 10 images or GIFs - one per digit `0`–`9`.

Quick way: drag images into any GitHub issue/comment → GitHub gives you stable `user-attachments` URLs.

Then map them in `api/counter.js`:

```js
const DIGITS = {
  '0': 'https://github.com/user-attachments/assets/your-0-url',
  '1': 'https://github.com/user-attachments/assets/your-1-url',
  // ...
  '9': 'https://github.com/user-attachments/assets/your-9-url'
};
```

### 2) Create Upstash Redis 🗄️

- Go to [https://upstash.com](https://upstash.com) → Create Redis DB (free tier)
- Copy from the **REST API** section:
  - `UPSTASH_REDIS_REST_URL`
  - `UPSTASH_REDIS_REST_TOKEN`

### 3) Deploy to Vercel ▲

- Go to [https://vercel.com/new](https://vercel.com/new) → Import this repo
- ⚠️ Set **Framework Preset → Other** (NOT Node.js)
- Add env vars:

| Name | Value |
|---|---|
| `UPSTASH_REDIS_REST_URL` | your Upstash REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | your Upstash REST token |

- Deploy

### 4) Test it

Open:

```txt
https://your-project.vercel.app/api/counter
```

If you open `/` you’ll get a 404 - that’s normal. The endpoint is `/api/counter`.

### 5) Embed it in your GitHub profile 🎀

In your `USERNAME/USERNAME` profile README:

```html
<p align="center">
  <img src="https://your-project.vercel.app/api/counter" width="425" />
</p>
```

Want it closer to the classic getloli width? Try `width="460"`.

---

## ⚙️ Configuration (`counter.config.json`)

Edit this file, push to GitHub, Vercel redeploys automatically.

```json
{
  "counterKey": "counter:Olexify",
  "digits": 7,
  "style": {
    "opacity": 0.8,
    "brightness": 0.9,
    "contrast": 1.25,
    "saturate": 1,
    "scale": 1,
    "spacing": 0,
    "offsetY": 0,
    "shadowOpacity": 0.5,
    "shadowBlur": 0.65,
    "shadowOffsetX": 2.5,
    "shadowOffsetY": 3.5,
    "bgOpacity": 0,
    "rounded": 0,
    "bgColor": "#000000"
  },
  "counting": {
    "mode": "strict",
    "cooldownSeconds": 0,
    "bump": 1
  }
}
```

### 🎨 Style options (quick reference)

| Key | What it does |
|---|---|
| `opacity` | overall transparency(broken) |
| `brightness` | darker / brighter (lower = darker) |
| `contrast` | stronger outlines |
| `saturate` | more/less color |
| `scale` | size multiplier |
| `spacing` | gap between digits |
| `offsetY` | vertical nudge |
| `shadowOpacity` / `shadowBlur` | getloli-ish depth |
| `bgOpacity` / `bgColor` / `rounded` | optional background plate |
| `animation speed` | I could not implement this, not for GIFs |

### 🔢 Counting modes

| Mode | Behavior |
|---|---|
| `strict` | +1 on every request (this one's actually default logic, but caching won't let you +1 on every page refresh) |
| `unique` | +1 per IP per cooldown window (If the IP hasn’t been seen in the last cooldownSeconds) |
| `aggressive` | +`bump` for freaks who want to increase count with bump multiplier x100500, visitor larping (or transfering data from other counter) |

> 😐 **Counter feels sluggish on GitHub?** GitHub caches/proxies images.  
> For testing, open `YOUR-PROJECT-NAME.vercel.app/api/counter` directly in your browser and refresh there.

---

## 👯‍♀️ Troubleshooting

```txt
99 little cats play in the counter, 99 little cats 🎵
Feed them, they all nap and curl,
redeploy the page... you get a broken image 🐾
```

| Symptom | Fix |
|---|---|
| **"No entrypoint found"** | Vercel preset must be **Other**; function must be `api/counter.js` |
| **500 FUNCTION_INVOCATION_FAILED** | Missing env vars, invalid JSON, or JSON pasted into `.js` → check Vercel logs |
| **404 on `/`** | Normal - use `/api/counter` |
| **Works in browser, broken on GitHub** | GitHub proxy is picky with some SVGs; try Markdown embed `![Counter](URL)` or simplify output |
| **Count won't increase** | use `strict` mode, cooldown=0; the issue is caching |


---

## 🧠 Philosophy

Static counters are fine.

But if anime catgirls are going to announce your visitor count,  
they might as well **wiggle their tails**. 🐾

---

<p align="center">
  <i>"I-it's not like I made an entire self-hosted counter just to flex or anything..." ✨</i>
</p>

<br>
<br>

<p align="center">
  <img width="40" height="89" alt="0" src="https://github.com/user-attachments/assets/d0b116fe-8fa8-4bda-aa57-2576653407c9" />
  <img width="40" height="89" alt="1" src="https://github.com/user-attachments/assets/27cf5157-a926-4437-8ea5-7e2f706dd5f8" />
  <img width="40" height="89" alt="2" src="https://github.com/user-attachments/assets/a299c41a-bdf8-4546-91a4-31bfc5584896" />
  <img width="40" height="89" alt="3" src="https://github.com/user-attachments/assets/338f54c8-62be-4283-bcdc-04d634262598" />
  <img width="40" height="89" alt="4" src="https://github.com/user-attachments/assets/f09f6a38-1d75-45a3-9a80-945632e2797e" />
  <img width="40" height="89" alt="5" src="https://github.com/user-attachments/assets/a55ccb2d-a7e1-4ab1-8a17-918e52dfd6bb" />
  <img width="40" height="89" alt="6" src="https://github.com/user-attachments/assets/cd61ec35-48ec-4235-b3dd-9cbc4f3fbbba" />
  <img width="40" height="89" alt="7" src="https://github.com/user-attachments/assets/191aa33e-b23c-42d0-afa5-9719a6989915" />
  <img width="40" height="89" alt="8" src="https://github.com/user-attachments/assets/98672b7e-885d-41aa-ab1a-884d4046fb9d" />
  <img width="40" height="89" alt="9" src="https://github.com/user-attachments/assets/9e3b0ece-51df-4aa2-978e-001a37344b60" />
</p>

<p align="center">
  <sub><i>Wdym made with meow??</i></sub>
</p>
