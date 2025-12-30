import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { FiSettings } from "react-icons/fi"; 
import toast from "react-hot-toast"; 
import PostCard from "../components/PostCard"; 

const Profile = () => {
  const { userId } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const getAllBlogs = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/blogs/get-all-blogs/${userId}`,
          { withCredentials: true }
        );
        setBlogs(res.data.data || []);
        toast.success("Fetched blogs successfully");
      } catch (error) {
        toast.error("Failed to fetch blogs");
        console.error(error);
      }
    };

    getAllBlogs();
  }, [userId]);

  return (
    <>
      <div className="w-full p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-8 relative">
          <h2 className="text-3xl font-extrabold text-gray-800 text-shadhow text-shadow-black border-b-2 border-teal-500 pb-2 flex-grow">
            Your Creative Showcase
          </h2>

          {/* Settings Button moved here */}
          <div className="ml-4">
            {" "}
            {/* Added margin-left for spacing */}
            <button
              onClick={() => setShowSettings((prev) => !prev)}
              className="text-teal-600 text-3xl p-2 rounded-full bg-teal-100 hover:bg-teal-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-300"
              aria-label="Toggle settings menu"
            >
              <FiSettings />
            </button>
          </div>

          {showSettings && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-10 border border-gray-200 transform transition-all duration-300 origin-top-right scale-100 opacity-100">
              <Link to="/update-account-details">
                <button className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-all duration-200">
                  Update account details{" "}
                </button>
              </Link>
              <Link to='/update-avatar'>
                <button className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-all duration-200">
                  Update Avatar
                </button>
              </Link>
              <Link to='/update-password'>
              <button className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-all duration-200">
                Update Password
              </button>
              </Link>
            </div>
          )}
        </div>

        {blogs.length === 0 ? (
          <p className="text-gray-600 text-lg text-center py-10">
            It looks a little empty here! Start creating your first blog.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {blogs.map((blog) => (
              <PostCard
                key={blog._id}
                id={blog._id}
                title={blog.title}
                featureImage={blog.coverImage}
              />
            ))}
          </div>
        )}
      </div>
    </>
    // </div>
  );
};

export default Profile;
