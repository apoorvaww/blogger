import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const Post = () => {
  const blogId = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  // Fetch blog
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/blogs/get-single-blog/${
            blogId.id
          }`,
          { withCredentials: true }
        );
        setBlog(res.data.data);
      } catch (error) {
        console.error("Error while fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [blogId]);
  
  const loggedInUser = useSelector((state) => state.auth.userData);
//   console.log("logged in user", loggedInUser)
/// TODO: FIND OUT WHY WHEN YOU RELOAD THIS PAGE THE USER INFO FROM STATE DISAPPEARS


  if (loading || !blog) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 animate-pulse text-gray-400">
        <div className="h-10 bg-gray-200 rounded w-1/2 mb-6 mx-auto" />
        <div className="h-64 bg-gray-200 rounded-xl mb-8" />
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-6" />
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    );
  }

  const { title, coverImage, content, createdAt, owner, tags = [] } = blog;
  //// Author check logic:
  console.log("owner: ", owner)
  
  const isAuthor = loggedInUser._id === owner._id? true: false;
  console.log(isAuthor)

  return (
    <>
      {/* Top Header Bar */}
      <header className="w-full border-b bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Left: Blog Logo */}
          <h1 className="text-xl font-bold text-teal-700">Blogger</h1>

          {/* Center: Search Bar */}
          <div className="flex-1 mx-6 max-w-md">
            <input
              type="text"
              placeholder="Search articles"
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Right: User Info */}
          <div className="flex items-center space-x-3">
            <img
              src={
                loggedInUser.avatar}
              alt="User Avatar"
              className="w-9 h-9 rounded-full object-cover border"
            />
            <span className="text-sm font-medium text-gray-700">
              {loggedInUser.username}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-16 sm:px-8 lg:px-12 bg-white shadow-xl rounded-2xl my-10">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight mb-4">
            {title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Author Info */}
            <div className="flex items-center space-x-4">
              <img
                src={owner?.avatar || "https://www.gravatar.com/avatar/?d=mp"}
                alt={owner?.username || "Author"}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border"
              />
              <div>
                <p className="font-medium text-gray-800">{owner?.username}</p>
                <p className="text-sm text-gray-500">
                  {new Date(createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Edit Button (for author only) */}
            {isAuthor && (
              <a
                href={`/edit-blog/${blogId.id}`}
                className="inline-flex items-center px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded hover:bg-teal-700 transition"
              >
                ✏️ Edit Post
              </a>
            )}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Cover Image */}
        {coverImage && (
          <img
            src={coverImage}
            alt={title}
            className="w-full h-72 sm:h-96 object-cover rounded-xl shadow-lg mb-10"
          />
        )}

        {/* Email Subscribe CTA */}
        <div className="mb-10 p-6 bg-teal-50 rounded-xl border border-teal-200 shadow-sm text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Enjoying this post?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Subscribe to get updates on new blog posts!
          </p>
          <button className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-full transition">
            Subscribe
          </button>
        </div>

        {/* Blog Content */}
        <article
          className="prose prose-lg sm:prose-xl prose-teal max-w-none text-gray-900 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Back Button */}
        <div className="mt-16 text-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 rounded-full text-white bg-teal-600 hover:bg-teal-700 shadow-md transition duration-300"
          >
            ← Back to all posts
          </button>
        </div>
      </div>
    </>
  );
};

export default Post;
