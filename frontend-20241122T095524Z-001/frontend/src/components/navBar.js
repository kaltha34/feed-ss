import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import {
  Navbar as BootstrapNavbar,
  Nav,
  Container,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import "../css/navBarStyles.css";
import logo from "../images/logo.png";
import { useSignupCompany } from "../hooks/useSignupCompany";
import { useLogout } from "../hooks/useLogout";
import { useLogin } from "../hooks/useLogin";
import { useAuthContext } from "../hooks/useAuthContext";
import { useSignupCustomer } from "../hooks/useSignupCustomer";


const CustomNavbar = () => {
  const navigate = useNavigate();

  const { user } = useAuthContext();

  const [isCustomer, setIsCustomer] = useState(false);

  const { signupCompany, isLoadingCompany, errorCompany } = useSignupCompany();
  const { signupCustomer, isLoadingCustomer, errorCustomer } =
    useSignupCustomer();

  const { logout } = useLogout();

  const { login, isLoading, error } = useLogin();

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [website, setWebsite] = useState();
  const [contactEmail, setContactEmail] = useState();
  const [phoneNumber, setPhoneNumber] = useState();

  const [fullNameCustomer, setFullNameCustomer] = useState();
  const [emailCustomer, setEmailCustomer] = useState();
  const [phoneNumberCustomer, setPhoneNumberCustomer] = useState();
  const [usernameCustomer, setUsernameCustomer] = useState();
  const [passwordCustomer, setPasswordCustomer] = useState();

  const [loginUsername, setLoginUsername] = useState();
  const [loginPassword, setLoginPassword] = useState();

  const handleSubmitCompanyRegister = async (e) => {
    setIsCustomer(false);
    e.preventDefault();
    const generatedQrCode = `http://localhost:3000/company/${username}`;
    const userType = 'company';
    await signupCompany(
      username,
      password,
      name,
      description,
      website,
      contactEmail,
      phoneNumber,
      generatedQrCode,
      userType
    );
    setUsername("");
    setPassword("");
    setName("");
    setDescription("");
    setWebsite("");
    setContactEmail("");
    setPhoneNumber("");
    setShowCompanyRegisterModal(false);

    navigate('/dashboard')
  };

  const handleSubmitCustomerRegister = async (e) => {
    setIsCustomer(true);
    e.preventDefault();
    const userType = 'customer';
    await signupCustomer(
      fullNameCustomer,
      emailCustomer,
      phoneNumberCustomer,
      userType,
      usernameCustomer,
      passwordCustomer
    );
    setFullNameCustomer("");
    setEmailCustomer("");
    setPhoneNumberCustomer("");
    setUsernameCustomer("");
    setPasswordCustomer("");
    setShowCustomerRegisterModal(false);

    navigate('/dashboard2')
  };

  const handleSubmitCompanyLogin = async (e) => {
    setIsCustomer(false);
    e.preventDefault();
    await login(
      "/user/login-company",
      loginUsername,
      loginPassword
    );
    
    navigate('/dashboard')

    setLoginUsername("");
    setLoginPassword("");
    setShowCompanyLoginModal(false);
  };

  const handleSubmitCustomerLogin = async (e) => {
    setIsCustomer(true);
    e.preventDefault();
    await login("/user/login-customer", loginUsername, loginPassword);

    navigate('/dashboard2')

    setLoginUsername("");
    setLoginPassword("");
    setShowCustomerLoginModal(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/dashboard');
  };

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showCompanyLoginModal, setShowCompanyLoginModal] = useState(false);
  const [showCustomerLoginModal, setShowCustomerLoginModal] = useState(false);
  const [showCompanyRegisterModal, setShowCompanyRegisterModal] =
    useState(false);
  const [showCustomerRegisterModal, setShowCustomerRegisterModal] =
    useState(false);

  

  const handleLoginClick = () => setShowLoginModal(true);
  const handleRegisterClick = () => setShowRegisterModal(true);
  const handleCloseLoginModal = () => setShowLoginModal(false);
  const handleCloseRegisterModal = () => setShowRegisterModal(false);

  const handleCompanyLoginClick = () => {
    setShowCompanyLoginModal(true);
    setShowLoginModal(false); // Close the main login modal
    setShowRegisterModal(false); // Also close the register modal if it's open
  };

  const handleCustomerLoginClick = () => {
    setShowCustomerLoginModal(true);
    setShowLoginModal(false); // Close the main login modal
    setShowRegisterModal(false); // Also close the register modal if it's open
  };

  const handleCompanyRegisterClick = () => {
    setShowCompanyRegisterModal(true);
    setShowRegisterModal(false); // Close the main register modal
    setShowLoginModal(false); // Also close the login modal if it's open
  };

  const handleCustomerRegisterClick = () => {
    setShowCustomerRegisterModal(true);
    setShowRegisterModal(false); // Close the main register modal
    setShowLoginModal(false); // Also close the login modal if it's open
  };

  const handleCloseCompanyLoginModal = () => setShowCompanyLoginModal(false);
  const handleCloseCustomerLoginModal = () => setShowCustomerLoginModal(false);
  const handleCloseCompanyRegisterModal = () =>
    setShowCompanyRegisterModal(false);
  const handleCloseCustomerRegisterModal = () =>
    setShowCustomerRegisterModal(false);

  return (
    <header>
      <BootstrapNavbar expand="lg" className="navbar-custom">
        <Container>
          <BootstrapNavbar.Brand href="/">
            <img src={logo} alt="Logo" className="header__logo" />
          </BootstrapNavbar.Brand>
          <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
          <BootstrapNavbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto">
              <NavLink
                exact
                to="/"
                activeClassName="active"
                className="nav-link"
              >
                Home
              </NavLink>
              <NavLink
                to="/about-us"
                activeClassName="active"
                className="nav-link"
              >
                About Us
              </NavLink>
              <NavLink
                to="/guide"
                activeClassName="active"
                className="nav-link"
              >
                Guide
              </NavLink>
              <NavLink
                to="/testimonials"
                activeClassName="active"
                className="nav-link"
              >
                Testimonials
              </NavLink>
            </Nav>
            {user && (
              <Nav className="ml-auto ">
                <div className="d-flex align-items-center">
                  <Link to={user.userType === "customer" ? "/dashboard2" : "/dashboard"} className="username">
                    {user.username}
                  </Link>
                </div>
                <Button
                  className="header__button header__button--register ms-lg-3"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Nav>
            )}

            {!user && (
              <Nav className="ml-auto">
                <Button className="header__button" onClick={handleLoginClick}>
                  Login
                </Button>
                <Button
                  className="header__button header__button--register ms-lg-2"
                  onClick={handleRegisterClick}
                >
                  Register
                </Button>
              </Nav>
            )}
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>

      {/* Main Login Modal */}
      <Modal show={showLoginModal} onHide={handleCloseLoginModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button
            className="w-100 mb-2 company-btn"
            onClick={handleCompanyLoginClick}
          >
            Login as a company
          </Button>
          <Button
            className="w-100 customer-btn"
            onClick={handleCustomerLoginClick}
          >
            Login as a customer
          </Button>
        </Modal.Body>
      </Modal>

      {/* Main Register Modal */}
      <Modal
        show={showRegisterModal}
        onHide={handleCloseRegisterModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button
            className="w-100 mb-2 company-btn"
            onClick={handleCompanyRegisterClick}
          >
            Register as a company
          </Button>
          <Button
            className="w-100 customer-btn"
            onClick={handleCustomerRegisterClick}
          >
            Register as a customer
          </Button>
        </Modal.Body>
      </Modal>

      {/* Company Login Modal */}
      <Modal
        show={showCompanyLoginModal}
        onHide={handleCloseCompanyLoginModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Login as a company</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitCompanyLogin}>
            <Form.Group controlId="companyLoginUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                onChange={(e) => setLoginUsername(e.target.value)}
                value={loginUsername}
              />
            </Form.Group>
            <Form.Group controlId="companyLoginPassword" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                onChange={(e) => setLoginPassword(e.target.value)}
                value={loginPassword}
              />
            </Form.Group>
            <Button type="submit" className="w-100 mt-3 main-btn">
              Login
            </Button>
          </Form>
          <p className="mt-3 text-center">
            Don't have an account?{" "}
            <span className="text-primary" onClick={handleCompanyRegisterClick}>
              Register
            </span>
          </p>
        </Modal.Body>
      </Modal>

      {/* Customer Login Modal */}
      <Modal
        show={showCustomerLoginModal}
        onHide={handleCloseCustomerLoginModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Login as a customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitCustomerLogin}>
            <Form.Group controlId="customerLoginUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                onChange={(e) => setLoginUsername(e.target.value)}
                value={loginUsername}
              />
            </Form.Group>
            <Form.Group controlId="customerLoginPassword" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                onChange={(e) => setLoginPassword(e.target.value)}
                value={loginPassword}
              />
            </Form.Group>
            <Button
              type="submit"
              className="w-100 mt-3 main-btn"
              disabled={isLoading}
            >
              Login
            </Button>
            {error && <div className="form-error mt-3">{error}</div>}
          </Form>
          <p className="mt-3 text-center">
            Don't have an account?{" "}
            <span
              className="text-primary"
              onClick={handleCustomerRegisterClick}
            >
              Register
            </span>
          </p>
        </Modal.Body>
      </Modal>
      {/* Company Register Modal */}
      <Modal
        show={showCompanyRegisterModal}
        onHide={handleCloseCompanyRegisterModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Register as a company</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitCompanyRegister}>
            <Form.Group controlId="companyRegisterName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </Form.Group>

            <Form.Group controlId="companyRegisterDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              />
            </Form.Group>

            <Form.Group controlId="companyRegisterWebsite" className="mt-3">
              <Form.Label>Website</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter website"
                onChange={(e) => setWebsite(e.target.value)}
                value={website}
              />
            </Form.Group>

            <Form.Group
              controlId="companyRegisterContactEmail"
              className="mt-3"
            >
              <Form.Label>Contact Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter contact email"
                onChange={(e) => setContactEmail(e.target.value)}
                value={contactEmail}
              />
            </Form.Group>

            <Form.Group controlId="companyRegisterPhoneNumber" className="mt-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                onChange={(e) => setPhoneNumber(e.target.value)}
                value={phoneNumber}
              />
            </Form.Group>

            <Form.Group controlId="companyRegisterUsername" className="mt-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
            </Form.Group>

            <Form.Group controlId="companyRegisterPassword" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100 mt-3 main-btn"
              disabled={isLoadingCompany}
            >
              Register
            </Button>
            {errorCompany && (
              <div className="form-error mt-3">{errorCompany}</div>
            )}
          </Form>
          <p className="mt-3 text-center">
            Already have an account?{" "}
            <span className="text-primary" onClick={handleCompanyLoginClick}>
              Login
            </span>
          </p>
        </Modal.Body>
      </Modal>

      {/* Customer Register Modal */}
      <Modal
        show={showCustomerRegisterModal}
        onHide={handleCloseCustomerRegisterModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Register as a customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitCustomerRegister}>
            <Form.Group controlId="customerRegisterFullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter full name"
                onChange={(e) => setFullNameCustomer(e.target.value)}
                value={fullNameCustomer}
              />
            </Form.Group>

            <Form.Group controlId="customerRegisterEmail" className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) => setEmailCustomer(e.target.value)}
                value={emailCustomer}
              />
            </Form.Group>

            <Form.Group
              controlId="customerRegisterPhoneNumber"
              className="mt-3"
            >
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                onChange={(e) => setPhoneNumberCustomer(e.target.value)}
                value={phoneNumberCustomer}
              />
            </Form.Group>

            <Form.Group controlId="customerRegisterUsername" className="mt-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                onChange={(e) => setUsernameCustomer(e.target.value)}
                value={usernameCustomer}
              />
            </Form.Group>

            <Form.Group controlId="customerRegisterPassword" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                onChange={(e) => setPasswordCustomer(e.target.value)}
                value={passwordCustomer}
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100 mt-3 main-btn"
              disabled={isLoadingCustomer}
            >
              Register
            </Button>
            {errorCustomer && (
              <div className="form-error mt-3">{errorCustomer}</div>
            )}
          </Form>
          <p className="mt-3 text-center">
            Already have an account?{" "}
            <span className="text-primary" onClick={handleCustomerLoginClick}>
              Login
            </span>
          </p>
        </Modal.Body>
      </Modal>

      
    </header>
  );
};

export default CustomNavbar;
