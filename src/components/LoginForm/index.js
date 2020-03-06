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
        const bottomPanelSM = (
            <div className="bottom-panel-sm">
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
            </div>
        );

        const bottomPanelXS = (
            <div className="bottom-panel-xs">
                <div className="d-flex justify-content-center">
                    <a href="/" className="">
                        Forgot Password?
                    </a>
                </div>
                <div className="d-flex justify-content-center mt-5">
                    <input
                        id="rememberme"
                        type="checkbox"
                        name="remember-me"
                        className="input-checkbox"
                    />
                    <label
                        className="label-checkbox"
                        htmlFor="rememberme"
                        onClick={this.handleClickRemember}
                    >
                        Remember me
                    </label>
                </div>
                <button className="txt-upper w-100 mt-4">Sign in</button>
            </div>
        );

        return (
            <form className="my-form login-form">
                <span className="title text-center mt-3">log in</span>
                <div className="input-row">
                    <div className="mx-auto">
                        <img src="images/login/username.png" alt="" />
                        <input type="text" name="email" placeholder="Email" />
                    </div>
                </div>
                <div className="input-row">
                    <div className="mx-auto">
                        <img src="images/login/pass.png" alt="" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                        />
                    </div>
                </div>
                {bottomPanelSM}
                {bottomPanelXS}
            </form>
        );
    }
}
