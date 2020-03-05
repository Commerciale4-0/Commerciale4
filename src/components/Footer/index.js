import React, { Component } from "react";
import "./index.css";

export default class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <div className="row">
          <div className="footer-menu col-md-6">
            <ul>
              <li>
                <a href="/terms">Terms and Conditions</a>
              </li>
              <li>
                <a href="/policy">Privacy Policy</a>
              </li>
            </ul>
          </div>
          <div className="copyright-text col-md-6 text-right">
            <p>
              Copyright &copy; 2020, All Right Reserved{" "}
              <a href="index.html">Star</a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
