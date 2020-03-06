import React, { Component } from "react";
import "./index.css";
import LoginForm from "../../components/LoginForm";
import SimpleSearch from "../../components/SimpleSearch";

export default class LandingPage extends Component {
    render() {
        return (
            <div className="landing">
                <div className="slide">
                    <div className="d-flex justify-content-end w-100">
                        <div>
                            <div className="my-form intro">
                                <span>COMMERCIALE4.0.COM</span> is community of
                                companies of the mechanical industry. We
                                revolutionize the way companies connect with
                                each other, building the networking of the
                                future!
                                <p>Join us! No fees or hidden costs.</p>
                            </div>
                            <LoginForm />
                        </div>
                    </div>
                    <div className="d-flex justify-content-start w-100">
                        <SimpleSearch />
                    </div>
                </div>
                <div className="about">
                    <div className="d-flex py-3">
                        <img
                            src="images/profile.png"
                            className="avatar"
                            alt=""
                        />
                        <div className="pl-4 pt-3">
                            <p className="title">Company Profile</p>
                            <p>
                                You can make your company profile including
                                photos, description, info, contacts and much
                                more.
                            </p>
                        </div>
                    </div>
                    <hr />
                    <div className="d-flex py-3">
                        <img src="images/earth.png" className="avatar" alt="" />
                        <div className="pl-4 pt-3">
                            <p className="title">Advanced search system</p>
                            <p>
                                Thanks to our #TAGS system. It's much easier to
                                be found from other companies of the mechanical
                                industry.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
