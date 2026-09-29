import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API_BASE_URL from "../services/api";

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    address: "",
    role: "User",
    isActive: true,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${API_BASE_URL}/Admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Users load failed");
      }

      const users = await response.json();

      const selectedUser = users.find(
        (user) => user.id === Number(id)
      );

      if (!selectedUser) {
        alert("User not found");
        navigate("/admin/users");
        return;
      }

      setForm({
        name: selectedUser.name || "",
        email: selectedUser.email || "",
        mobileNumber: selectedUser.mobileNumber || "",
        address: selectedUser.address || "",
        role: selectedUser.role || "User",
        isActive: selectedUser.isActive,
      });
    } catch (error) {
      console.error(error);
      alert("User data load failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${API_BASE_URL}/Admin/users/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "User update failed");
        return;
      }

      alert(data.message || "User updated successfully");

      navigate("/admin/users");
    } catch (error) {
      console.error(error);
      alert("User update failed");
    }
  };

  if (loading) {
    return <p>Loading user...</p>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h2>Edit User</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "500px",
          display: "grid",
          gap: "15px",
        }}
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="mobileNumber"
          placeholder="Mobile Number"
          value={form.mobileNumber}
          onChange={handleChange}
        />

        <textarea
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          required
        >
          <option value="User">User</option>
          <option value="Teacher">Teacher</option>
          <option value="Admin">Admin</option>
        </select>

        <label>
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
          Active
        </label>

        <button type="submit">
          Update User
        </button>

        <button
          type="button"
          onClick={() => navigate("/admin/users")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditUser;