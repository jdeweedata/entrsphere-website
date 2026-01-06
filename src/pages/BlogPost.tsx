import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { api } from "../../convex/_generated/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Import highlight.js styles
import "highlight.js/styles/github-dark.css";

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
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
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
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={() => setIsOpen(false)}
                      className={`block py-1 text-sm transition-colors ${
                        item.level === 3 ? "pl-4" : ""
                      } ${
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
      <aside className="hidden lg:block sticky top-24 self-start w-64 flex-shrink-0">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            On This Page
          </h3>
          <nav>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`block py-1 text-sm transition-colors border-l-2 ${
                      item.level === 3 ? "pl-5" : "pl-3"
                    } ${
                      activeId === item.id
                        ? "border-blue-600 text-blue-600 font-medium"
                        : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
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
    category: string;
    coverImage?: string;
    author: { name: string; avatar?: string; bio?: string };
    publishedAt?: number;
    readTime: number;
  };
}) {
  return (
    <header className="mb-10">
      {/* Cover Image */}
      {post.coverImage && (
        <div className="relative h-64 md:h-96 -mx-4 sm:-mx-6 lg:-mx-8 mb-8 overflow-hidden rounded-xl">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Category */}
      <Link
        to={`/blog?category=${encodeURIComponent(post.category)}`}
        className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors mb-4"
      >
        {post.category}
      </Link>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
        {post.title}
      </h1>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 text-slate-500">
        <div className="flex items-center gap-3">
          {post.author.avatar ? (
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
              {post.author.name.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-slate-900 font-medium">{post.author.name}</p>
            {post.author.bio && (
              <p className="text-sm text-slate-500">{post.author.bio}</p>
            )}
          </div>
        </div>
        <span className="hidden sm:inline text-slate-300">|</span>
        {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
        <span className="hidden sm:inline text-slate-300">|</span>
        <span>{post.readTime} min read</span>
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
    <footer className="mt-12 pt-8 border-t border-slate-200">
      {/* Author Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex items-start gap-4">
          {author.avatar ? (
            <img
              src={author.avatar}
              alt={author.name}
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-2xl text-slate-600">
              {author.name.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-slate-900 font-semibold text-lg">{author.name}</p>
            {author.bio && (
              <p className="text-slate-600 mt-1">{author.bio}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-slate-500 text-sm">Tagged:</span>
        <Link
          to={`/blog?category=${encodeURIComponent(category)}`}
          className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
        >
          {category}
        </Link>
        {tags?.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 text-sm bg-slate-100 text-slate-600 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>
    </footer>
  );
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = useQuery(api.posts.getBySlug, slug ? { slug } : "skip");
  const [activeId, setActiveId] = useState("");
  const [tocItems, setTocItems] = useState<TocItem[]>([]);

  // Extract TOC items when post loads
  useEffect(() => {
    if (post?.content) {
      setTocItems(extractTocItems(post.content));
    }
  }, [post?.content]);

  // Scroll spy
  const handleScroll = useCallback(() => {
    const headings = document.querySelectorAll("h2, h3");
    let currentId = "";

    headings.forEach((heading) => {
      const rect = heading.getBoundingClientRect();
      if (rect.top <= 100) {
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50/50 to-white">
        <Header />
        <main className="pt-24 pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-64 bg-slate-200 rounded-xl mb-8" />
              <div className="h-8 w-24 bg-slate-200 rounded-full mb-4" />
              <div className="h-12 bg-slate-200 rounded-lg mb-6" />
              <div className="space-y-4">
                <div className="h-4 bg-slate-200 rounded" />
                <div className="h-4 bg-slate-200 rounded w-5/6" />
                <div className="h-4 bg-slate-200 rounded w-4/6" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 404 state
  if (post === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50/50 to-white">
        <Header />
        <main className="pt-24 pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Post Not Found
            </h1>
            <p className="text-slate-600 mb-8">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const seoTitle = post.metaTitle || `${post.title} | EntrSphere`;
  const seoDescription = post.metaDescription || post.excerpt;
  const canonicalUrl = post.canonicalUrl || `https://entrsphere.com/blog/${post.slug}`;
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toISOString()
    : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "EntrSphere",
      url: "https://entrsphere.com",
    },
    datePublished: publishedDate,
    image: post.coverImage,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50/50 to-white">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        {post.coverImage && <meta property="og:image" content={post.coverImage} />}
        <meta property="article:published_time" content={publishedDate} />
        <meta property="article:section" content={post.category} />
        {post.tags?.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Header />

      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-8"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Blog
          </Link>

          <div className="flex gap-8">
            {/* Main Content */}
            <article className="flex-1 min-w-0 max-w-3xl">
              <PostHeader post={post} />

              {/* Content */}
              <div className="prose prose-slate prose-lg max-w-none prose-headings:scroll-mt-24 prose-headings:text-slate-900 prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-code:text-blue-700 prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeSlug]}
                >
                  {post.content}
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
      </main>

      <Footer />
    </div>
  );
}
