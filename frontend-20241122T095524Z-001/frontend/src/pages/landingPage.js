import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomNavbar from "../components/navBar";
import { QRCodeCanvas } from "qrcode.react";
import "../css/landingPage.css";
import { Spinner } from "react-bootstrap"; // Import Bootstrap modal

import companyImg from "../images/office-building.png";

const LandingPage = () => {
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useState(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch(`/company`);
        if (!response.ok) {
          throw new Error(`Failed to fetch company: ${response.statusText}`);
        }

        const json = await response.json();
        setCompany(json);
      } catch (error) {
        console.error("Error fetching company:", error);
        setCompany(null); // You can handle the error here (e.g., showing an error message)
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompany();
  }, []);

  return (
    <>
      <CustomNavbar />

      {isLoading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" className="custom-spinner" />
          <p>Loading...</p>
        </div>
      ) : company ? (
        <div className="container mt-5">
          <div className="row">
            {company.map((company) => (
              <div key={company._id} className="col-md-4 mb-4">
                <div className="card-company-info">
                  <img src={companyImg} alt="Avatar" className="card-img-top" />
                  <div className="card-body-info">
                    <h4 className="card-title profile-info">{company.name}</h4>
                    {/* <p className="card-text mt-3 text-align-justify">Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto consectetur possimus enim at perspiciatis obcaecati? Illum quo itaque laboriosam placeat velit doloremque? Laborum ut alias blanditiis necessitatibus fugiat quasi unde?</p>
                  <p className="card-text">
                    <strong className="profile-info">Contact Email:</strong> {company.profile.contactEmail}
                  </p>
                  <p className="card-text">
                    <strong className="profile-info">Phone:</strong> {company.profile.phoneNumber}
                  </p> */}
                    {/* <p className="card-text mt-2">
                    <strong className="profile-info">Website:</strong> {company.profile.website}
                  </p> */}
                    <div className="mt-3">
                      <QRCodeCanvas
                        value={company.qrCode}
                        size={150}
                        level="H"
                        className="mt-2"
                      />
                    </div>
                    <div className="mt-2 mb-4">
                      <button
                        className="btn btn-primary btn-view-company"
                        onClick={() => {
                          navigate(`/company/${company.username}`);
                        }}
                      >
                        View Company
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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

export default LandingPage;
