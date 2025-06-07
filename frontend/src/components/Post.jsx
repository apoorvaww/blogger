import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import Comment from "./Comment";
import ConfirmModal from "./ConfirmModal";

const Post = () => {
  const blogId = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // console.log(blogId.id)
  const[deleteModal, setDeleteModal] =useState(false);
  
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/blogs/get-single-blog/${
            blogId.id
          }`,
          { withCredentials: true }
        );
        console.log(res.data);
        setBlog(res.data.data);
      } catch (error) {
        console.error("Error while fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [blogId]);

  const loggedInUser = useSelector((state) => state.auth);
  // console.log(loggedInUser.userData)

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

  const isAuthor = loggedInUser.userData._id === owner._id ? true : false;
  // console.log(isAuthor)

  const handleDelete = async() =>  {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blogs/delete-blog-post/${blogId.id}`,
        {},
        {
          withCredentials: true
        }
      );
      console.log("deleting post response: ", res.data)
      navigate('/');
    } catch (error) {
      console.error("error in deleting post", error)
    }
  }

  return (
    <>
      {/* Top Header Bar */}
      <header className="w-full border-b bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Left: Blog Logo */}
          <h1 className="text-xl font-bold text-teal-700">Blogger</h1>

          <div className="flex-1 mx-6 max-w-md">
            <input
              type="text"
              placeholder="Search articles"
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">
              Welcome, {loggedInUser.userData.username}
            </span>
            <img
              src={loggedInUser.userData.avatar}
              alt="User Avatar"
              className="w-9 h-9 rounded-full object-cover border"
            />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-16 sm:px-8 lg:px-12 bg-white shadow-xl rounded-2xl my-10">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight mb-4">
            {title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
            {/* Author Info */}
            <div className="flex items-center gap-3 sm:gap-4">
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

            {isAuthor && (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <a
                  href={`/edit-blog/${blogId.id}`}
                  className="inline-flex justify-center items-center px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded hover:bg-teal-700 transition"
                >
                  ✏️ Edit Post
                </a>
                <button
                  onClick={() => {
                    setDeleteModal(true);
                  }}
                  className="inline-flex justify-center items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition"
                >
                  🗑️ Delete Post
                </button>
              </div>
            )}
          </div>

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

        <div className="mb-10 p-6 bg-teal-50 rounded-xl border border-teal-200 shadow-sm text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Enjoying this post?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Subscribe to get updates on new blog posts!
          </p>
          <button className="bg-teal-600 cursor-pointer hover:bg-teal-700 text-white px-5 py-2 rounded-full transition">
            Subscribe
          </button>
        </div>

        <article
          className="prose prose-lg sm:prose-xl prose-teal max-w-none text-gray-900 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        
        <div className="mt-16">
          <Comment blogId={blogId} commentCount={blog.commentsCount} />
        </div>

        <div className="mt-16 text-center">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center cursor-pointer px-6 py-3 rounded-full text-white bg-teal-600 hover:bg-teal-700 shadow-md transition duration-300"
          >
            ← Back to all posts
          </button>
        </div>
        <ConfirmModal
        isOpen={deleteModal}
        onClose={()=>setDeleteModal(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this post?"
        />
      </div>
    </>
  );
};

export default Post;
