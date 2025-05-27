import React from "react";
import { Link } from "react-router-dom";
import Container  from "../Container/Container";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
          {/* Branding */}
          <div>
            <h2 className="text-2xl font-bold text-blue-400">Blogger</h2>
            <p className="mt-2 text-gray-400">
              Share your thoughts, stories, and ideas with the world.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-300">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/blog-posts"
                  className="text-gray-300 hover:text-white transition"
                >
                  Blog Posts
                </Link>
              </li>
              <li>
                <Link
                  to="/add-post"
                  className="text-gray-300 hover:text-white transition"
                >
                  Add Post
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="text-gray-300 hover:text-white transition"
                >
                  Signup
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-300">
              Connect
            </h3>
            <div className="flex gap-4">
              {/* Replace these with real icons or links */}
              <a href="#" className="text-gray-400 hover:text-white transition">
                Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Blogger. All rights reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
