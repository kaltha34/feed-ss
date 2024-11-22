import { useState, useEffect } from "react";
import CustomNavbar from "../components/navBar";
import { useAuthContext } from "../hooks/useAuthContext";
import "../css/dashboard.css";
import { Spinner, Modal ,Button } from "react-bootstrap";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const Dashboard2 = () => {
  const { user } = useAuthContext();

  // console.log(user);

  const [customer, setCustomer] = useState(null);
  const [myReview, setMyReview] = useState(null);

  const [deleteReviewId, setDeleteReviewId] = useState(null);

  const [showConfirmPopup, setShowConfirmPopup] = useState(false);


  const [isLoading, setIsLoading] = useState(true);
  const [isLaodingMyReview, setIsLoadingMyReview] = useState(true);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const delAction = (reviewId) => {
    setDeleteReviewId(reviewId);
    setShowConfirmPopup(true);
  }

  const handleConfirmYes = async () => {
    try {
      // Send DELETE request
      const response = await fetch(`/reviews/${deleteReviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });

      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`Failed to delete review: ${response.statusText}`);
      }

      // Parse JSON response
      const json = await response.json();
      console.log("Review deleted successfully:", json);
      
      setShowConfirmPopup(false);

      return json; // Optionally return JSON for further use
    } catch (error) {
      console.error("Error deleting review:", error);
    }
    
   
  };

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`/customer/${user.username}`);
        const json = await response.json();

        if (response.ok) {
          setCustomer(json);
        } else {
          console.error("Error fetching customer data:", json);
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    const fetchMyReview = async () => {
      try {
        const response = await fetch(`/myReviews/${user.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const json = await response.json();

        if (response.ok) {
          setMyReview(json);
        } else {
          console.error("Error fetching my reviews:", json);
        }
      } catch (error) {
        console.error("Error fetching my reviews:", error);
      } finally {
        setIsLoadingMyReview(false); // Set loading to false after fetching
      }
    };

    fetchMyReview();
    fetchCustomer();
  }, [user]);

  const handleConfirmNo = () => {
    setShowConfirmPopup(false);
  };



  return (
    <>
      <CustomNavbar />
      {isLoading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" className="custom-spinner" />
          <p>Loading...</p>
        </div>
      ) : customer ? (
        <div className="container">
          <div className="main-body">
            <div className="row gutters-sm">
              <div className="col-md-4 mb-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex flex-column align-items-center text-center">
                      <img
                        src="https://bootdey.com/img/Content/avatar/avatar7.png"
                        alt="Admin"
                        className="rounded-circle"
                        width="150"
                      />
                      <div className="mt-3">
                        <h4 className="profile-info">{customer.fullName}</h4>
                        <p className="text-muted font-size-sm">Customer</p>
                        {/* <button className="btn btn-primary">Follow</button>
                              <button className="btn btn-outline-primary">Message</button> */}
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
                        {customer.username}
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <h6 className="mb-0 profile-info">Full Name</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                        {customer.fullName}
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <h6 className="mb-0 profile-info">Email</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                        {customer.email}
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <h6 className="mb-0 profile-info">Phone Number</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                        {customer.phoneNumber}
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <h6 className="mb-0 profile-info">User since</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row gutters-sm">
                  <div className="col-sm-6 mb-3">
                    <div className="card h-100">
                      <div className="card-body card-body-review-topic">
                        <div className="review-stars-my">
                          <h4 className="me-3">My Reviews</h4>
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

                {isLaodingMyReview ? (
                  <div className="text-center mt-3">
                    <Spinner animation="border" className="custom-spinner" />
                    <p>Loading...</p>
                  </div>
                ) : myReview && myReview.length > 0 ? (
                  <div className="row gutters-sm">
                    {myReview.map((review) => (
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
                                review.status === "requested" ||
                                review.status === "finished"
                                  ? "review-status"
                                  : "review-status-seen"
                              } ms-2`}
                            >
                              {capitalizeFirstLetter(review.status)}
                            </div>
                            <button
                              className={`ms-2 review-status-del-btn
                              `}
                              onClick={() => delAction(review._id)}
                            >
                              <i class="bi bi-trash-fill"></i>
                            </button>
                            <h5 className="mt-2">{review.comment}</h5>
                            <p className="profile-info">{review.companyName}</p>
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
            <h5>No customer found</h5>
          </div>
        </div>
      )}
      <Modal show={showConfirmPopup} onHide={handleConfirmNo} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this?
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
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Dashboard2;
