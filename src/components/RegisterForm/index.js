import React, { Component } from "react";
import "./index.css";
import { Row, Col, Alert } from "react-bootstrap";

import { ATECO_CODES, CITIES, REGIONS } from "../../utils";

import * as Validate from "../../utils/Validate";

import MySelect from "../Custom/MySelect";
import { requestAPI, geocodeByAddress } from "../../utils/api";

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

		this.refName = React.createRef();
		this.refVAT = React.createRef();
		this.refPEC = React.createRef();
		this.refEmail = React.createRef();
		this.refPassword = React.createRef();
		this.refConfirm = React.createRef();
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
		let valid = Validate.checkEmpty(this.refName.current.value);
		Validate.applyToInput(this.refName.current, valid.code);
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

		valid = Validate.checkVAT(this.refVAT.current.value);
		Validate.applyToInput(this.refVAT.current, valid.code);
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

		valid = Validate.checkEmail(this.refPEC.current.value);
		Validate.applyToInput(this.refPEC.current, valid.code);
		if (valid.code !== Validate.VALID) {
			this.setAlertData(0, "PEC" + valid.msg);
			return false;
		}

		return true;
	};

	validateStepTwo = () => {
		let valid = Validate.checkEmail(this.refEmail.current.value);
		Validate.applyToInput(this.refEmail.current, valid.code);
		if (valid.code !== Validate.VALID) {
			this.setAlertData(0, "Email address" + valid.msg);
			return false;
		}

		valid = Validate.checkPassword(this.refPassword.current.value);
		Validate.applyToInput(this.refPassword.current, valid.code);
		if (valid.code !== Validate.VALID) {
			this.setAlertData(0, "Password" + valid.msg);
			return false;
		}

		valid = Validate.checkConfirmPassword(
			this.refPassword.current.value,
			this.refConfirm.current.value
		);
		Validate.applyToInput(this.refConfirm.current, valid.code);
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

			this.refEmail.current.style.border = 0;
			this.refPassword.current.style.border = 0;
			this.refConfirm.current.style.border = 0;
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

	handleClickDone = async e => {
		e.preventDefault();
		if (this.validateStepTwo()) {
			let region = REGIONS.find(
				elem => elem.value === this.state.selectedCity.region
			);
			region = region ? region.label : "";
			let latitude = 0.0;
			let longitude = 0.0;
			await geocodeByAddress(this.state.selectedCity.label, region).then(
				res => {
					if (res) {
						latitude = res.lat;
						longitude = res.lng;
					}
				}
			);

			let data = {
				email: this.refEmail.current.value,
				password: this.refPassword.current.value,
				officialName: this.refName.current.value,
				city: this.state.selectedCity.label,
				region: region,
				latitude: latitude,
				longitude: longitude,
				vatNumber: this.refVAT.current.value,
				atecoCode: this.state.selectedCode.label,
				pec: this.refPEC.current.value
			};

			// requestAPI("/user/register", "POST", data).then(res => {
			//     console.log("response", res);
			//     if (res.status !== 1) {
			//         this.setAlertData(0, res.message);
			//     } else {
			//         this.setState({ step: 3 });
			//         this.setAlertData(
			//             1,
			//             `We've sent an email to ${data.email} to verify your account. Please check your email inbox to coutinue.`
			//         );
			//     }
			// });
			try {
				let res = await requestAPI("/user/register", "POST", data);
				if (res.status !== 1) {
					this.setAlertData(0, res.message);
					return;
				}

				try {
					let res = await requestAPI("/user/verify-pec", "POST", {
						pec: data.pec
					});

					if (res.status === 0) {
						this.setAlertData(0, res.message);
					} else {
						this.setState({ step: 3 });
						this.setAlertData(
							1,
							`We've sent an email to ${data.pec} to verify your account. Please check your email inbox to coutinue.`
						);
					}
				} catch (e) {
					this.setAlertData(0, "Connection failed!");
				}
			} catch (e) {
				this.setAlertData(0, "Connection failed!");
			}
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
			<div
				style={{
					display: step === 2 ? "none" : "block"
				}}
			>
				<span className="title text-center">Step 1/2</span>
				<Row className="justify-content-center mb-3">
					<Col md={6}>
						<input
							type="text"
							name="officialName"
							placeholder="Official Name"
							ref={this.refName}
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
							ref={this.refVAT}
						/>
					</Col>
				</Row>
				<Row className="justify-content-center mb-3">
					<Col md={6}>
						<MySelect
							value={selectedCode}
							onChange={this.handleCodeChange}
							options={atecoCodes}
							placeholder="NACE CODE"
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
							ref={this.refPEC}
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
			<div
				style={{
					display: step === 1 ? "none" : "block"
				}}
			>
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
							ref={this.refEmail}
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
							ref={this.refPassword}
						/>
					</Col>
				</Row>
				<Row className="justify-content-center mb-3">
					<Col md={6}>
						<input
							type="password"
							placeholder="Confirm password"
							ref={this.refConfirm}
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
