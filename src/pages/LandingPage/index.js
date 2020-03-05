import React, { Component } from "react";
import "./index.css";
import SimpleSearch from "../../components/SimpleSearch";

export default class LandingPage extends Component {
  render() {
    return (
      <div className="landing">
        <div className="slide">
          <SimpleSearch />
        </div>
        <div className="about">
          <div className="d-flex py-2">
            <img src="images/profile.png" className="avatar" alt="" />
            <div className="content">
              <p className="title">Company Profile</p>
              <p>
                You can make your company profile including photos, description,
                info, contacts and much more.
              </p>
            </div>
          </div>
          <hr />
          <div className="d-flex py-2">
            <img src="images/earth.png" className="avatar" alt="" />
            <div className="content">
              <p className="title">Advanced search system</p>
              <p>
                Thanks to our #TAGS system. It's much easier to be found from
                other companies of the mechanical industry.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
