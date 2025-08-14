import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../JWT";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const Register = () => {
  const [FormData, setFormData] = useState({
    Type: "",
    Username: "",
    Email: "",
    Password: "",
    RePassword: "",
  });

  const [OTPValue, setOTPValue] = useState("");
  const navigate = useNavigate();

  const FormHandler = async (e) => {
    e.preventDefault();
    let { Type, Username, Email, Password, RePassword } = FormData;

    if (!Type || !Username || !Email || !Password || !RePassword) {
      toast.warn("Please fill all inputs");
      return;
    }

    // Username regex: at least 4 chars, must contain letters and numbers
    const usernameRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/;
    if (!usernameRegex.test(Username)) {
      toast.warn(
        "Username must be at least 4 characters long and contain both letters and numbers"
      );
      return;
    }

    // Strong password regex
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(Password)) {
      toast.warn(
        "Password must be at least 8 characters long, contain uppercase, lowercase, number, and special character"
      );
      return;
    }

    if (Password !== RePassword) {
      toast.warn("Passwords do not match");
      return;
    }

    try {
      const res = await api.post("/Register", { ...FormData });
      const { Status, Message } = res.data;

      if (Status === "Success") {
        toast.success(Message || "Registration successful");
        const otpModal = new bootstrap.Modal(
          document.getElementById("OTPModal")
        );
        otpModal.show();
      } else if (Status === "Warning") {
        toast.warn(Message || "Warning");
      } else {
        toast.error(Message || "Error");
      }
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.Message) ||
        error.message ||
        "Something went wrong";
      toast.error(message);
    }
  };


  const HandleOTPSending = async (e) => {
    e.preventDefault();
    if (!OTPValue) {
      toast.warn("Please enter OTP");
      return;
    }

    try {
      const res = await api.post("/CheckOTP", { OTP: OTPValue });
      const { Status, Message } = res.data;

      if (Status === "Success") {
        const otpModal = bootstrap.Modal.getInstance(
          document.getElementById("OTPModal")
        );
        otpModal.hide();
        document.body.classList.remove("modal-open");
        document
          .querySelectorAll(".modal-backdrop")
          .forEach((el) => el.remove());

        toast.success(Message || "OTP verified");
        navigate("/", { replace: true });
      } else if (Status === "Warning") {
        toast.warn(Message || "Warning");
      } else {
        toast.error(Message || "Error");
      }
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.Message) ||
        error.message ||
        "Something went wrong";
      toast.error(message);
    }
  };

  const HandleSendingNewOTP = async () => {
    try {
      const res = await api.get("/ResendOTP");
      const { Status, Message } = res.data;

      if (Status === "Success") {
        toast.success(Message || "OTP sent");
      } else if (Status === "Warning") {
        toast.warn(Message || "Warning");
      } else {
        toast.error(Message || "Error");
      }
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.Message) ||
        error.message ||
        "Something went wrong";
      toast.error(message);
    }
  };

  const ChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <>
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
        <div className="card shadow-lg p-4" style={{ maxWidth: "500px", width: "100%" }}>
            <div className="text-center mb-4">
            <i className="bi bi-person-plus fs-1 text-primary"></i>
            <h2 className="mt-2">Register</h2>
            <p className="text-muted small">
                Create your account to get started
            </p>
            </div>

            <form onSubmit={FormHandler}>
            <div className="mb-3">
                <label className="form-label fw-semibold">Username</label>
                <input
                type="text"
                className="form-control"
                name="Username"
                value={FormData.Username}
                onChange={ChangeHandler}
                placeholder="Enter your username"
                required
                />
                <small className="text-muted">
                  Must be at least 4 characters and contain both letters and numbers.
                </small>
            </div>

            <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                type="email"
                className="form-control"
                name="Email"
                value={FormData.Email}
                onChange={ChangeHandler}
                placeholder="Enter your email"
                required
                />
            </div>

            <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <input
                type="password"
                className="form-control"
                name="Password"
                value={FormData.Password}
                onChange={ChangeHandler}
                placeholder="Enter password"
                required
                />
                <small className="text-muted">
                  Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character (!@#$%^&*).
                </small>
            </div>

            <div className="mb-3">
                <label className="form-label fw-semibold">Confirm Password</label>
                <input
                type="password"
                className="form-control"
                name="RePassword"
                value={FormData.RePassword}
                onChange={ChangeHandler}
                placeholder="Re-enter password"
                required
                />
            </div>

            <div className="mb-3">
                <label className="form-label fw-semibold">Account Type</label>
                <div>
                <div className="form-check form-check-inline">
                    <input
                    type="radio"
                    className="form-check-input"
                    name="Type"
                    value="Team"
                    checked={FormData.Type === "Team"}
                    onChange={ChangeHandler}
                    />
                    <label className="form-check-label">Team</label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                    type="radio"
                    className="form-check-input"
                    name="Type"
                    value="Person"
                    checked={FormData.Type === "Person"}
                    onChange={ChangeHandler}
                    />
                    <label className="form-check-label">Person</label>
                </div>
                </div>
            </div>

            <button type="submit" className="btn btn-primary w-100">
                <i className="bi bi-person-plus-fill me-2"></i> Register
            </button>
            </form>

            <div className="text-center mt-3">
            <small>
                Already have an account?{" "}
                <a href="/" className="text-decoration-none">
                Login
                </a>
            </small>
            </div>
        </div>
        </div>
        <div className="modal fade" id="OTPModal" tabIndex="-1">
        <div className="modal-dialog">
            <form onSubmit={HandleOTPSending} className="modal-content">
            <div className="modal-header">
                <h1 className="modal-title fs-5">Confirm Email</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
                <label className="form-label">OTP</label>
                <input
                type="number"
                className="form-control"
                onChange={(e) => setOTPValue(e.target.value)}
                value={OTPValue}
                placeholder="Enter OTP code"
                required
                />
            </div>
            <div className="modal-footer d-flex justify-content-between">
                <button type="submit" className="btn btn-primary">
                Verify OTP
                </button>
                <button
                type="button"
                className="btn btn-outline-primary"
                onClick={HandleSendingNewOTP}
                >
                Resend OTP
                </button>
            </div>
            </form>
        </div>
        </div>
        <Footer/>
    </>
  );
};

export default Register;
