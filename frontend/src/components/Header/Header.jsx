import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import LogoutBtn from "./LogoutBtn.jsx";
import Container from "../Container/Container.jsx";
import Button from "../Button.jsx";

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
            className="text-2xl font-extrabold text-teal-600 tracking-wide"
          >
            Blogger
          </Link>

          {/* Navigation */}
          <ul className="flex items-center gap-4">
            {/* Dark theme placeholder */}
            <li className="text-slate-600 text-sm">Dark Theme</li>

            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <Button
                    onClick={() => navigate(item.slug)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-full transition duration-200 font-medium shadow-sm"
                  >
                    {item.name}
                  </Button>
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
