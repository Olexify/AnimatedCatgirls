import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

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
  '9': 'https://github.com/user-attachments/assets/9e3b0ece-51df-4aa2-978e-021a37344b60',
};

export default async function handler(req, res) {
  const count = await redis.incr('counter:Olexify');
  const digits = String(count).padStart(6, '0').split('');
  const W = 45, H = 100;
  const totalWidth = digits.length * W;

  const images = await Promise.all(digits.map(async (d, i) => {
    const imgRes = await fetch(DIGITS[d]);
    const buf = Buffer.from(await imgRes.arrayBuffer());
    const b64 = buf.toString('base64');
    return `<image x="${i * W}" y="0" width="${W}" height="${H}" href="data:image/gif;base64,${b64}" />`;
  }));

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${totalWidth}" height="${H}">${images.join('')}</svg>`;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'no-cache, max-age=0');
  res.send(svg);
}