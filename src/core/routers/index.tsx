import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "@/views/Pages/NotFoundPage/index";
import AuthPage from "@/views/Pages/Auth/index";
import { MainLayout } from "@/views/Layouts/MainLayout";
import { Cashier, Dashboard, Category, Product, Bundling, BundlingDetail, ProductDetail, ProductCreate, ProductEdit, TransactionHistory, ActivityLogs, User, Pemesanan, Denda } from "@/views/Pages/pages";
import LandingPage from "@/views/Pages/Customer/Landing Page";
import CataloguePage from "@/views/Pages/Customer/Catalogue";
import CartPage from "@/views/Pages/Customer/Cart";
import CheckoutPage from "@/views/Pages/Customer/Checkout";
import PaymentPage from "@/views/test/CheckoutPage";
import OrdersPage from "@/views/Pages/Customer/Orders";
import MockPaymentGateway from "@/views/Pages/Customer/PaymentGateway";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/payment",
    element: <PaymentPage />,
  },
  {
    path: "/payment-gateway/:token",
    element: <MockPaymentGateway />,
  },
  {
    path: "/catalogue",
    element: <CataloguePage />,
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
  {
    path: "/checkout",
    element: <CheckoutPage />,
  },
  {
    path: "/orders",
    element: <OrdersPage />,
  },
  {
    path: "/login",
    element: <AuthPage />,
  },
  {
    path: "",
    element: <MainLayout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "kasir",
        element: <Cashier />,
      },
      {
        path: "categories",
        element: <Category />,
      },
      {
        path: "products",
        element: <Product />
      },
      {
        path: "bundlings",
        element: <Bundling />
      },
      {
        path: "bundling/:id",
        element: <BundlingDetail />
      },
      {
        path: "product/:id",
        element: <ProductDetail />
      },
      {
        path: "product/create",
        element: <ProductCreate />
      },
      {
        path: "product/edit/:id",
        element: <ProductEdit />
      },
      {
        path: "transaction-history",
        element: <TransactionHistory />
      },
      {
        path: "activity-logs",
        element: <ActivityLogs />
      },
      {
        path: "users",
        element: <User />
      },
      {
        path: "pemesanan",
        element: <Pemesanan />
      },
      {
        path: "denda",
        element: <Denda />
      }
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);