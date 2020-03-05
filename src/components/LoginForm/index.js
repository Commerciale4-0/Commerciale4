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
			<form className="form">
				<span className="title text-center">Commerciale 4.0</span>
				<div>
					<span className="label">Email</span>
					<input type="text" name="email" />
				</div>
				<div>
					<span className="label">Password</span>
					<input type="password" name="password" />
				</div>
				<div className="d-flex justify-content-between">
					<input
						id="rememberme"
						type="checkbox"
						name="remember-me"
						className="input-checkbox"
					/>
					<label
						// className={`checkbox ${this.state.remember ? "checked" : ""}`}
						className="label-checkbox"
						htmlFor="rememberme"
						onClick={this.handleClickRemember}
					>
						Remember me
					</label>

					<a href="/" className="">
						Forgot Password?
					</a>
				</div>
				<div className="d-flex justify-content-between">
					<button className="txt-upper">Login</button>
					<button className="txt-upper" onClick={this.handleClickSignup}>
						Sign up
					</button>
				</div>
			</form>
		);
	}
}
