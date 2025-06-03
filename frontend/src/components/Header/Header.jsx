import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Optional icon package
import LogoutBtn from "./LogoutBtn.jsx";
import Container from "../Container/Container.jsx";
import Button from "../Button.jsx";

const Header = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/sign-up", active: !authStatus },
    { name: "Blog Posts", slug: "/blog-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
  ];

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

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

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-4">
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

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-teal-600 hover:text-teal-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <ul className="flex flex-col md:hidden gap-3 pb-4">
            <li className="text-slate-600 text-sm pl-4">Dark Theme</li>
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <Button
                    onClick={() => {
                      navigate(item.slug);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md transition duration-200 font-medium"
                  >
                    {item.name}
                  </Button>
                </li>
              ) : null
            )}
            {authStatus && (
              <li className="pl-4">
                <LogoutBtn />
              </li>
            )}
          </ul>
        )}
      </Container>
    </header>
  );
};

export default Header;
