import React from "react";
import { Link } from "react-router-dom";
import Container from "../Container/Container";

const Footer = () => {
  return (
    <footer className="bg-slate-100 text-slate-800 border-t border-slate-200 mt-10">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 py-12">
          {/* Branding */}
          <div>
            <h2 className="text-2xl font-bold text-teal-600">Blogger</h2>
            <p className="mt-2 text-slate-600 text-sm">
              Share your thoughts, stories, and ideas with the world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-teal-500">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-slate-600 hover:text-teal-600 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/blog-posts"
                  className="text-slate-600 hover:text-teal-600 transition-colors"
                >
                  Blog Posts
                </Link>
              </li>
              <li>
                <Link
                  to="/add-post"
                  className="text-slate-600 hover:text-teal-600 transition-colors"
                >
                  Add Post
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-teal-600 transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/sign-up"
                  className="text-slate-600 hover:text-teal-600 transition-colors"
                >
                  Signup
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-teal-500">
              Connect
            </h3>
            <div className="flex flex-col gap-2 text-sm">
              <a
                href="#"
                className="text-slate-600 hover:text-teal-600 transition-colors"
              >
                Facebook
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-teal-600 transition-colors"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-teal-600 transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4 pb-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Blogger. All rights reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
