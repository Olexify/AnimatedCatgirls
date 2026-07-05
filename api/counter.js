import { Redis } from '@upstash/redis';
import { readFileSync } from 'fs';
import { join } from 'path';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// OPTION A — use GitHub user-attachments URLs
const DIGITS = {
  '0': 'https://github.com/user-attachments/assets/d0b116fe-8fa8-4bda-aa57-2576653407c9',
  '1': 'https://github.com/user-attachments/assets/27cf5157-a926-4437-8ea5-7e2f706dd5f8',
  '2': 'https://github.com/user-attachments/assets/a299c41a-bdf8-4546-91a4-31bfc5584896',
  '3': 'https://github.com/user-attachments/assets/338f54c8-62be-4283-bcdc-04d634262598',
  '4': 'https://github.com/user-attachments/assets/f09f6a38-1d75-45a3-9a80-945632e2797e',
  '5': 'https://github.com/user-attachments/assets/a55ccb2d-a7e1-4ab1-8a17-918e52dfd6bb',
  '6': 'https://github.com/user-attachments/assets/cd61ec35-48ec-4235-b3dd-9cbc4f3fbbba',
  '7': 'https://github.com/user-attachments/assets/191aa33e-b23c-42d0-afa5-9719a6989915',
  '8': 'https://github.com/user-attachments/assets/98672b7e-885d-41aa-ab1a-884d4046fb9d',
  '9': 'https://github.com/user-attachments/assets/9e3b0ece-51df-4aa2-978e-001a37344b60',
};

/*
// OPTION B — use local repo files in folder, Example folder name  "ActiveGifs"
const DIGITS = {
  '0': '/ActiveGifs/0.gif',
  '1': '/ActiveGifs/1.gif',
  '2': '/ActiveGifs/2.gif',
  '3': '/ActiveGifs/3.gif',
  '4': '/ActiveGifs/4.gif',
  '5': '/ActiveGifs/5.gif',
  '6': '/ActiveGifs/6.gif',
  '7': '/ActiveGifs/7.gif',
  '8': '/ActiveGifs/8.gif',
  '9': '/ActiveGifs/9.gif',
};
*/

function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}

function loadConfig() {
  try {
    const raw = readFileSync(join(process.cwd(), 'counter.config.json'), 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return 'unknown';
}

async function getCount(req, cfg) {
  const key = cfg.counterKey || 'counter:Olexify';

  if (cfg.counting.mode === 'strict') {
    return await redis.incr(key);
  }

  if (cfg.counting.mode === 'unique') {
    const ip = getClientIp(req);
    const cooldown = Math.max(0, cfg.counting.cooldownSeconds || 0);
    const seenKey = `seen:${key}:${ip}`;
    const seen = cooldown > 0 ? await redis.get(seenKey) : null;

    if (!seen) {
      const next = await redis.incr(key);
      if (cooldown > 0) {
        await redis.set(seenKey, '1', { ex: cooldown });
      }
      return next;
    }

    return Number((await redis.get(key)) || 0);
  }

  if (cfg.counting.mode === 'aggressive') {
    const bump = Math.max(1, cfg.counting.bump || 1);
    return await redis.incrby(key, bump);
  }

  return await redis.incr(key);
}

export default async function handler(req, res) {
  const fileCfg = loadConfig();

  const cfg = {
    counterKey: 'counter:Olexify',
    digits: 6,
    style: {
      opacity: 1,
      brightness: 1,
      contrast: 1,
      saturate: 1,
      scale: 1,
      spacing: 0,
      offsetY: 0,
      shadowOpacity: 0,
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      bgOpacity: 0,
      rounded: 0,
      bgColor: '#000000',
    },
    counting: {
      mode: 'strict',
      cooldownSeconds: 0,
      bump: 1,
    },
    ...fileCfg,
    style: {
      opacity: 1,
      brightness: 1,
      contrast: 1,
      saturate: 1,
      scale: 1,
      spacing: 0,
      offsetY: 0,
      shadowOpacity: 0,
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      bgOpacity: 0,
      rounded: 0,
      bgColor: '#000000',
      ...(fileCfg.style || {}),
    },
    counting: {
      mode: 'strict',
      cooldownSeconds: 0,
      bump: 1,
      ...(fileCfg.counting || {}),
    },
  };

  try {
    const count = await getCount(req, cfg);
    const padded = String(count).padStart(cfg.digits, '0').slice(-cfg.digits);
    const chars = padded.split('');

    const baseW = 45;
    const baseH = 100;
    const scale = clamp(Number(cfg.style.scale || 1), 0.2, 5);
    const W = Math.round(baseW * scale);
    const H = Math.round(baseH * scale);
    const spacing = Number(cfg.style.spacing || 0);
    const offsetY = Number(cfg.style.offsetY || 0);

    const totalWidth = chars.length * W + Math.max(0, chars.length - 1) * spacing;
    const totalHeight = H + Math.abs(offsetY) + 4;

    const opacity = clamp(Number(cfg.style.opacity || 1), 0, 1);
    const brightness = clamp(Number(cfg.style.brightness || 1), 0, 3);
    const contrast = clamp(Number(cfg.style.contrast || 1), 0, 3);
    const saturate = clamp(Number(cfg.style.saturate || 1), 0, 3);

    const shadowOpacity = clamp(Number(cfg.style.shadowOpacity || 0), 0, 1);
    const shadowBlur = Math.max(0, Number(cfg.style.shadowBlur || 0));
    const shadowOffsetX = Number(cfg.style.shadowOffsetX || 0);
    const shadowOffsetY = Number(cfg.style.shadowOffsetY || 0);

    const bgOpacity = clamp(Number(cfg.style.bgOpacity || 0), 0, 1);
    const rounded = Math.max(0, Number(cfg.style.rounded || 0));
    const bgColor = cfg.style.bgColor || '#000000';

    const filterId = 'catgirl-filter';
    const shadowId = 'catgirl-shadow';

    const defs = `
      <defs>
        <filter id="${filterId}" color-interpolation-filters="sRGB">
          <feComponentTransfer>
            <feFuncR type="linear" slope="${brightness}" />
            <feFuncG type="linear" slope="${brightness}" />
            <feFuncB type="linear" slope="${brightness}" />
          </feComponentTransfer>
          <feColorMatrix type="saturate" values="${saturate}" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="${contrast}" intercept="${(1 - contrast) / 2}" />
            <feFuncG type="linear" slope="${contrast}" intercept="${(1 - contrast) / 2}" />
            <feFuncB type="linear" slope="${contrast}" intercept="${(1 - contrast) / 2}" />
          </feComponentTransfer>
        </filter>
        <filter id="${shadowId}" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="${shadowOffsetX}" dy="${shadowOffsetY}" stdDeviation="${shadowBlur}" flood-color="#000000" flood-opacity="${shadowOpacity}" />
        </filter>
      </defs>
    `;

    const images = await Promise.all(
      chars.map(async (d, i) => {
        const imgRes = await fetch(DIGITS[d]);
        if (!imgRes.ok) {
          throw new Error(`Failed to fetch digit ${d}`);
        }
        const b64 = Buffer.from(await imgRes.arrayBuffer()).toString('base64');
        const x = i * (W + spacing);
        const y = offsetY > 0 ? offsetY : 0;
        return `<image x="${x}" y="${y}" width="${W}" height="${H}" href="data:image/gif;base64,${b64}" opacity="${opacity}" filter="url(#${filterId}) url(#${shadowId})" />`;
      })
    );

    const bgRect = bgOpacity > 0
      ? `<rect x="0" y="0" width="${totalWidth}" height="${totalHeight}" rx="${rounded}" ry="${rounded}" fill="${bgColor}" opacity="${bgOpacity}" />`
      : '';

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}">
  ${defs}
  ${bgRect}
  ${images.join('\n  ')}
</svg>`;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(svg);
  } catch (err) {
    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(500).send(
      `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="40">
        <rect width="100%" height="100%" fill="#fff" />
        <text x="10" y="25" font-size="14" fill="red">counter error: ${String(err.message || err)}</text>
      </svg>`
    );
  }
}