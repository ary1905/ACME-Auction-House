import React from "react";
import '../assets/css/contact.css'


export const Contact = () => {
  return (
    <div>
      <div id="contact">
        <div className="container">
          <h2>Contact Us</h2>
          <div className="social">
            <ul>
              <li>
                <a href="https://ary1905.github.io/" target="blank">
                  <i className="fa fa-briefcase"></i>
                </a>
              </li>
              <li>
                <a href="https://github.com/ary1905" target="blank">
                  <i className="fa fa-github" aria-hidden="true"></i>
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/aryan-singh-394910250/" target="blank">
                  <i className="fa fa-linkedin-square" aria-hidden="true"></i>
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/aryan_singh0519/" target="blank">
                  <i className="fa fa-instagram" aria-hidden="true"></i>
                </a>
              </li>
            </ul>
            <p>
              &copy; 2024 Acme Auction Page. Made by{" "}
              <a href="https://github.com/ary1905" rel="nofollow">
                Aryan Singh
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
