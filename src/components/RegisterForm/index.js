import React, { Component } from "react";
import "./index.css";
import { Row, Col, Alert } from "react-bootstrap";

import { ATECO_CODES, CITIES } from "../../utils";

import * as Validate from "../../utils/Validate";

import MySelect from "../Custom/MySelect";
import { requestAPI } from "../../utils/api";

export default class RegisterForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			step: 1,
			atecoCodes: ATECO_CODES.slice(1),
			selectedCity: null,
			selectedCode: null,
			checkValidCity: false,
			checkValidCode: false,
			alertData: null,
			policyChecked: false
		};

		this.inputName = React.createRef();
		this.inputVAT = React.createRef();
		this.inputPEC = React.createRef();
		this.inputEmail = React.createRef();
		this.inputPassword = React.createRef();
		this.inputConfirm = React.createRef();
	}

	setAlertData = (success, text) => {
		this.setState({
			alertData: {
				variant: success ? "success" : "danger",
				text: text
			}
		});
	};

	validateStepOne = () => {
		let valid = Validate.checkEmpty(this.inputName.current.value);
		Validate.applyToInput(this.inputName.current, valid.code);
		if (valid.code !== Validate.VALID) {
			this.setAlertData(0, "Offical name" + valid.msg);
			return false;
		}

		if (!this.state.selectedCity) {
			this.setState({
				checkValidCity: true
			});
			this.setAlertData(0, "Please select a city");
			return false;
		}

		valid = Validate.checkVAT(this.inputVAT.current.value);
		Validate.applyToInput(this.inputVAT.current, valid.code);
		if (valid.code !== Validate.VALID) {
			this.setAlertData(0, "VAT number" + valid.msg);
			return false;
		}

		if (!this.state.selectedCode) {
			this.setState({
				checkValidCode: true
			});
			this.setAlertData(0, "Please select an ATECO CODE");
			return false;
		}

		valid = Validate.checkEmpty(this.inputPEC.current.value);
		Validate.applyToInput(this.inputPEC.current, valid.code);
		if (valid.code !== Validate.VALID) {
			this.setAlertData(0, "PEC" + valid.msg);
			return false;
		}

		return true;
	};

	validateStepTwo = () => {
		let valid = Validate.checkEmail(this.inputEmail.current.value);
		Validate.applyToInput(this.inputEmail.current, valid.code);
		if (valid.code !== Validate.VALID) {
			this.setAlertData(0, "Email address" + valid.msg);
			return false;
		}

		valid = Validate.checkPassword(this.inputPassword.current.value);
		Validate.applyToInput(this.inputPassword.current, valid.code);
		if (valid.code !== Validate.VALID) {
			this.setAlertData(0, "Password" + valid.msg);
			return false;
		}

		valid = Validate.checkConfirmPassword(
			this.inputPassword.current.value,
			this.inputConfirm.current.value
		);
		Validate.applyToInput(this.inputConfirm.current, valid.code);
		if (valid.code !== Validate.VALID) {
			this.setAlertData(0, valid.msg);
			return false;
		}

		if (!this.state.policyChecked) {
			this.setAlertData(0, "Please check Privacy and Policy");
			return false;
		}

		return true;
	};

	handleCityChange = selectedCity => {
		this.setState({ selectedCity });
	};

	handleCodeChange = selectedCode => {
		this.setState({ selectedCode });
	};

	handleClickNext = e => {
		e.preventDefault();
		this.setState({
			alertData: null
		});

		if (this.validateStepOne()) {
			this.setState({
				step: 2
			});

			this.inputEmail.current.style.border = 0;
			this.inputPassword.current.style.border = 0;
			this.inputConfirm.current.style.border = 0;
		}
	};

	handleClickBack = e => {
		e.preventDefault();
		this.setState({
			alertData: null,
			checkValidCity: false,
			checkValidCode: false
		});

		this.setState({
			step: 1
		});
	};

	handleClickDone = e => {
		e.preventDefault();
		if (this.validateStepTwo()) {
			let data = {
				email: this.inputEmail.current.value,
				password: this.inputPassword.current.value,
				officalName: this.inputName.current.value,
				city: this.state.selectedCity.label,
				vatNumber: this.inputVAT.current.value,
				atecoCode: this.state.selectedCode.label,
				pec: this.inputPEC.current.value
			};

			requestAPI("/user/register", "POST", data).then(res => {
				console.log(res);
				if (res.status === 0) {
					this.setAlertData(0, res.message);
				} else {
					// setTimeout(function() {
					requestAPI("/user/verify-pec", "POST", {
						pec: data.pec,
						id: res.id
					}).then(res1 => {
						console.log(res1);
						if (res1.status === 0) {
							this.setAlertData(0, res1.message);
						} else {
							this.setState({ step: 3 });
							this.setAlertData(
								1,
								`We've sent an email to ${data.email} to verify your account. Please check your email inbox to coutinue.`
							);
						}
					});
					// }, 2000);
				}
			});
		}
	};

	handleCheck(e) {
		this.setState({
			policyChecked: e.target.checked
		});
	}

	render() {
		const {
			step,
			atecoCodes,
			selectedCity,
			selectedCode,
			checkValidCity,
			checkValidCode,
			alertData
		} = this.state;

		const stepOne = (
			<div style={{ display: step === 2 ? "none" : "block" }}>
				<span className="title text-center">Step 1/2</span>
				<Row className="justify-content-center mb-3">
					<Col md={6}>
						<input
							type="text"
							name="officialName"
							placeholder="Official Name"
							ref={this.inputName}
						/>
					</Col>
				</Row>
				<Row className="justify-content-center mb-3">
					<Col md={6}>
						<MySelect
							value={selectedCity}
							onChange={this.handleCityChange}
							options={CITIES}
							placeholder="City"
							checkValid={checkValidCity}
						/>
					</Col>
				</Row>
				<Row className="justify-content-center mb-3">
					<Col md={6}>
						<input
							type="text"
							name="vatNumber"
							placeholder="VAT number"
							ref={this.inputVAT}
						/>
					</Col>
				</Row>
				<Row className="justify-content-center mb-3">
					<Col md={6}>
						<MySelect
							value={selectedCode}
							onChange={this.handleCodeChange}
							options={atecoCodes}
							placeholder="ATECO CODE"
							checkValid={checkValidCode}
						/>
					</Col>
				</Row>
				<Row className="mb-3">
					<Col md={{ span: 6, offset: 3 }}>
						<input
							type="text"
							name="vatNumber"
							placeholder="PEC"
							ref={this.inputPEC}
						/>
					</Col>
					<Col md={3} className="info-hint">
						<i className="fa fa-info-circle pr-1" />
						This inbox will be use only to certify the attendibility
						of the user
					</Col>
				</Row>
				<Row className="justify-content-center mb-3">
					<Col sm={3} xs={12}>
						<button
							className="txt-upper w-100"
							onClick={this.handleClickNext}
						>
							Next step
						</button>
					</Col>
				</Row>
			</div>
		);

		const stepTwo = (
			<div style={{ display: step === 1 ? "none" : "block" }}>
				<button className="back" onClick={this.handleClickBack}>
					<i className="fa fa-angle-left" />
				</button>
				<span className="title text-center">Step 2/2</span>
				<Row className="mb-3">
					<Col md={{ span: 6, offset: 3 }}>
						<input
							type="text"
							name="email"
							placeholder="Email address"
							ref={this.inputEmail}
						/>
					</Col>
					<Col md={3} className="info-hint">
						<i className="fa fa-info-circle pr-1" />
						This inbox will be use to receive informations related
						to the service
					</Col>
				</Row>
				<Row className="justify-content-center mb-3">
					<Col md={6}>
						<input
							type="password"
							name="password"
							placeholder="Password"
							ref={this.inputPassword}
						/>
					</Col>
				</Row>
				<Row className="justify-content-center mb-3">
					<Col md={6}>
						<input
							type="password"
							placeholder="Confirm password"
							ref={this.inputConfirm}
						/>
					</Col>
				</Row>
				<Row className="justify-content-center mb-3">
					<Col md={6}>
						<input
							id="rememberme"
							type="checkbox"
							name="remember-me"
							className="input-checkbox"
							onClick={e => this.handleCheck(e)}
						/>
						<label className="label-checkbox" htmlFor="rememberme">
							In order to continue, confirm to accept the Privacy
							policy and Terms and conditions
						</label>
					</Col>
				</Row>
				<Row className="justify-content-center mb-3">
					<Col md={5}>
						<button
							className="txt-upper w-100"
							onClick={this.handleClickDone}
						>
							Complete registration
						</button>
					</Col>
				</Row>
				<div className="text-center mb-3">
					After "Complete registration", you will receive a
					confirmation message in your PEC inbox
				</div>
			</div>
		);

		return (
			<form className="my-form register-form">
				{alertData ? (
					<Alert variant={alertData.variant}>{alertData.text}</Alert>
				) : (
					<div></div>
				)}

				{step < 3 ? (
					<div>
						{stepOne}
						{stepTwo}
					</div>
				) : (
					<div></div>
				)}
			</form>
		);
	}
}
