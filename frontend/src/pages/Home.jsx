import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, PostCard } from "../components";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/blogs/get-public-blogs`,
          { withCredentials: true }
        );
        setPosts(response.data.data.blogs);
        console.log(response.data.data.blogs
        )
      } catch (error) {
        console.error("Error while loading blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-md overflow-hidden"
              >
                <Skeleton height={192} />
                <div className="p-4">
                  <Skeleton height={20} width={`100%`} className="mb-2" />
                  <Skeleton height={16} width={`80%`} />
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
    </div>
  );
};

export default Home;
