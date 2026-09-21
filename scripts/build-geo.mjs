import { writeOut, SITE_URL, MODULES, SITE } from './lib.mjs';

export async function buildGeo() {
  const robots = `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}sitemap.xml\n`;
  await writeOut('robots.txt', robots);

  const pages = [SITE_URL, SITE_URL + '?lang=en'];
  const urls = [...pages, ...MODULES.map((m) => `${SITE_URL}data/${m}.json`)];
  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.w3.org/1999/sitemap.xml">\n` +
    urls
      .map((u) => `  <url><loc>${u}</loc><changefreq>monthly</changefreq></url>`)
      .join('\n') +
    `\n</urlset>\n`;
  await writeOut('sitemap.xml', sitemap);

  const llms =
    `# ${SITE.title}\n\n` +
    `结构化数据驱动的心理学通识科普站。全部内容见 llms-full.txt（中文）与 llms-full-en.txt（英文）。\n\n` +
    `## 模块数据\n` +
    MODULES.map((m) => `- ${m}.json`).join('\n') +
    `\n`;
  await writeOut('llms.txt', llms);
  await writeOut(
    'llms-en.txt',
    `# Mind of Everything\n\nA structured, data-driven plain-language psychology site. Full text in llms-full.txt (zh) and llms-full-en.txt (en).\n\n## Module data\n` +
      MODULES.map((m) => `- ${m}.json`).join('\n') +
      `\n`,
  );
  console.log('[geo] robots/sitemap/llms written');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  buildGeo().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
