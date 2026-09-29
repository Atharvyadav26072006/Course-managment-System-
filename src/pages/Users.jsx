import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../Services/api";
import "./Users.css";
import "./Users.css";


function Users() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/Admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        localStorage.clear();
        navigate("/login");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to load users.");
        return;
      }

      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Load users error:", error);
      setError(
        "Unable to connect to the backend. Please check that the API is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleEdit = (id) => {
    navigate(`/admin/users/edit/${id}`);
  };

  const handleDelete = async (user) => {
    if (user.role?.toLowerCase() === "admin") {
      alert("Admin account cannot be deleted.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}?`
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${API_BASE_URL}/Admin/users/${user.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const contentType =
        response.headers.get("content-type");

      const data = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        alert(
          data?.message ||
            data ||
            "Unable to delete the user."
        );
        return;
      }

      setUsers((currentUsers) =>
        currentUsers.filter(
          (currentUser) => currentUser.id !== user.id
        )
      );

      alert(data.message || "User deleted successfully.");
    } catch (error) {
      console.error("Delete user error:", error);
      alert("Backend connection failed.");
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Not available";
    }

    const date = new Date(dateValue);

    if (
      Number.isNaN(date.getTime()) ||
      date.getFullYear() <= 1
    ) {
      return "Not available";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredUsers = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !search ||
        user.name?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search) ||
        user.mobileNumber?.toLowerCase().includes(search);

      const matchesRole =
        roleFilter === "All" ||
        user.role?.toLowerCase() ===
          roleFilter.toLowerCase();

      return matchesSearch && matchesRole;
    });
  }, [users, searchText, roleFilter]);

  const activeUsersCount = users.filter(
    (user) => user.isActive
  ).length;

  const inactiveUsersCount =
    users.length - activeUsersCount;

  return (
    <main className="users-page">
      <header className="users-header">
        <div>
          <span className="users-label">
            User Management
          </span>

          <h1>Registered Users</h1>

          <p>
            View, search, update and manage all registered
            accounts.
          </p>
        </div>

        <button
          type="button"
          className="dashboard-button"
          onClick={() => navigate("/admin")}
        >
          <span>←</span>
          Back to Dashboard
        </button>
      </header>

      <section className="users-summary">
        <article className="summary-card">
          <div className="summary-icon total-icon">
            U
          </div>

          <div>
            <span>Total Users</span>
            <strong>{users.length}</strong>
          </div>
        </article>

        <article className="summary-card">
          <div className="summary-icon active-icon">
            ✓
          </div>

          <div>
            <span>Active Users</span>
            <strong>{activeUsersCount}</strong>
          </div>
        </article>

        <article className="summary-card">
          <div className="summary-icon inactive-icon">
            !
          </div>

          <div>
            <span>Inactive Users</span>
            <strong>{inactiveUsersCount}</strong>
          </div>
        </article>
      </section>

      <section className="users-table-card">
        <div className="users-toolbar">
          <div className="users-search-wrapper">
            <span className="users-search-icon">
              ⌕
            </span>

            <input
              type="text"
              value={searchText}
              onChange={(event) =>
                setSearchText(event.target.value)
              }
              placeholder="Search by name, email or mobile..."
            />
          </div>

          <div className="users-toolbar-actions">
            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(event.target.value)
              }
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
              <option value="Teacher">Teacher</option>
              <option value="Student">Student</option>
            </select>

            <button
              type="button"
              className="refresh-button"
              onClick={loadUsers}
            >
              Refresh
            </button>
          </div>
        </div>

        {loading && (
          <div className="users-message">
            <div className="loading-spinner"></div>
            <p>Loading registered users...</p>
          </div>
        )}

        {!loading && error && (
          <div className="users-error">
            <strong>Unable to load users</strong>
            <p>{error}</p>

            <button type="button" onClick={loadUsers}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="table-responsive">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Contact</th>
                    <th>Role</th>
                    <th>Address</th>
                    <th>Registered</th>
                    <th>Status</th>
                    <th className="actions-heading">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-profile-cell">
                          <div className="user-avatar">
                            {user.name
                              ?.charAt(0)
                              .toUpperCase() || "U"}
                          </div>

                          <div>
                            <strong>{user.name}</strong>
                            <span>User ID: #{user.id}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="contact-cell">
                          <strong>{user.email}</strong>

                          <span>
                            {user.mobileNumber ||
                              "No mobile number"}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`role-badge role-${user.role?.toLowerCase()}`}
                        >
                          {user.role || "User"}
                        </span>
                      </td>

                      <td>
                        <span className="secondary-text">
                          {user.address ||
                            "Not provided"}
                        </span>
                      </td>

                      <td>
                        <span className="secondary-text">
                          {formatDate(
                            user.registrationDate
                          )}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            user.isActive
                              ? "status-badge status-active"
                              : "status-badge status-inactive"
                          }
                        >
                          <span className="status-dot"></span>

                          {user.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td>
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="edit-button"
                            onClick={() =>
                              handleEdit(user.id)
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-button"
                            disabled={
                              user.role?.toLowerCase() ===
                              "admin"
                            }
                            onClick={() =>
                              handleDelete(user)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="empty-users">
                <div>⌕</div>
                <h3>No users found</h3>
                <p>
                  Try changing your search text or role
                  filter.
                </p>
              </div>
            )}

            <footer className="users-table-footer">
              Showing{" "}
              <strong>{filteredUsers.length}</strong> of{" "}
              <strong>{users.length}</strong> registered
              users
            </footer>
          </>
        )}
      </section>
    </main>
  );
}

export default Users;