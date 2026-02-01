import { AnimatePresence, motion } from "framer-motion";
import { Mail, Search, Bell, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FiLogOut, FiMenu } from "react-icons/fi";

export const Header = ({
  onToggleSidebar,
  sidebar,
}: {
  onToggleSidebar: () => void;
  sidebar: string;
}) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const messageRef = useRef(null);

  const user = {
    name: "Kim Minjeong",
    email: "kimminj@example.com",
    photo: "/public/img/User/userprofile.png",
  };

  const role = ["Super Admin"];

  const setUserDefault = () => {
    console.log("Logged out");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !(profileRef.current as any).contains(e.target)
      ) {
        setShowProfile(false);
      }
      if (
        notificationRef.current &&
        !(notificationRef.current as any).contains(e.target)
      ) {
        setShowNotifications(false);
      }
      if (
        messageRef.current &&
        !(messageRef.current as any).contains(e.target)
      ) {
        setShowMessages(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-gradient-to-r from-[#0050E0] to-purple-600 fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 shadow-lg">
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
        >
          <FiMenu size={20} />
        </button>
      </div>


      <div className="flex items-center space-x-4">

        <div className="relative" ref={profileRef}>
          <div
            className="flex items-center space-x-3 cursor-pointer hover:bg-white/10 rounded-lg p-2 transition-colors"
            onClick={() => setShowProfile(!showProfile)}
          >
            <div className="text-right">
              <div className="font-semibold text-sm text-white">
                {user.name}
              </div>
              <div className="text-xs text-white/80">Super Admin</div>
            </div>
            <div className="relative">
              <img
                src={
                  user.photo
                    ? user.photo
                    : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                }
                className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                alt="Profile"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
          </div>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
              >
                <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                  <div className="flex items-center space-x-4">
                    <img
                      src={
                        user.photo
                          ? user.photo
                          : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                      }
                      alt="Avatar"
                      className="w-16 h-16 rounded-full object-cover border-3 border-white/30"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">
                        {user.name}
                      </h3>
                      <p className="text-sm text-white/80">
                        {role.join(", ")}
                      </p>
                      <p className="text-sm text-white/80 mt-1 flex items-center gap-1">
                        <Mail size={12} />
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <button
                    onClick={setUserDefault}
                    className="w-full py-3 px-4 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center space-x-2 transition-colors font-medium"
                  >
                    <FiLogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};