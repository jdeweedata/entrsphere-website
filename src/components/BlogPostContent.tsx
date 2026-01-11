"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { api } from "../../convex/_generated/api";
import { ArrowLeft, Clock, Calendar } from "@phosphor-icons/react";

// Import highlight.js styles
import "highlight.js/styles/github.css";

interface BlogPostContentProps {
  slug: string;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function extractTocItems(markdown: string): TocItem[] {
  // Remove code blocks first to avoid picking up headings from inside them
  const withoutCodeBlocks = markdown.replace(/```[\s\S]*?```/g, "");

  // Only extract h2 headings for cleaner TOC
  const headingRegex = /^(#{2})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(withoutCodeBlocks)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    items.push({ id, text, level });
  }

  return items;
}

// Strip the first H1 from content since we display it in PostHeader
function stripFirstH1(markdown: string): string {
  return markdown.replace(/^#\s+.+\n+/, "");
}

function TableOfContents({
  items,
  activeId,
}: {
  items: TocItem[];
  activeId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (items.length === 0) return null;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-slate-900 text-white p-3 rounded-full shadow-lg hover:bg-slate-800 transition-colors"
        aria-label="Table of contents"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h7"
          />
        </svg>
      </button>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Table of Contents
            </h3>
            <nav>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={() => setIsOpen(false)}
                      className={`block py-1 text-sm transition-colors ${
                        activeId === item.id
                          ? "text-blue-600 font-medium"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block sticky top-28 self-start w-72 flex-shrink-0">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            On This Page
          </h3>
          <nav>
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`block py-2 px-3 text-sm rounded-lg transition-colors ${
                      activeId === item.id
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}

function PostHeader({
  post,
}: {
  post: {
    title: string;
    excerpt: string;
    category: string;
    coverImage?: string;
    author: { name: string; avatar?: string; bio?: string };
    publishedAt?: number;
    readTime: number;
  };
}) {
  return (
    <header className="mb-12">
      {/* Category Badge */}
      <Link
        href={`/blog?category=${encodeURIComponent(post.category)}`}
        className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors mb-6"
      >
        {post.category}
      </Link>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
        {post.title}
      </h1>

      {/* Excerpt */}
      <p className="text-xl text-slate-600 mb-8 leading-relaxed">
        {post.excerpt}
      </p>

      {/* Meta Row */}
      <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-slate-200">
        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
            {post.author.name.charAt(0)}
          </div>
          <div>
            <p className="text-slate-900 font-medium">{post.author.name}</p>
            {post.author.bio && (
              <p className="text-sm text-slate-500 max-w-xs">{post.author.bio}</p>
            )}
          </div>
        </div>

        {/* Date & Read Time */}
        <div className="flex items-center gap-4 text-sm text-slate-500">
          {post.publishedAt && (
            <div className="flex items-center gap-1.5">
              <Calendar weight="duotone" className="w-4 h-4" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Clock weight="duotone" className="w-4 h-4" />
            <span>{post.readTime} min read</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function PostFooter({
  author,
  category,
  tags,
}: {
  author: { name: string; avatar?: string; bio?: string };
  category: string;
  tags?: string[];
}) {
  return (
    <footer className="mt-16 pt-8 border-t border-slate-200">
      {/* Author Card */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
            {author.name.charAt(0)}
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              Written by
            </p>
            <p className="text-slate-900 font-semibold text-lg">{author.name}</p>
            {author.bio && (
              <p className="text-slate-600 mt-1">{author.bio}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-slate-500 text-sm mr-2">Topics:</span>
        <Link
          href={`/blog?category=${encodeURIComponent(category)}`}
          className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors font-medium"
        >
          {category}
        </Link>
        {tags?.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1.5 text-sm bg-slate-100 text-slate-600 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 bg-slate-900 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-3">
          Ready to stop building the wrong thing?
        </h3>
        <p className="text-slate-300 mb-6 max-w-lg mx-auto">
          Get our Discovery Router Toolkit and start validating ideas before you waste time and money.
        </p>
        <Link
          href="/solutions/discovery-router"
          className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-lg font-medium hover:bg-slate-100 transition-colors"
        >
          Get the Toolkit
          <ArrowLeft weight="duotone" className="w-4 h-4 rotate-180" />
        </Link>
      </div>
    </footer>
  );
}

// Custom components for ReactMarkdown
const MarkdownComponents = {
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="text-2xl md:text-3xl font-bold text-slate-900 mt-12 mb-6 pb-3 border-b border-slate-200"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="text-xl md:text-2xl font-semibold text-slate-900 mt-8 mb-4"
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-slate-700 leading-relaxed mb-6" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-slate-700" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-outside ml-6 mb-6 space-y-2 text-slate-700" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  a: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      href={href}
      className="text-blue-600 hover:text-blue-700 underline underline-offset-2 font-medium"
      {...props}
    >
      {children}
    </a>
  ),
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-blue-500 bg-blue-50 pl-6 pr-4 py-4 my-6 rounded-r-lg italic text-slate-700"
      {...props}
    >
      {children}
    </blockquote>
  ),
  code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          className="bg-slate-100 text-blue-700 px-1.5 py-0.5 rounded text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="bg-slate-800 text-slate-100 rounded-xl p-6 overflow-x-auto mb-6 text-sm"
      {...props}
    >
      {children}
    </pre>
  ),
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto mb-6">
      <table
        className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200"
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="bg-slate-50" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="px-4 py-3 text-left text-sm font-semibold text-slate-900 border-b border-slate-200"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className="px-4 py-3 text-sm text-slate-700 border-b border-slate-100"
      {...props}
    >
      {children}
    </td>
  ),
  strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-slate-900" {...props}>
      {children}
    </strong>
  ),
  hr: () => (
    <hr className="my-12 border-t border-slate-200" />
  ),
};

export default function BlogPostContent({ slug }: BlogPostContentProps) {
  const post = useQuery(api.posts.getBySlug, { slug });
  const [activeId, setActiveId] = useState("");
  const [tocItems, setTocItems] = useState<TocItem[]>([]);

  // Extract TOC items when post loads
  useEffect(() => {
    if (post?.content) {
      const contentWithoutH1 = stripFirstH1(post.content);
      setTocItems(extractTocItems(contentWithoutH1));
    }
  }, [post?.content]);

  // Scroll spy
  const handleScroll = useCallback(() => {
    const headings = document.querySelectorAll("h2[id]");
    let currentId = "";

    headings.forEach((heading) => {
      const rect = heading.getBoundingClientRect();
      if (rect.top <= 120) {
        currentId = heading.id;
      }
    });

    setActiveId(currentId);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Loading state
  if (post === undefined) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-6 w-20 bg-slate-200 rounded-full mb-6" />
          <div className="h-12 bg-slate-200 rounded-lg mb-4" />
          <div className="h-8 bg-slate-200 rounded-lg mb-8 w-3/4" />
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-200">
            <div className="w-12 h-12 bg-slate-200 rounded-full" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-slate-200 rounded" />
              <div className="h-3 w-48 bg-slate-200 rounded" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-slate-200 rounded" />
            <div className="h-4 bg-slate-200 rounded w-5/6" />
            <div className="h-4 bg-slate-200 rounded w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  // 404 state
  if (post === null) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Post Not Found
        </h1>
        <p className="text-slate-600 mb-8">
          The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors font-medium"
        >
          <ArrowLeft weight="duotone" className="w-5 h-5" />
          Back to Blog
        </Link>
      </div>
    );
  }

  // Strip the first H1 from content since we display it in PostHeader
  const processedContent = stripFirstH1(post.content);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back Link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-8 font-medium"
      >
        <ArrowLeft weight="duotone" className="w-4 h-4" />
        Back to Blog
      </Link>

      <div className="flex gap-12">
        {/* Main Content */}
        <article className="flex-1 min-w-0 max-w-3xl">
          <PostHeader post={post} />

          {/* Content */}
          <div className="prose-custom">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeSlug]}
              components={MarkdownComponents}
            >
              {processedContent}
            </ReactMarkdown>
          </div>

          <PostFooter
            author={post.author}
            category={post.category}
            tags={post.tags}
          />
        </article>

        {/* Table of Contents */}
        <TableOfContents items={tocItems} activeId={activeId} />
      </div>
    </div>
  );
}
