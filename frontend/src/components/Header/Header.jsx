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
  const authData = useSelector((state) => state.auth.userData); // Make sure authData is correctly populated when logged in

  // Define navigation items
  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/sign-up", active: !authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
    { name: "Profile", slug: `/profile/u/${authData?._id}`, active: authStatus && authData?._id },
  ];

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200"> 
      <Container>
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link
            to="/"
            className="text-3xl font-extrabold text-teal-600 hover:text-teal-700 tracking-wide transition-colors duration-200" 
          >
            Blogger
          </Link>

          <ul className="hidden md:flex items-center gap-6"> 

            
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <Button
                    onClick={() => navigate(item.slug)}
                    className="inline-flex items-center justify-center px-5 py-2 border border-transparent rounded-full text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200 shadow-sm" // Refined button styles
                  >
                    {item.name}
                  </Button>
                </li>
              ) : null
            )}

            
            {authStatus && (
              <li className="flex items-center gap-3"> 
                <LogoutBtn />
                
                {authData && authData.avatar ? ( 
                  <Link to={`/profile/u/${authData._id}`}> 
                    <img
                      src={authData.avatar}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full object-cover border-2 border-teal-500 shadow-md cursor-pointer transform hover:scale-105 transition-transform duration-200"
                    />
                  </Link>
                ) : (
                 
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-semibold">
                    
                    {authData?.username ? authData.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </li>
            )}
          </ul>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 text-teal-600 hover:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-md transition-colors duration-200" 
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu (Conditional Rendering) */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-md py-4"> {/* Positioned absolutely */}
            <ul className="flex flex-col gap-3 px-4"> {/* Adjusted padding */}
              <li className="text-slate-600 text-sm pb-2 border-b border-gray-100">Dark Theme</li> {/* Separator */}
              {navItems.map((item) =>
                item.active ? (
                  <li key={item.name}>
                    <Button
                      onClick={() => {
                        navigate(item.slug);
                        setMobileMenuOpen(false); // Close menu on navigation
                      }}
                      className="w-full text-left inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200 shadow-sm"
                    >
                      {item.name}
                    </Button>
                  </li>
                ) : null
              )}
              {authStatus && (
                <li className="pt-2 border-t border-gray-100"> 
                  <LogoutBtn className="w-full" />  
                </li>
              )}
               {authStatus && authData && ( 
                 <li className="flex items-center gap-3 mt-3">
                   {authData.avatar ? (
                     <Link to={`/profile/u/${authData._id}`} onClick={() => setMobileMenuOpen(false)}>
                       <img
                         src={authData.avatar}
                         alt="User Avatar"
                         className="w-10 h-10 rounded-full object-cover border-2 border-teal-500 shadow-md"
                       />
                     </Link>
                   ) : (
                     <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-semibold">
                       {authData?.username ? authData.username.charAt(0).toUpperCase() : 'U'}
                     </div>
                   )}
                   <span className="text-gray-700 font-medium">{authData.fullName || authData.username || 'User'}</span>
                 </li>
               )}
            </ul>
          </div>
        )}
      </Container>
    </header>
  );
};

export default Header;