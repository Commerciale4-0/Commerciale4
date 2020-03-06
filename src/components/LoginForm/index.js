import React, { Component } from "react";
import "./index.css";

export default class LoginForm extends Component {
    state = {
        remember: false
    };

    handleClickSignup = e => {
        e.preventDefault();
        window.location.href = "/register";
    };

    handleClickRemember = e => {
        this.setState({
            remember: !this.state.remember
        });
    };

    render() {
        return (
            <form className="my-form login-form">
                <span className="title text-center">login</span>
                <div className="d-flex align-items-center mb-3">
                    <div className="mx-auto">
                        <img src="images/login/username.png" alt="" />
                        <input type="text" name="email" placeholder="Email" />
                    </div>
                </div>
                <div className="d-flex align-items-center">
                    <div className="mx-auto">
                        <img src="images/login/pass.png" alt="" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                        />
                    </div>
                </div>
                <div className="mx-auto w-25 mt-4">
                    <button className="txt-upper">log in</button>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-5">
                    <a href="/" className="">
                        Forgot Password?
                    </a>
                    <button
                        className="txt-upper"
                        onClick={this.handleClickSignup}
                    >
                        Register
                    </button>
                </div>
            </form>
        );
    }
}
