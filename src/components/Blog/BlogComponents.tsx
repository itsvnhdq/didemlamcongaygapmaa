import React, { useEffect, useState } from 'react';

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

interface BlogManagementProps {
  onClose?: () => void;
}

const BlogManagement: React.FC<BlogManagementProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'edit'>('list');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - replace with API call
  useEffect(() => {
    const mockPosts: BlogPost[] = [
      {
        id: '1',
        title: 'My First Blood Donation Experience',
        excerpt: 'I was nervous about donating blood for the first time, but the staff made it a comfortable and rewarding experience.',
        content: 'Full blog content here...',
        category: 'Experience',
        author: { name: 'Sarah Johnson', avatar: 'https://randomuser.me/api/portraits/women/32.jpg' },
        date: 'Mar 16, 2025',
        readTime: '4 min read',
        image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        tags: ['donation', 'experience', 'first-time'],
        published: true
      },
      {
        id: '2',
        title: 'The Importance of Regular Blood Donation',
        excerpt: 'Regular blood donation not only saves lives but also provides health benefits for the donors themselves.',
        content: 'Full blog content here...',
        category: 'Medical',
        author: { name: 'Dr. Michael Chen', avatar: 'https://randomuser.me/api/portraits/men/46.jpg' },
        date: 'Apr 2, 2025',
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1584118624012-df056829fbd0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        tags: ['medical', 'health', 'regular-donation'],
        published: false
      }
    ];
    setPosts(mockPosts);
  }, []);

  const handleDeletePost = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setPosts(posts.filter(post => post.id !== id));
        setIsLoading(false);
      }, 500);
    }
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setActiveTab('edit');
  };

  const handleTogglePublish = async (id: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPosts(posts.map(post => 
        post.id === id ? { ...post, published: !post.published } : post
      ));
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Blog Management</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white hover:text-red-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex px-8">
          {[
            { id: 'list', label: 'All Posts', icon: '📄' },
            { id: 'create', label: 'Create New', icon: '✏️' },
            ...(activeTab === 'edit' ? [{ id: 'edit', label: 'Edit Post', icon: '✏️' }] : [])
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-8">
        {/* Posts List */}
        {activeTab === 'list' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Blog Posts ({posts.length})</h3>
              <button
                onClick={() => setActiveTab('create')}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Post
              </button>
            </div>

            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-bold text-gray-900">{post.title}</h4>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                          {post.category}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{post.excerpt}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>By {post.author.name}</span>
                        <span>{post.date}</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEditPost(post)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleTogglePublish(post.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          post.published
                            ? 'text-yellow-600 hover:bg-yellow-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={post.published ? 'Unpublish' : 'Publish'}
                      >
                        {post.published ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 01.52-2.117A10.05 10.05 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.049 10.049 0 01-.52 2.117z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create/Edit Post Form */}
        {(activeTab === 'create' || activeTab === 'edit') && (
          <BlogEditor
            post={editingPost}
            onSave={(post) => {
              if (activeTab === 'create') {
                setPosts([...posts, { ...post, id: Date.now().toString() }]);
              } else {
                setPosts(posts.map(p => p.id === post.id ? post : p));
              }
              setActiveTab('list');
              setEditingPost(null);
            }}
            onCancel={() => {
              setActiveTab('list');
              setEditingPost(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

interface BlogEditorProps {
  post?: BlogPost | null;
  onSave: (post: BlogPost) => void;
  onCancel: () => void;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ post, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    category: post?.category || 'Experience',
    image: post?.image || '',
    tags: post?.tags?.join(', ') || '',
    published: post?.published || false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = ['Experience', 'Medical', 'Event', 'Education', 'Tips', 'Stories'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.excerpt.trim()) newErrors.excerpt = 'Excerpt is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (!formData.image.trim()) newErrors.image = 'Image URL is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const blogPost: BlogPost = {
        id: post?.id || '',
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        author: post?.author || { name: 'Admin', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
        date: post?.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        readTime: `${Math.ceil(formData.content.split(' ').length / 200)} min read`,
        image: formData.image,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        published: formData.published
      };
      
      onSave(blogPost);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">
          {post ? 'Edit Post' : 'Create New Post'}
        </h3>
        <div className="flex items-center space-x-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Publish immediately</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter post title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all"
          >
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-semibold text-gray-900 mb-2">
          Excerpt *
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={3}
          value={formData.excerpt}
          onChange={handleChange}
          className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all ${errors.excerpt ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Brief description of the post"
        ></textarea>
        {errors.excerpt && (
          <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>
        )}
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-semibold text-gray-900 mb-2">
          Featured Image URL *
        </label>
        <input
          type="url"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all ${errors.image ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="https://example.com/image.jpg"
        />
        {errors.image && (
          <p className="mt-1 text-sm text-red-600">{errors.image}</p>
        )}
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-semibold text-gray-900 mb-2">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all"
          placeholder="donation, health, community"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-semibold text-gray-900 mb-2">
          Content *
        </label>
        <textarea
          id="content"
          name="content"
          rows={12}
          value={formData.content}
          onChange={handleChange}
          className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all ${errors.content ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Write your blog post content here..."
        ></textarea>
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content}</p>
        )}
      </div>

      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
        >
          {post ? 'Update Post' : 'Create Post'}
        </button>
      </div>
    </form>
  );
};

export default BlogManagement;
