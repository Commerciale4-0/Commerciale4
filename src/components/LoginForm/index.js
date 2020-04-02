import React, { Component } from "react";
import "./index.css";
import { requestAPI } from "../../utils/api";
import { LOGGED_USER } from "../../utils";
import * as Validate from "../../utils/Validate";
import { Alert } from "react-bootstrap";
import SpinnerView from "../SpinnerView";

export default class LoginForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			remember: false,
			alertData: null,
			isProcessing: false
		};

		this.refEmail = React.createRef();
		this.refPassword = React.createRef();
	}

	handleClickSignup = e => {
		window.location.href = "/register";
	};

	handleClickRemember = e => {
		this.setState({
			remember: !this.state.remember
		});
	};

	validate = () => {
		let valid = Validate.checkEmail(this.refEmail.current.value);
		if (valid.code !== Validate.VALID) {
			alert("Email address" + valid.msg);
			return false;
		}

		return true;
	};

	handleClickLogin = e => {
		if (!this.validate()) {
			return;
		}

		this.setState({ isProcessing: true });
		requestAPI("/user/login", "POST", {
			email: this.refEmail.current.value,
			password: this.refPassword.current.value
		}).then(res => {
			if (res.status !== 1) {
				alert(res.message);
			} else {
				sessionStorage.setItem(LOGGED_USER, JSON.stringify(res.data));
				window.location.href = "/";
			}
			this.setState({ isProcessing: false });
		});
	};

	render() {
		let { alertData, isProcessing } = this.state;

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
				{alertData ? (
					<Alert variant={alertData.variant}>{alertData.text}</Alert>
				) : (
					<div></div>
				)}
				<span className="title text-center mt-4">log in</span>
				<div className="input-row">
					<div className="mx-auto">
						<img src="images/login/username.png" alt="" />
						<input
							type="text"
							name="email"
							placeholder="Email"
							ref={this.refEmail}
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
							ref={this.refPassword}
						/>
					</div>
				</div>
				{bottomPanelSM}
				{bottomPanelXS}
				{isProcessing && <SpinnerView />}
			</div>
		);
	}
}
