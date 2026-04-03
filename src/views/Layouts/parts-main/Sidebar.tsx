import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import { menuItems, MenuItem } from "./MenuItems";

export const Sidebar = ({ sidebar, role }: { sidebar: string; role: string | null }) => {
  const location = useLocation();
  const isCollapsed = sidebar === "mini-sidebar";
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleDropdown = (label: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const hasAccess = (item: MenuItem) => {
    if (!role) return false;
    if (!item.roles) return true;
    return item.roles.includes(role.toLowerCase());
  };

  const renderMenuItem = (item: any, index: number) => {
    if (!hasAccess(item)) return null;

    const isActive = location.pathname.startsWith(item.path);
    const hasChildren = item.children && item.children.length > 0;
    const isDropdownOpen = openDropdowns[item.label];

    const filteredChildren = item.children?.filter((child: any) => hasAccess(child)) || [];

    if (hasChildren && !item.isDropdown) {
      if (filteredChildren.length === 0) return null;
      return (
        <div key={index} className="mb-4">
          <div className="px-6 py-2 text-white/70 text-sm font-medium uppercase tracking-wide">
            {!isCollapsed || isMobile ? item.label : "..."}
          </div>
          <div className="space-y-0">
            {filteredChildren.map((child: any, childIndex: number) => {
              const childIsActive = location.pathname.startsWith(child.path);
              return (
                <div key={childIndex} className="relative">
                  <Link
                    to={child.path}
                    className={`group relative flex items-center gap-3 pl-7 pr-5 py-3 transition-all duration-300 z-20
                      ${isCollapsed && !isMobile ? "justify-center w-12 h-12 mx-auto rounded-full" : isMobile ? "rounded-none" : "rounded-l-full"}
                      ${childIsActive ? "bg-white text-emerald-600 font-semibold" : "text-white hover:bg-white/15"}
                    `}
                  >
                    <span className="text-lg flex-shrink-0">{child.icon}</span>
                    {(!isCollapsed || isMobile) && <span className="whitespace-nowrap">{child.label}</span>}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (item.isDropdown) {
      if (filteredChildren.length === 0) return null;
      return (
        <div key={index} className="mb-2">
          <div className="relative">
            <button
              onClick={() => toggleDropdown(item.label)}
              className={`group relative flex items-center gap-3 pl-7 pr-5 py-3 transition-all duration-300 z-20 w-full
                ${isCollapsed && !isMobile ? "justify-center w-12 h-12 mx-auto rounded-full" : isMobile ? "rounded-none" : "rounded-l-full"}
                ${isActive ? "bg-white text-emerald-600 font-semibold" : "text-white hover:bg-white/15"}
              `}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {(!isCollapsed || isMobile) && (
                <>
                  <span className="whitespace-nowrap flex-1 text-left">{item.label}</span>
                  <span className="text-sm">
                    {isDropdownOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </span>
                </>
              )}
            </button>
          </div>
          {isDropdownOpen && (!isCollapsed || isMobile) && (
            <div className="ml-4 space-y-0">
              {filteredChildren.map((child: any, childIndex: number) => {
                const childIsActive = location.pathname.startsWith(child.path);
                return (
                  <div key={childIndex} className="relative">
                    <Link
                      to={child.path}
                      className={`group relative flex items-center gap-3 pl-7 pr-5 py-3 transition-all duration-300 z-20
                        ${isMobile ? "rounded-none" : "rounded-l-full"}
                        ${childIsActive ? "bg-white text-emerald-600 font-semibold" : "text-white hover:bg-white/15"}
                      `}
                    >
                      <span className="text-lg flex-shrink-0">{child.icon}</span>
                      <span className="whitespace-nowrap">{child.label}</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <div key={index} className="relative">
        <Link
          to={item.path}
          className={`group relative flex items-center gap-3 pl-7 pr-5 py-3 transition-all duration-300 z-20
            ${isCollapsed && !isMobile ? "justify-center w-12 h-12 mx-auto rounded-full" : isMobile ? "rounded-none" : "rounded-l-full"}
            ${isActive ? "bg-white text-emerald-600 font-semibold" : "text-white hover:bg-white/15"}
          `}
        >
          <span className="text-lg flex-shrink-0">{item.icon}</span>
          {(!isCollapsed || isMobile) && <span className="whitespace-nowrap">{item.label}</span>}
        </Link>
      </div>
    );
  };

  return (
    <>
      {isMobile && (
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 bg-emerald-600 text-white p-2 rounded-full shadow-lg"
        >
          {isMobileMenuOpen ? (
            <X size={24} />
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      )}

      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`h-screen fixed left-0 top-0 z-40 transition-all duration-300
          ${isCollapsed && !isMobile ? "w-20" : "w-64"}
          ${isMobile ? (isMobileMenuOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}
          bg-gradient-to-b from-emerald-600 to-green-500 text-white overflow-hidden`}
      >
        <div className="flex flex-col items-center py-6">
          {!isCollapsed || isMobile ? (
            <h1 className="text-2xl font-bold">EnvoRent</h1>
          ) : (
            <span className="text-lg font-bold">ER</span>
          )}
        </div>

        <div className={`${isMobile ? "h-0" : "h-8"}`} />

        <nav
          className={`space-y-0 relative overflow-y-auto pl-2 ${
            isMobile ? "h-[calc(100vh-120px)]" : "h-[calc(100vh-180px)]"
          }`}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style jsx>{`
            nav::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {menuItems.map((item, index) => renderMenuItem(item, index))}
        </nav>
      </aside>
    </>
  );
};
