import { AnimatePresence, motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FiLogOut, FiMenu } from "react-icons/fi";
import { useAuth } from "@/core/hooks/useAuth";
import { useApiClient } from "@/core/helpers/ApiClient";

type User = {
  name: string;
  email: string;
  photo?: string;
  role?: string;
};

export const Header = ({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) => {
  const apiClient = useApiClient();
  const { logout } = useAuth();

  const fetchedRef = useRef(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchMe = async () => {
      const res = await apiClient.get("/me");
      setUser(res.data.user);
    };

    fetchMe();
  }, [apiClient]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
  };

  return (
    <header className="h-16 bg-gradient-to-r from-emerald-600 to-green-500 fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 shadow-lg">
      <button
        onClick={onToggleSidebar}
        className="text-white hover:bg-white/15 p-2 rounded-lg"
      >
        <FiMenu size={20} />
      </button>

      <div className="relative" ref={profileRef}>
        <div
          onClick={() => setShowProfile(!showProfile)}
          className="flex items-center space-x-3 cursor-pointer hover:bg-white/15 rounded-lg p-2"
        >
          <div className="text-right">
            <div className="font-semibold text-sm text-white">
              {user?.name}
            </div>
            <div className="text-xs text-white/80">
              {user?.role ?? "Super Admin"}
            </div>
          </div>
          <img
            src={
              user?.photo ??
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
            }
            className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
          />
        </div>

        <AnimatePresence>
          {showProfile && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 bg-gradient-to-r from-emerald-600 to-green-500 text-white">
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      user?.photo ??
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                    }
                    className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{user?.name}</h3>
                    <p className="text-sm text-white/80">{user?.role}</p>
                    <p className="text-sm text-white/80 flex items-center gap-1">
                      <Mail size={12} />
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center gap-2"
                >
                  <FiLogOut size={16} />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
