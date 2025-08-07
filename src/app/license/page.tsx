import React from 'react';
import { promises as fs } from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

export default async function LicensePage() {
  const licensePath = path.join(process.cwd(), 'src', 'app', 'license.md');
  const licenseContent = await fs.readFile(licensePath, 'utf8');

  const processedContent = await remark().use(html).process(licenseContent);
  const contentHtml = processedContent.toString();

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">Licence MIT</h1>
      <div className="prose lg:prose-xl" dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </main>
  );
}
