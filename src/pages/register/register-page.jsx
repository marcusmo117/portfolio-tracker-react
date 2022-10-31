import React, { useState } from "react";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const resp = await axios({
        method: "post",
        url: `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/register`,
        data:
        {
          email,
          password,
        },
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
        }
      );
      toast.success(resp.data.message);
      localStorage.setItem("user_token", resp.data.token);
      navigate("/")
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };


  return (
    <React.Fragment>
      <h2>Register</h2>
        <div className="container">
            <form>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Username
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        onChange={(e)=> setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        onChange={(e)=> setPassword(e.target.value)}
                    />
                </div>
                <button onClick={handleSubmit} className="btn btn-primary">
                    Register
                </button>
            </form>
            {/* <button type="submit" className="btn btn-primary" onClick={checkSession}>
                    Check Session
            </button> */}
        </div>
    </React.Fragment>
  );
};

export default Register;