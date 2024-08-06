import React, { useState } from "react";
import axios from 'axios';
import Loader from './Loader';
import '../assets/css/signup.css';

export const Signup = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/signup', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password
      });

      setSuccess(true);
      console.log(response.data);

    } catch (error) {
      console.error('There was an error!', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    setSuccess(false);
    window.location.reload();
  };

  return (
    <div id="signup">
      <div className="">
        {loading && <Loader />}
        {success && (
          <div className="popup-overlay">
            <div className="popup">
              <p>Signup successful! Please verify your email.</p>
              <button onClick={handleClosePopup}>Close</button>
            </div>
          </div>
        )}
        <div className="row">
          <form className="form" onSubmit={handleSubmit}>
            <div className="section-title text-center">
              <h2>Sign Up</h2>
              <p>Create your account to begin your auction journey.</p>
            </div>
            <label>
              <input
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                placeholder="Firstname"
                type="text"
                className="input"
              />
            </label>
            <label>
              <input
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                placeholder="Lastname"
                type="text"
                className="input"
              />
            </label>
            <label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email"
                type="email"
                className="input"
              />
            </label>
            <label>
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password"
                type="password"
                className="input"
              />
            </label>
            <label>
              <input
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm password"
                type="password"
                className="input"
              />
            </label>
            <button className="submit" type="submit">Submit</button>
            <p className="signin">Already have an account? <a href="#login">Log In</a></p>
          </form>
        </div>
      </div>
    </div>
  );
};
