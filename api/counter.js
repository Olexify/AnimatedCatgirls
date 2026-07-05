export default async function handler(req, res) {
  // 1. Get count from getloli
  const countRes = await fetch('https://count.getloli.com/get/@Olexify?padding=6', {
    headers: { 'Accept': 'image/svg+xml' }
  });
  // getloli doesn't expose a JSON API, so instead increment & read via a text trick
  // Better: use a simple Vercel KV or upstash counter
  const count = await getCount('Olexify'); // see step 3
  
  const digits = String(count).padStart(6, '0').split('');
  const W = 45, H = 100;
  const totalWidth = digits.length * W;

  // Fetch each GIF and embed as base64 (required — GitHub blocks external img in SVG)
  const images = await Promise.all(digits.map(async (d, i) => {
    const imgRes = await fetch(DIGITS[d]);
    const buf = Buffer.from(await imgRes.arrayBuffer());
    const b64 = buf.toString('base64');
    return `<image x="${i * W}" y="0" width="${W}" height="${H}" 
      href="data:image/gif;base64,${b64}" />`;
  }));

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" 
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="${totalWidth}" height="${H}">
    ${images.join('\n')}
  </svg>`;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'no-cache, max-age=0');
  res.send(svg);
}