import { marked } from 'marked';
import fs from 'node:fs/promises';
import path from 'node:path';

export interface PostFrontmatter {
  title: string;
  date: string;
  tags?: string | string[]; 
}

export interface PostData {
  frontmatter: PostFrontmatter;
  html: string;
  slug: string;
}

const postsDir = path.join(process.cwd(), 'src', 'posts');

export function parseFrontmatter(markdown: string): { frontmatter: PostFrontmatter | null, content: string } {
  const match = markdown.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: null, content: markdown };
  }

  const frontmatterString = match[1];
  const content = match[2];
  const frontmatter: Record<string, any> = {};

  frontmatterString.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim();
      if ((key.trim() === 'tags')) {
        frontmatter[key.trim()] = value.split(',').map(tag => tag.trim());
      } else {
        frontmatter[key.trim()] = value;
      }
    }
  });
  
  return { frontmatter: frontmatter as PostFrontmatter, content };
}

export async function processMarkdown(markdown: string, slug: string): Promise<PostData> {
  const { frontmatter, content } = parseFrontmatter(markdown);
  if (!frontmatter || !frontmatter.title || !frontmatter.date) {
    throw new Error(`Missing frontmatter in ${slug}.md`);
  }
  const html = await marked(content);
  return { frontmatter, html, slug };
}

export async function getPostSlugs(): Promise<string[]> {
  try {
    const files = await fs.readdir(postsDir);
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace(/\.md$/, ''));
  } catch (error) {
    // If the directory doesn't exist, return an empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

export async function getPostBySlug(slug: string): Promise<PostData | null> {
  try {
    const filePath = path.join(postsDir, `${slug}.md`);
    const markdown = await fs.readFile(filePath, 'utf-8');
    return await processMarkdown(markdown, slug);
  } catch (error) {
     if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

export async function getAllPosts(): Promise<PostData[]> {
  const slugs = await getPostSlugs();
  const posts = await Promise.all(
    slugs.map(slug => getPostBySlug(slug))
  );
  
  const filteredPosts = posts.filter(post => post !== null) as PostData[];

  return filteredPosts.sort((a, b) => {
    return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
  });
}
