import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function CourseContent() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [videos, setVideos] = useState([]);

    const [documents, setDocuments] = useState([]);

    const [loading, setLoading] = useState(true);


    useEffect(() => {

        loadCourseContent();

    }, [id]);


    const loadCourseContent = async () => {

        try {

            // ==============================
            // GET USER ID
            // ==============================

            const storedUserId =
                localStorage.getItem("userId");

            const token =
                localStorage.getItem("token");


            console.log("User ID:", storedUserId);

            console.log("Course ID:", id);

            console.log("Token:", token);


            // ==============================
            // CHECK USER LOGIN
            // ==============================

            if (!storedUserId) {

                alert("User ID not found. Please login again.");

                navigate("/login");

                return;

            }


            // ==============================
            // GET COURSE CONTENT
            // ==============================

            const response = await axios.get(

                `http://localhost:5000/api/CourseContent/${id}?userId=${storedUserId}`,

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }

            );


            // ==============================
            // RESPONSE
            // ==============================

            console.log(
                "Course Content Response:",
                response.data
            );


            // ==============================
            // SET VIDEOS
            // ==============================

            setVideos(
                response.data.videos || []
            );


            // ==============================
            // SET DOCUMENTS
            // ==============================

            setDocuments(
                response.data.documents || []
            );


        }

        catch (error) {

            console.log(
                "Course Content Error:",
                error
            );


            console.log(
                "Status:",
                error.response?.status
            );


            console.log(
                "Server Response:",
                error.response?.data
            );


            const message =
                error.response?.data?.message ||
                error.response?.data?.title ||
                "Unable to load course content.";


            alert(message);

        }

        finally {

            setLoading(false);

        }

    };


    // ==============================
    // LOADING
    // ==============================

    if (loading) {

        return (

            <div style={styles.center}>

                <h2>
                    Loading Course Content...
                </h2>

            </div>

        );

    }


    // ==============================
    // PAGE
    // ==============================

    return (

        <div style={styles.page}>


            {/* ================= HEADER ================= */}

            <div style={styles.header}>

                <button
                    style={styles.backButton}
                    onClick={() =>
                        navigate("/user/my-courses")
                    }
                >

                    ← Back to My Courses

                </button>


                <h1>
                    📚 Course Content
                </h1>


                <p>
                    Course ID: {id}
                </p>

            </div>



            {/* ================= VIDEOS ================= */}

            <div style={styles.section}>

                <h2>
                    🎥 Lecture Videos
                </h2>


                {videos.length === 0 ? (

                    <div style={styles.empty}>

                        No videos available.

                    </div>

                ) : (

                    videos.map((video) => (

                        <div
                            key={video.id}
                            style={styles.videoCard}
                        >

                            <h3>
                                {video.title}
                            </h3>


                            <video
                                controls
                                width="100%"
                                src={video.videoUrl}
                                style={styles.video}
                            >

                                Your browser does not support
                                video playback.

                            </video>

                        </div>

                    ))

                )}

            </div>



            {/* ================= DOCUMENTS ================= */}

            <div style={styles.section}>

                <h2>
                    📄 Study Material / Documents
                </h2>


                {documents.length === 0 ? (

                    <div style={styles.empty}>

                        No documents available.

                    </div>

                ) : (

                    documents.map((document) => (

                        <div
                            key={document.id}
                            style={styles.documentCard}
                        >

                            <div>

                                <h3>
                                    📄 {document.title}
                                </h3>


                                <p>
                                    {document.fileType}
                                </p>

                            </div>


                            <a
                                href={document.documentUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={styles.viewButton}
                            >

                                View / Download

                            </a>

                        </div>

                    ))

                )}

            </div>


        </div>

    );

}


// ======================================================
// STYLES
// ======================================================

const styles = {


    page: {

        minHeight: "100vh",

        background: "#f5f7fb",

        padding: "30px"

    },


    center: {

        minHeight: "100vh",

        display: "flex",

        justifyContent: "center",

        alignItems: "center"

    },


    header: {

        background: "#ffffff",

        padding: "25px",

        borderRadius: "12px",

        marginBottom: "25px",

        boxShadow:
            "0 4px 15px rgba(0,0,0,0.08)"

    },


    backButton: {

        padding: "10px 18px",

        border: "none",

        borderRadius: "7px",

        background: "#333",

        color: "#fff",

        cursor: "pointer",

        marginBottom: "15px"

    },


    section: {

        background: "#ffffff",

        padding: "25px",

        borderRadius: "12px",

        marginBottom: "25px",

        boxShadow:
            "0 4px 15px rgba(0,0,0,0.08)"

    },


    videoCard: {

        border: "1px solid #ddd",

        borderRadius: "10px",

        padding: "18px",

        marginBottom: "20px"

    },


    video: {

        maxWidth: "800px",

        borderRadius: "8px",

        background: "#000"

    },


    documentCard: {

        display: "flex",

        justifyContent: "space-between",

        alignItems: "center",

        border: "1px solid #ddd",

        borderRadius: "10px",

        padding: "15px",

        marginBottom: "12px"

    },


    viewButton: {

        padding: "10px 18px",

        background: "#2563eb",

        color: "#fff",

        textDecoration: "none",

        borderRadius: "7px"

    },


    empty: {

        padding: "20px",

        background: "#f5f5f5",

        borderRadius: "8px",

        color: "#666"

    }

};


export default CourseContent;