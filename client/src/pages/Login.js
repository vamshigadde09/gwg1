import React from "react";
import "../styles/RegiserStyles.css";
import { Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onFinishHandler = async (values) => {
    try {
      setIsSubmitting(true);
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:8080/api/v1/user/login",
        values
      );
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
      }

      dispatch(hideLoading());
      setIsSubmitting(false);

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        message.success("Login Successfully");

        if (res.data.role === "Student") {
          navigate("/StudentPortal");
        } else if (res.data.role === "Teacher") {
          navigate("/TeacherPortal");
        }
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      setIsSubmitting(false);
      message.error(
        "Login failed: " + (error.response?.data?.message || "Unknown error")
      );
    }
  };

  return (
    <div className="center-container">
      <div className="form-container">
        <Form
          layout="vertical"
          onFinish={onFinishHandler}
          className="custom-form"
        >
          <h3 className="text-center">Login Form</h3>
          <Form.Item label="Email" name="email">
            <Input type="email" required />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input type="password" required />
          </Form.Item>
          <Link to="/register" className="custom-link">
            Not a user? Register here
          </Link>
          <button className="custom-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
