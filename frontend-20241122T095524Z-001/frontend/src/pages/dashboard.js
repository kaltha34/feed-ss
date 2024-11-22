import { useState, useEffect, useRef } from "react";
import CustomNavbar from "../components/navBar";
import { useAuthContext } from "../hooks/useAuthContext";
import { QRCodeCanvas } from "qrcode.react";
import companyImg from "../images/office-building.png";
import { Spinner, Modal, Button } from "react-bootstrap";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const Dashboard = () => {
  const qrRef = useRef();

  const { user } = useAuthContext();

  console.log(user);

  const [company, setCompany] = useState(null);
  const [myCompanyReview, setMyCompanyReview] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showConfirmFinishedPopup, setShowConfirmFinishedPopup] =
    useState(false);
  const [reviewId, setReviewId] = useState(null);
  const [reviewEmail, setReviewEmail] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewUser, setReviewUser] = useState("");

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleConfirmYes = async () => {
    const updatedStatus = {
      status: "seen",
    };

    try {
      const response = await fetch(`/reviews/${reviewId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedStatus),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Status updated successfully:", data);
        sendEmail(
          " 🚀 Update: We're Working on Your Feedback! 🚀 ",
          `Dear ${reviewUser},

🔔 Great news! We wanted to let you know that we've officially started processing your valuable feedback! 🚀✨

Your Feedback -
"${reviewComment}"

Your insights mean a lot to us, and we’re thrilled to get to work on the enhancements you suggested. 🔧💼 Our team is actively focused on bringing these ideas to life, and we’ll keep you posted along the way. 🌈📝

If you have any additional thoughts or details you'd like to share, don’t hesitate to reach out – we're here and always listening! 🎧📬

Thank you once again for your trust and for helping us create an even better experience for everyone. 🌟🙌

Warm regards,

${company.name}, Core Feedback 😊💙`
        );
      } else {
        console.error("Failed to update status:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setShowConfirmPopup(false);
  };

  const handleConfirmFinishedYes = async () => {
    const updatedStatus = {
      status: "finished",
    };

    try {
      const response = await fetch(`/reviews/${reviewId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedStatus),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Status updated successfully:", data);
        sendEmail(
          " 🎉 Your Feedback Has Been Addressed! 🎉 ",
          `Dear ${reviewUser},

✨ We’re excited to let you know that we’ve completed implementing your feedback! ✨

Your Feedback -
"${reviewComment}"

Thanks to your valuable input, we’ve made improvements to enhance our services, and we couldn’t have done it without your thoughtful insights. 💡🌟 Your voice helps shape the experience for everyone, and we’re thrilled to have had the opportunity to act on your suggestions. 🙌🌈

Please feel free to explore the updates, and don’t hesitate to reach out if there’s anything more you’d like to share! We’re here to keep improving and growing together. 🤝💬

Thank you once again for helping us make a positive change! 🌱💫

Warm regards,

${company.name}, Core Feedback 😊🚀`
        );
      } else {
        console.error("Failed to update status:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setShowConfirmFinishedPopup(false);
  };

  const handleReviewStatusFinishClick = (
    reviewId,
    reviewEmail,
    reviewComment,
    reviewUser
  ) => {
    setReviewId(reviewId);
    setReviewEmail(reviewEmail);
    setReviewComment(reviewComment);
    setReviewUser(reviewUser);
    setShowConfirmFinishedPopup(true);
  };

  const handleReviewStatusClick = (
    reviewId,
    reviewEmail,
    reviewComment,
    reviewUser
  ) => {
    setReviewId(reviewId);
    setReviewEmail(reviewEmail);
    setReviewComment(reviewComment);
    setReviewUser(reviewUser);
    setShowConfirmPopup(true);
  };

  const handleConfirmNo = () => {
    setShowConfirmPopup(false);
  };

  const handleConfirmFinishedNo = () => {
    setShowConfirmFinishedPopup(false);
  };

  const [isLoading, setIsLoading] = useState(true);
  const [isLaodingMyReview, setIsLoadingMyReview] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch(`/company/${user.username}`);
        const json = await response.json();

        if (response.ok) {
          setCompany(json);
        } else {
          console.error("Error fetching company data:", json);
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetch completion
      }
    };

    const fetchMyCompanyReview = async () => {
      try {
        const response = await fetch(`/reviews/${user.id}`);
        const json = await response.json();

        if (response.ok) {
          setMyCompanyReview(json);
        } else {
          console.error("Error fetching my company reviews:", json);
        }
      } catch (error) {
        console.error("Error fetching my company reviews:", error);
      } finally {
        setIsLoadingMyReview(false); // Set loading to false after fetch completion
      }
    };

    fetchMyCompanyReview();
    fetchCompany();
  }, [user]);

  const downloadQRCode = () => {
    const canvas = qrRef.current.querySelector("canvas");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${company.name}-QRCode.png`;
    downloadLink.click();
  };

  console.log(reviewEmail, "pky");

  const sendEmail = async (subject, text) => {
    if (!user) {
      alert("you should have logged in");
    }
    const emailData = {
      to: reviewEmail,
      subject: subject,
      text: text,
    };

    const emailResponse = await fetch(`/send-email-company`, {
      method: "POST",
      body: JSON.stringify(emailData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const emailJson = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Failed to send email:", emailJson.error);
    } else {
      console.log("Email sent successfully:", emailJson);
    }
  };

  return (
    <>
      <CustomNavbar />

      {isLoading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" className="custom-spinner" />
          <p>Loading...</p>
        </div>
      ) : company ? (
        <div className="container">
          <div className="main-body">
            <div className="row gutters-sm">
              <div className="col-md-4 mb-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex flex-column align-items-center text-center">
                      <img
                        src={companyImg}
                        alt="Admin"
                        className="rounded-circle"
                        width="150"
                      />
                      <div className="mt-3">
                        <h4 className="profile-info">{company.name}</h4>
                        <p className="text-muted font-size-sm">Company</p>
                        {/* <button className="btn btn-primary">Follow</button>
                              <button className="btn btn-outline-primary">Message</button> */}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card mt-3">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                      <h6 className="mb-0 profile-info">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          stroke="#53ab8b"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-globe mr-2 icon-inline me-2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="2" y1="12" x2="22" y2="12" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                        Website
                      </h6>
                      <span className="text-secondary">
                        {company.profile.website}
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="card mt-3">
                  <div className="card-body">
                    <div className="d-flex flex-column align-items-center text-center">
                      <div className="mt-3">
                        <h4 className="profile-info">Your Company QR Code</h4>
                        <p className="text-muted font-size-sm">
                          {company.name}
                        </p>
                        <div ref={qrRef}>
                          <QRCodeCanvas
                            value={company.qrCode}
                            size={200}
                            level="H"
                          />
                        </div>
                        <button
                          onClick={downloadQRCode}
                          className="btn btn-primary mt-3 btn-download-qr"
                        >
                          Download QR Code
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-8">
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-sm-3">
                        <h6 className="mb-0 profile-info">Username</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                        {company.username}
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <h6 className="mb-0 profile-info">Company Name</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                        {company.name}
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <h6 className="mb-0 profile-info">Email</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                        {company.profile.contactEmail}
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <h6 className="mb-0 profile-info">Phone Number</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                        {company.profile.phoneNumber}
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <h6 className="mb-0 profile-info">Description</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                        {company.profile.description}
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <h6 className="mb-0 profile-info">User since</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                        {new Date(company.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row gutters-sm">
                  <div className="col-sm-6 mb-3">
                    <div className="card h-100">
                      <div className="card-body card-body-review-topic">
                        <div className="review-stars-my">
                          <h4 className="me-3">Customer Feedbacks</h4>
                          <i className="bi bi-star-fill" />
                          <i className="bi bi-star-fill ms-1" />
                          <i className="bi bi-star-fill ms-1" />
                          <i className="bi bi-star-fill ms-1" />
                          <i className="bi bi-star-fill ms-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {myCompanyReview ? (
                  <div className="row gutters-sm">
                    {myCompanyReview.map((review) => (
                      <div key={review._id} className="col-sm-6 mb-3">
                        <div className="card h-100">
                          <div className="card-body">
                            <div className="review-stars">
                              {[...Array(5)].map((_, index) => (
                                <i
                                  key={index}
                                  className={`bi me-1 ${
                                    index < review.rating
                                      ? "bi-star-fill text-warning"
                                      : "bi-star"
                                  }`}
                                />
                              ))}
                            </div>
                            <div
                              className={`${
                                review.status === "seen"
                                  ? "review-status-seen"
                                  : "review-status"
                              } ms-2`}
                            >
                              {capitalizeFirstLetter(review.status)}
                            </div>
                            <button
                              className={`ms-2 ${
                                review.status === "seen" ||
                                review.status === "finished"
                                  ? "disabled-review-status-btn"
                                  : "review-status-read-btn"
                              }`}
                              disabled={review.status === "seen" || review.status === "finished"}
                              onClick={() =>
                                handleReviewStatusClick(
                                  review._id,
                                  review.email,
                                  review.comment,
                                  review.user
                                )
                              }
                            >
                              <i className="bi bi-check-all"></i>
                            </button>

                            <button
                              className={`ms-2 ${
                                review.status === "finished"
                                  ? "disabled-review-status-finish-btn"
                                  : "review-status-finish-btn"
                              }`}
                              disabled={review.status === "finished"}
                              onClick={() =>
                                handleReviewStatusFinishClick(
                                  review._id,
                                  review.email,
                                  review.comment,
                                  review.user
                                )
                              }
                            >
                              <i class="bi bi-bandaid-fill"></i>
                            </button>
                            <h5 className="mt-2">{review.comment}</h5>
                            <p className="profile-info">Lorem, ipsum.</p>
                            <p className="profile-info mt-1">
                              {capitalizeFirstLetter(
                                formatDistanceToNow(new Date(review.createdAt))
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="row gutters-sm">
                    <div className="col-sm-6 mb-3">
                      <div className="card h-100">
                        <div className="card-body card-body-review-not-found">
                          <div className="review-not-found">
                            <h4 className="me-3">No Feedbacks Found</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="error-screen-not-found mt-3">
          <div className="error-container">
            <h5>No company found</h5>
          </div>
        </div>
      )}

      <Modal
        show={showConfirmFinishedPopup}
        onHide={handleConfirmFinishedNo}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Mark as Finished</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to mark this feedback as finished?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleConfirmFinishedNo}>
            No
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmFinishedYes}
            className="read-btn"
          >
            Finish
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showConfirmPopup} onHide={handleConfirmNo} centered>
        <Modal.Header closeButton>
          <Modal.Title>Mark as Read</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to mark this feedback as read?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleConfirmNo}>
            No
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmYes}
            className="read-btn"
          >
            Read
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Dashboard;
