import { useEffect, useState } from "react";
import API_BASE_URL from "../services/api";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "Admin") {
      window.location.href = "/login";
      return;
    }

    fetch(`${API_BASE_URL}/Admin/dashboard`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => setDashboard(data))
      .catch(() => {
        alert("Admin access denied");
        window.location.href = "/login";
      });
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <button onClick={logout}>Logout</button>

      {dashboard ? (
        <div>
          <p>Total Users: {dashboard.totalUsers}</p>
          <p>Total Products: {dashboard.totalProducts}</p>
          <p>Total Categories: {dashboard.totalCategories}</p>
          <p>Total Orders: {dashboard.totalOrders}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default AdminDashboard;