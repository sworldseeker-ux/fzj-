import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import GalleryDetail from "@/pages/GalleryDetail";
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminGalleries from "@/pages/AdminGalleries";
import AdminGalleryDetail from "@/pages/AdminGalleryDetail";
import AdminCategories from "@/pages/AdminCategories";
import AdminProfile from "@/pages/AdminProfile";
import AdminSidebar from "@/components/AdminSidebar";

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 min-h-screen">
      <AdminSidebar currentPage="dashboard" />
      <main className="ml-64">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery/:id" element={<GalleryDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        } />
        <Route path="/admin/galleries" element={
          <AdminLayout>
            <AdminGalleries />
          </AdminLayout>
        } />
        <Route path="/admin/galleries/:id" element={
          <AdminLayout>
            <AdminGalleryDetail />
          </AdminLayout>
        } />
        <Route path="/admin/categories" element={
          <AdminLayout>
            <AdminCategories />
          </AdminLayout>
        } />
        <Route path="/admin/profile" element={
          <AdminLayout>
            <AdminProfile />
          </AdminLayout>
        } />
      </Routes>
    </Router>
  );
}