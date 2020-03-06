import React, { Component } from "react";
import "./index.css";

export default class Footer extends Component {
  render() {
    return (
      <div className="footer row">
        <div className="col-md-3">
          <a href="/terms">terms and conditions</a>
        </div>
        <div className="col-md-3">
          <a href="policy">pravicy policy</a>
        </div>
      </div>
    );
  }
}
