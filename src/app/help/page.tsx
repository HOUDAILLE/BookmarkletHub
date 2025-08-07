import React from 'react';
import { promises as fs } from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

export default async function HelpPage() {
  const helpPath = path.join(process.cwd(), 'src', 'app', 'help-content.md');
  const helpContent = await fs.readFile(helpPath, 'utf8');

  const processedContent = await remark().use(html).process(helpContent);
  const contentHtml = processedContent.toString();

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">Aide</h1>
      <div className="prose lg:prose-xl" dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </main>
  );
}