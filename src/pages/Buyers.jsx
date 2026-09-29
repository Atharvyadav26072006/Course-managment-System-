import "./Buyers.css";
import { useNavigate, useParams } from "react-router-dom";
import { FaUsers, FaSearch, FaArrowLeft } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";

function Buyers() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [buyers, setBuyers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getBuyers();
  }, [id]);

  const getBuyers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/BuyCourse/buyers/${id}`
      );

      setBuyers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredBuyers = buyers.filter((buyer) =>
    (buyer.userName || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="buyers-page">

      <div className="buyers-header">

        <div>
          <h4>ADMIN MANAGEMENT</h4>

          <h1>Course Buyers</h1>

          <p>
            Students who purchased this course.
          </p>
        </div>

        <button
          className="back-btn"
          onClick={() => navigate("/admin/classes")}
        >
          <FaArrowLeft />
          Back
        </button>

      </div>

      <div className="buyers-cards">

        <div className="buyer-card">
          <h3>Total Buyers</h3>
          <h2>{buyers.length}</h2>
        </div>

        <div className="buyer-card">
          <h3>Course</h3>
          <h2>JEE</h2>
        </div>

        <div className="buyer-card">
          <h3>Status</h3>
          <h2>Active</h2>
        </div>

      </div>

      <div className="buyers-table">

        <div className="table-header">

          <h2>
            <FaUsers />
            Buyer List
          </h2>

          <div className="search-box">

            <FaSearch />

            <input
              type="text"
              placeholder="Search Buyer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

        </div>

        {filteredBuyers.length === 0 ? (

          <div className="empty">

            <FaUsers className="empty-icon" />

            <h2>No Buyers Found</h2>

            <p>
              No student has purchased this course yet.
            </p>

          </div>

        ) : (

          <table>

            <thead>

              <tr>

                <th>ID</th>

                <th>Name</th>

                <th>Email</th>

                <th>Purchase Date</th>

                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {filteredBuyers.map((buyer) => (

                <tr key={buyer.id}>

                  <td>{buyer.id}</td>

                  <td>{buyer.userName}</td>

                  <td>{buyer.email}</td>

                  <td>
                    {new Date(
                      buyer.purchaseDate
                    ).toLocaleDateString()}
                  </td>

                  <td>

                    <button
                      className="assign-btn"
                    >
                      Assign
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
}

export default Buyers;

