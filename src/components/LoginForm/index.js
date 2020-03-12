import React, { Component } from "react";
import "./index.css";
import { requestAPI } from "../../utils/api";

export default class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            remember: false
        };

        this.inputEmail = React.createRef();
        this.inputPassword = React.createRef();
    }

    handleClickSignup = e => {
        window.location.href = "/register";
    };

    handleClickRemember = e => {
        this.setState({
            remember: !this.state.remember
        });
    };

    handleClickLogin = e => {
        requestAPI("/user/login", "POST", {
            email: this.inputEmail.current.value,
            password: this.inputPassword.current.value
        }).then(res => {
            console.log(res);
            if (res.status !== 1) {
                alert(res.message);
            } else {
                sessionStorage.setItem("userEmail", res.data.email);
                window.location.href = "/";
            }
        });
    };

    render() {
        const bottomPanelSM = (
            <div className="bottom-panel-sm">
                <div className="mx-auto w-25 mt-4">
                    <button
                        className="txt-upper"
                        onClick={this.handleClickLogin}
                    >
                        Log in
                    </button>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-5">
                    <a href="/forgot-password" className="">
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
                    <a href="/forgot-password" className="">
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
                <button
                    className="txt-upper w-100 mt-4"
                    onClick={this.handleClickLogin}
                >
                    Sign in
                </button>
            </div>
        );

        return (
            <div className="my-form login-form">
                <span className="title text-center mt-4">log in</span>
                <div className="input-row">
                    <div className="mx-auto">
                        <img src="images/login/username.png" alt="" />
                        <input
                            type="text"
                            name="email"
                            placeholder="Email"
                            ref={this.inputEmail}
                        />
                    </div>
                </div>
                <div className="input-row">
                    <div className="mx-auto">
                        <img src="images/login/pass.png" alt="" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            ref={this.inputPassword}
                        />
                    </div>
                </div>
                {bottomPanelSM}
                {bottomPanelXS}
            </div>
        );
    }
}
