import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  image: string;
  tags: string[];
  published: boolean;
}

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const postsPerPage = 6;

  // Mock data - replace with API call
  const mockPosts: BlogPost[] = [
    {
      id: "1",
      title: "My First Blood Donation Experience",
      excerpt:
        "I was nervous about donating blood for the first time, but the staff made it a comfortable and rewarding experience.",
      content: "Full blog content here...",
      category: "Experience",
      author: {
        name: "Sarah Johnson",
        avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      },
      date: "Mar 16, 2025",
      readTime: "4 min read",
      image:
        "https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      tags: ["donation", "experience", "first-time"],
      published: true,
    },
    {
      id: "2",
      title: "The Importance of Regular Blood Donation",
      excerpt:
        "Regular blood donation not only saves lives but also provides health benefits for the donors themselves.",
      content: "Full blog content here...",
      category: "Medical",
      author: {
        name: "Dr. Michael Chen",
        avatar: "https://randomuser.me/api/portraits/men/46.jpg",
      },
      date: "Apr 2, 2025",
      readTime: "6 min read",
      image:
        "https://images.unsplash.com/photo-1584118624012-df056829fbd0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      tags: ["medical", "health", "regular-donation"],
      published: true,
    },
    {
      id: "3",
      title: "Community Blood Drive Success",
      excerpt:
        "Our recent community blood drive collected over 100 units of blood, potentially saving up to 300 lives.",
      content: "Full blog content here...",
      category: "Event",
      author: {
        name: "Emily Rodriguez",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      },
      date: "Apr 12, 2025",
      readTime: "3 min read",
      image:
        "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      tags: ["event", "community", "success"],
      published: true,
    },
    {
      id: "4",
      title: "Blood Type Compatibility Guide",
      excerpt:
        "Understanding blood type compatibility is crucial for safe blood transfusions and donations.",
      content: "Full blog content here...",
      category: "Education",
      author: {
        name: "Dr. Lisa Park",
        avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      },
      date: "Apr 15, 2025",
      readTime: "8 min read",
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      tags: ["education", "blood-types", "compatibility"],
      published: true,
    },
    {
      id: "5",
      title: "Preparing for Your Blood Donation",
      excerpt:
        "Learn how to prepare physically and mentally for a successful blood donation experience.",
      content: "Full blog content here...",
      category: "Tips",
      author: {
        name: "Nurse Jennifer Smith",
        avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      },
      date: "Apr 18, 2025",
      readTime: "5 min read",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      tags: ["tips", "preparation", "donation"],
      published: true,
    },
    {
      id: "6",
      title: "Heroes Among Us: Donor Stories",
      excerpt:
        "Meet some of our regular donors and learn about their motivation to help save lives.",
      content: "Full blog content here...",
      category: "Stories",
      author: {
        name: "Mark Thompson",
        avatar: "https://randomuser.me/api/portraits/men/52.jpg",
      },
      date: "Apr 20, 2025",
      readTime: "7 min read",
      image:
        "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      tags: ["stories", "heroes", "donors"],
      published: true,
    },
  ];

  const categories = [
    "all",
    "Experience",
    "Medical",
    "Event",
    "Education",
    "Tips",
    "Stories",
  ];

  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setPosts(mockPosts);
      setFilteredPosts(mockPosts);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = posts;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    setFilteredPosts(filtered);
    setCurrentPage(1);
  }, [posts, selectedCategory, searchTerm]);

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-xl text-gray-600">Loading blog posts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent mb-4">
            Blog & Stories
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover inspiring stories, medical insights, and helpful tips from
            our blood donation community
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Search */}
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-semibold text-gray-900 mb-3"
              >
                Search Articles
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all"
                  placeholder="Search by title, content, or tags..."
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-semibold text-gray-900 mb-3"
              >
                Filter by Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-semibold text-red-600">
                {filteredPosts.length}
              </span>{" "}
              articles
              {selectedCategory !== "all" && (
                <span>
                  {" "}
                  in{" "}
                  <span className="font-semibold text-red-600">
                    {selectedCategory}
                  </span>
                </span>
              )}
              {searchTerm && (
                <span>
                  {" "}
                  for "
                  <span className="font-semibold text-red-600">
                    {searchTerm}
                  </span>
                  "
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {currentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {currentPosts.map((post) => (
              <article
                key={post.id}
                className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:-translate-y-2"
              >
                <div className="relative overflow-hidden">
                  <img
                    className="h-64 w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src={post.image}
                    alt={post.title}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 bg-red-600 text-white text-sm font-bold rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-8">
                  <Link
                    to={`/blog/${post.id}`}
                    className="block group-hover:text-red-600 transition-colors"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {post.excerpt}
                    </p>
                  </Link>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        className="h-10 w-10 rounded-full ring-2 ring-gray-200"
                        src={post.author.avatar}
                        alt={post.author.name}
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {post.author.name}
                        </p>
                        <p className="text-xs text-gray-500">{post.date}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No articles found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    currentPage === number
                      ? "bg-red-600 text-white shadow-lg"
                      : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {number}
                </button>
              )
            )}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        )}

        {/* Newsletter Subscription */}
        <div className="mt-16 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
          <p className="text-red-100 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive the latest blog posts and
            updates about blood donation.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl border-0 focus:ring-4 focus:ring-white/25"
            />
            <button className="px-6 py-3 bg-white text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
