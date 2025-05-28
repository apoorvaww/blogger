import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import LogoutBtn from "./LogoutBtn.jsx";
import  Container from "../Container/Container.jsx";

const Header = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/sign-up",
      active: !authStatus,
    },
    {
      name: "Blog Posts",
      slug: "/blog-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <Container>
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-blue-600 tracking-wide"
          >
            Blogger
          </Link>

          {/* Navigation */}
          <ul className="flex items-center gap-6">
            {/* dark and light theme */}
            <p>dark theme</p>
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-full cursor-pointer transition-colors duration-200 font-medium"
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  );
};

export default Header;
