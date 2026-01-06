import { useState } from "react";
import { useQuery } from "convex/react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { api } from "../../convex/_generated/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CATEGORIES = [
  "All",
  "AI Automation",
  "AI Integration",
  "AI Strategy",
  "Case Studies",
  "Tools & Reviews",
  "Tutorials",
];

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags?: string[];
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  publishedAt?: number;
  readTime: number;
  featured: boolean;
}

function FeaturedPost({ post }: { post: Post }) {
  return (
    <Link to={`/blog/${post.slug}`} className="block group">
      <article className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative h-64 md:h-96 overflow-hidden">
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <span className="text-6xl text-white/30">ES</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent md:hidden" />
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                Featured
              </span>
              <span className="px-3 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
                {post.category}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
              {post.title}
            </h2>

            <p className="text-slate-600 mb-6 line-clamp-3">{post.excerpt}</p>

            <div className="flex items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                {post.author.avatar ? (
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                    {post.author.name.charAt(0)}
                  </div>
                )}
                <span>{post.author.name}</span>
              </div>
              <span>|</span>
              {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
              <span>|</span>
              <span>{post.readTime} min read</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

function CategoryFilter({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (category: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
            selected === category
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <Link to={`/blog/${post.slug}`} className="block group">
      <article className="h-full bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 hover:shadow-md transition-all duration-300">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
              <span className="text-4xl text-slate-400">ES</span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 text-xs font-medium bg-white/90 text-slate-700 rounded-md backdrop-blur-sm">
              {post.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h3>

          <p className="text-slate-600 text-sm mb-4 line-clamp-2">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between text-xs text-slate-500">
            {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
            <span>{post.readTime} min read</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function PostGrid({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-600 text-lg">No posts found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const featuredPost = useQuery(api.posts.getFeatured);
  const posts = useQuery(api.posts.list, {
    category: selectedCategory === "All" ? undefined : selectedCategory,
  });

  // Filter out the featured post from the grid
  const gridPosts =
    posts?.filter((post) => !post.featured || selectedCategory !== "All") || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50/50 to-white">
      <Helmet>
        <title>Blog | EntrSphere - Insights That Protect Your Budget</title>
        <meta
          name="description"
          content="Practical frameworks for agencies tired of scope creep, founders protecting their investments, and product teams building AI-native products."
        />
        <meta property="og:title" content="Blog | EntrSphere - Insights That Protect Your Budget" />
        <meta
          property="og:description"
          content="Practical frameworks for agencies tired of scope creep, founders protecting their investments, and product teams building AI-native products."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://entrsphere.com/blog" />
        <link rel="canonical" href="https://entrsphere.com/blog" />
      </Helmet>

      <Header />

      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Insights That Protect Your Budget
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Practical frameworks for agencies tired of scope creep, founders
              protecting their investments, and product teams building
              AI-native products without the chaos.
            </p>
          </div>

          {/* Featured Post */}
          {featuredPost && selectedCategory === "All" && (
            <div className="mb-12">
              <FeaturedPost post={featuredPost as Post} />
            </div>
          )}

          {/* Category Filter */}
          <CategoryFilter
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />

          {/* Posts Grid */}
          {posts === undefined ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-80 bg-white border border-slate-200 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : (
            <PostGrid posts={gridPosts as Post[]} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
