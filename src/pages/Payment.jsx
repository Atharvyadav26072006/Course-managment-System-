import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Payment.css";


function Payment() {

    const { id } = useParams();

    const navigate = useNavigate();

    const location = useLocation();


    const handlePayment = async () => {

        try {

            // Get logged-in user ID
            const storedUserId = localStorage.getItem("userId");

            console.log("Stored User ID:", storedUserId);

            console.log("Course ID:", id);


            // Check User ID

            if (!storedUserId) {

                alert("User ID not found. Please login again.");

                navigate("/login");

                return;
            }


            const userId = Number(storedUserId);

            const courseId = Number(id);


            // Validate IDs

            if (!userId || !courseId) {

                alert("Invalid User ID or Course ID.");

                return;
            }


            // Get Course Name

            const courseName =
                location.state?.courseName || "";


            // ================================
            // PAYMENT API
            // ================================

            const response = await axios.post(

                "http://localhost:5000/api/BuyCourse/buy",

                {
                    userId: userId,

                    courseId: courseId,

                    courseName: courseName
                }

            );


            console.log(
                "Payment Response:",
                response.data
            );


            // ================================
            // PAYMENT SUCCESS
            // ================================

            alert("✅ Payment Successful");


            // ================================
            // GO TO COURSE CONTENT
            // ================================

            navigate(
                `/user/course-content/${courseId}`
            );


        }

        catch (error) {

            console.log(
                "Status:",
                error.response?.status
            );

            console.log(
                "Response:",
                error.response?.data
            );

            console.log(
                "Full Error:",
                error
            );


            const message =

                error.response?.data?.message ||

                error.response?.data?.title ||

                "Payment Failed";


            alert(message);

        }

    };


    return (

        <div className="payment-page">

            <div className="payment-card">

                <h1>
                    Course Payment
                </h1>


                <h3>
                    Course ID : {id}
                </h3>


                <h2>
                    ₹75,000
                </h2>


                <p>
                    Click Pay Now to complete payment.
                </p>


                <button
                    className="pay-btn"
                    onClick={handlePayment}
                >

                    Pay Now

                </button>

            </div>

        </div>

    );

}


export default Payment;