function UserDashboard() {
  const role = localStorage.getItem("role");

  if (role !== "User") {
    window.location.href = "/login";
  }

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div>
      <h2>User Dashboard</h2>
      <p>Welcome User</p>

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default UserDashboard;