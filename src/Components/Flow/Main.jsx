import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../JWT";
import Footer from "./Footer";

const Main = () => {
  const [FormData, setFormData] = useState({
    Username: "",
    Password: "",
  });

  const navigate = useNavigate();

  const FormHandler = async (e) => {
    e.preventDefault();
    let { Username, Password } = FormData;

    if (!Username || !Password) {
      toast.error("Fill all Data");
      return;
    }

    try {
      const res = await api.post("/Login", { ...FormData });
      const data = res.data;
      const Status = data.Status;
      const Token = data.access_token;
      const Message = data.Message;
      console.log("Login Response", data);

      if (Status === "Success" && Token) {
        localStorage.clear();
        localStorage.setItem("access_token", Token);
        navigate("/Dashboard", { replace: true });
        toast.success(Message || "Login Successful");
      } else if (Status === "Warning") {
        toast.warn(Message || "Warning Message");
      } else {
        toast.error(Message || "Error Message");
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
      <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="text-center mb-4">
          <i className="bi bi-shield-lock fs-1 text-primary"></i>
          <h2 className="mt-2">Login</h2>
          <p className="text-muted small">
            Please enter your credentials to continue
          </p>
        </div>
        <form onSubmit={FormHandler}>
          <div className="mb-3">
            <label htmlFor="Username" className="form-label fw-semibold">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="Username"
              name="Username"
              placeholder="Enter your username"
              value={FormData.Username}
              onChange={ChangeHandler}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="Password" className="form-label fw-semibold">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="Password"
              name="Password"
              placeholder="Enter your password"
              value={FormData.Password}
              onChange={ChangeHandler}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            <i className="bi bi-box-arrow-in-right me-2"></i> Login
          </button>
        </form>
        <div className="text-center mt-3">
          <small>
            Don’t have an account?{" "}
            <a href="/Register" className="text-decoration-none">
              Register
            </a>
          </small>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Main;
