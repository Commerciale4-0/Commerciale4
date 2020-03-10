import React, { Component } from "react";
import "./index.css";
import * as Validate from "../../utils/Validate";
import { Alert } from "react-bootstrap";
import { requestAPI } from "../../utils/api";

export default class ForgotPasswordPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			alertData: null
		};

		this.inputEmail = React.createRef();
	}

	handleClickDone(e) {
		let valid = Validate.checkEmail(this.inputEmail.current.value);
		Validate.applyToInput(this.inputEmail.current, valid.code);
		if (valid.code !== Validate.VALID) {
			this.setState({
				alertData: {
					variant: "danger",
					text: "Email address" + valid.msg
				}
			});
			return false;
		}

		requestAPI("/user/forgotpwd", "POST", {
			email: this.inputEmail.current.value
		}).then(res => {
			if (res.status === 0) {
				this.setState({
					alertData: { variant: "danger", text: res.message }
				});
			} else {
				this.setState({
					alertData: { variant: "success", text: res.message }
				});
			}
		});
	}

	render() {
		return (
			<div className="forgot-password">
				{this.state.alertData ? (
					<Alert variant={this.state.alertData.variant}>
						{this.state.alertData.text}
					</Alert>
				) : (
					<div></div>
				)}
				<div className="text-center">
					<i className="fa fa-lock" />
				</div>
				<div className="title text-center">Forgot password</div>
				<div className="text">
					When you fill in your registered email address, you will be
					sent instructions on how to reset your password.
				</div>
				<div className="my-3 d-flex justify-content-center">
					<input
						type="text"
						name="email"
						placeholder="Email"
						ref={this.inputEmail}
					/>
				</div>
				<div className="d-flex justify-content-center">
					<button onClick={this.handleClickDone.bind(this)}>
						Send Email
					</button>
				</div>
			</div>
		);
	}
}
