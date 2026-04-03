import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Header } from "./parts-main/Header";
import { Sidebar } from "./parts-main/Sidebar";
import { useLayoutStore } from "@/core/helpers/LayoutStore";
import { getToken } from "@/core/helpers/TokenHandle";
import { useApiClient } from "@/core/helpers/ApiClient";
import Swal from "sweetalert2";
export const MainLayout = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const sidebar = useLayoutStore((state) => state.sidebar);
  const setSidebar = useLayoutStore((state) => state.setSidebar);
  const navigate = useNavigate();
  const location = useLocation();
  const api = useApiClient();

  useEffect(() => {
    const checkAuthAndRole = async () => {
      if (!getToken()) {
        Swal.fire({
          icon: 'warning',
          title: 'Akses Ditolak',
          text: 'Anda harus login untuk mengakses dashboard.',
          confirmButtonColor: '#059669'
        });
        navigate("/login", { replace: true });
        return;
      }

      let currentRole = userRole;

      if (!currentRole) {
        try {
          const res = await api.get('/me');
          currentRole = res.data.user.role?.toLowerCase() || 'superadmin';
          setUserRole(currentRole);
        } catch (error) {
          navigate("/login", { replace: true });
          return;
        }
      }

      const path = location.pathname;

      if (currentRole === 'admin') {
        const allowedPaths = ['/dashboard', '/pemesanan', '/transaction-history'];
        if (!allowedPaths.some(p => path.startsWith(p))) {
          navigate('/dashboard', { replace: true });
          return;
        }
      } else if (currentRole === 'superadmin' || currentRole === 'super admin') {
        if (path.startsWith('/pemesanan') || path.startsWith('/transaction-history')) {
          navigate('/dashboard', { replace: true });
          return;
        }
      }

      setIsAuthenticated(true);
    };

    checkAuthAndRole();
  }, [location.pathname, navigate, api, userRole]);

  useEffect(() => {
    const handleLoad = () => setIsLoaded(true);

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 990) {
        setSidebar("mini-sidebar");
      } else {
        setSidebar("full");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebar]);

  const toggleSidebar = () => {
    setSidebar(sidebar === "full" ? "mini-sidebar" : "full");
  };

  if (!isLoaded || !isAuthenticated) return null;

  return (
    <div className="flex">
      <Sidebar sidebar={sidebar} role={userRole} />
      <div className="flex-1 min-h-screen bg-gray-50 transition-all duration-300">
        <Header onToggleSidebar={toggleSidebar} />
        <main
          className={`pt-16 p-6 transition-all duration-300 ${
            sidebar === "full" ? "pl-64" : "pl-16"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};