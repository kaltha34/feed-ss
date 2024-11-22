import { useEffect, useState, qrRef } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import CustomNavbar from "../components/navBar";
import { QRCodeCanvas } from "qrcode.react";
import companyImg from "../images/office-building.png";
import { Modal, Button, Spinner } from "react-bootstrap"; // Import Bootstrap modal
import formatDistanceToNow from "date-fns/formatDistanceToNow";

import { useAuthContext } from "../hooks/useAuthContext";

import "../css/companyInfo.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const CompanyInfo = () => {
  const { user } = useAuthContext();
  const { companyUsername } = useParams();
  const [company, setCompany] = useState(null);
  const [relReview, setRelReview] = useState(null);

  console.log(user);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCompany, setIsLoadingCompany] = useState(true);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [review, setReview] = useState({
    rating: 0,
    comment: "",
  });

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch(`/company/${companyUsername}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch company: ${response.statusText}`);
        }

        const json = await response.json();
        setCompany(json);
      } catch (error) {
        console.error("Error fetching company:", error);
        setCompany(null);
      } finally {
        setIsLoadingCompany(false);
      }
    };

    fetchCompany();
  }, [companyUsername]);

  useEffect(() => {
    if (company) {
      const fetchReview = async () => {
        try {
          const response = await fetch(`/reviews/${company._id}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch reviews: ${response.statusText}`);
          }

          const json = await response.json();
          setRelReview(json);
        } catch (error) {
          console.error("Error fetching reviews:", error);
          setRelReview([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchReview();
    }
  }, [company]);

  console.log(relReview);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReview((prevReview) => ({
      ...prevReview,
      [name]: value,
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowModal(false);
      setShowLoginModal(true);
      return;
    }

    const response = await fetch(`/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        companyId: company._id,
        companyName: company.name,
        userId: user.id,
        rating: review.rating,
        comment: review.comment,
        status: "requested",
        email: user.email,
        user: user.username,
      }),
    });

    setReview({
      rating: 0,
      comment: "",
    });

    if (response.ok) {
      setShowModal(false);
      setShowSuccessModal(true); // Close the modal after submitting
      // Optionally: Update the company or reviews state here to reflect the new review

      console.log("mail is gone");
      sendEmail(
        " 🥳 Thank You 🥳",
        `Dear ${user.username},

⚡️ Thank you so much for sharing your thoughts with us! ⚡️

We truly appreciate your feedback, and we’re excited to put your insights to work. 💪✨ Your voice matters to us, and we're committed to making the improvements that will create a better experience for you. 💼🔧

Our team is already on it and will start working on your suggestions right away! 🕒🚀

If there's anything else you’d like to add, please feel free to reach out! We’re all ears and always ready to listen. 🎧📞

Thank you once again for helping us grow and improve – we can't wait to bring these positive changes to life! 🌱💫

With warm regards,

${company.name}, Core Feedback 😊 🚀
`
      );
    } else {
      console.log("Failed to add review");
    }
  };

  const sendEmail = async (subject, text) => {
    if (!user) {
      alert("you should have logged in");
    }
    const emailData = {
      to: user.email,
      subject: subject,
      text: text,
    };

    const emailResponse = await fetch(`/send-email`, {
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

      {isLoadingCompany ? (
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
                <div className="card mt-3 pb-3">
                  <div className="card-body">
                    <div className="d-flex flex-column align-items-center text-center">
                      <div className="mt-3">
                        <h4 className="profile-info">Company QR Code</h4>
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
                  </div>
                </div>

                {(!user || user.userType === "customer") && (
                  <div className="row gutters-sm">
                    <div className="col-sm-6 mb-3">
                      <div className="card h-100">
                        <div className="card-body">
                          <button
                            className="btn btn-primary btn-review"
                            onClick={handleShowModal}
                          >
                            Add Review
                          </button>
                          <div className="review-stars ms-3">
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
                )}

                {isLoading ? (
                  <div className="text-center mt-3">
                    <Spinner animation="border" className="custom-spinner" />
                    <p>Loading...</p>
                  </div>
                ) : relReview && relReview.length > 0 ? (
                  <div className="row gutters-sm">
                    {relReview.map((review) => (
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
                                review.status === "requested" || review.status === "finished"
                                  ? "review-status"
                                  : "review-status-seen"
                              } ms-2`}
                            >
                              {capitalizeFirstLetter(review.status)}
                            </div>

                            <h5 className="mt-2">{review.comment}</h5>
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
          {/* Review Modal */}
          <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>Add a Review</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleSubmitReview}>
                <div className="mb-3">
                  <label htmlFor="rating" className="form-label">
                    Rating (1-5)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="rating"
                    name="rating"
                    value={review.rating}
                    onChange={handleReviewChange}
                    min="1"
                    max="5"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="comment" className="form-label">
                    Comment
                  </label>
                  <textarea
                    className="form-control"
                    id="comment"
                    name="comment"
                    value={review.comment}
                    onChange={handleReviewChange}
                    rows="3"
                    required
                  />
                </div>
                <div className="mb-3 text-end">
                  <Button
                    className="me-2"
                    variant="secondary"
                    onClick={handleCloseModal}
                  >
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    className="submit-btn"
                  >
                    Submit Review
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal>

          {/* Login Prompt Modal */}
          <Modal
            show={showLoginModal}
            onHide={() => setShowLoginModal(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Please Log In</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                You need to be logged in to add a review. Please log in first.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowLoginModal(false)}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Success Modal */}
          <Modal
            show={showSuccessModal}
            onHide={() => setShowSuccessModal(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Review Submitted</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Your review has been successfully submitted!</p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowSuccessModal(false)}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      ) : (
        <div className="error-screen-not-found mt-3">
          <div className="error-container">
            <h5>No company found</h5>
          </div>
        </div>
      )}
    </>
  );
};

export default CompanyInfo;
