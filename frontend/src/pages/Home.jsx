import React, { useEffect, useState } from "react";
import axios from "axios";
import {PostCard} from "../components/index.js";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSelector } from "react-redux";

// The Home component now accepts a 'user' prop to display the welcome message.
// You should pass the authenticated user object to this component from its parent.
const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/blogs/get-public-blogs`,
          {
            withCredentials: true,
          }
        );
        setPosts(response.data.data.blogs);
        console.log(response.data.data.blogs);
      } catch (error) {
        console.error("Error while loading blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, []);

  return (
    <>
    
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
          Welcome,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-600">
            {user?.username ? user.username : "Guest"}
          </span>
          !
        </h1>
        <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
          Dive into a world of captivating stories, insightful articles, and fresh perspectives.
        </p>
      </div>

      <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
              >
                {/* Skeleton for Image */}
                <Skeleton height={200} className="rounded-t-2xl" />
                <div className="p-5">
                  {/* Skeleton for Title */}
                  <Skeleton height={24} width={`90%`} className="mb-3" />
                  {/* Skeleton for Author */}
                  <Skeleton height={18} width={`60%`} />
                </div>
              </div>
            ))
          : posts.map((post) => (
              <PostCard
                key={post._id}
                id={post._id}
                title={post.title}
                featureImage={post.coverImage}
                author={post.owner.username}
              />
            ))}
      </div>
    

    </>
  );
};

export default Home;
