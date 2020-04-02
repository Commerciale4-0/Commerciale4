import React, { Component } from "react";
import "./index.css";
import * as Validate from "../../../utils/Validate";
import { Alert } from "react-bootstrap";
import { requestAPI } from "../../../utils/api";
import { LOGGED_USER } from "../../../utils";
import SpinnerView from "../../SpinnerView";
import crypto from "crypto";

export default class ProfileAccount extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedTab: 0,
			userData: props.userData,
			passwordAlertData: null,
			emailAlertData: null,
			isProcessing: false
		};

		this.refOldPassword = React.createRef();
		this.refNewPassword = React.createRef();
		this.refConfirmPassword = React.createRef();
		this.refNewEmail = React.createRef();
		this.refConfirmEmail = React.createRef();
		this.refInsertPassword = React.createRef();
		this.refOfficialName = React.createRef();
		this.refCity = React.createRef();
		this.refVat = React.createRef();
		this.refAteco = React.createRef();
		this.refPec = React.createRef();
	}

	setPasswordAlertData = (success, text) => {
		this.setState({
			passwordAlertData: {
				variant: success ? "success" : "danger",
				text: text
			}
		});
	};

	setEmailAlertData = (success, text) => {
		this.setState({
			emailAlertData: {
				variant: success ? "success" : "danger",
				text: text
			}
		});
	};

	encrypt(password) {
		let mykey = crypto.createCipher("aes-128-cbc", password);
		let encodePassword = mykey.update("abc", "utf8", "hex");
		encodePassword += mykey.final("hex");
		return encodePassword;
	}

	validatePassword = () => {
		const oldPassword = this.encrypt(this.refOldPassword.current.value);
		if (oldPassword !== this.state.userData.user.password) {
			Validate.applyToInput(this.refOldPassword.current, -1);
			this.setPasswordAlertData(0, "Current password is not correct");
			return false;
		} else {
			Validate.applyToInput(this.refOldPassword.current, Validate.VALID);
		}

		let valid = Validate.checkPassword(this.refNewPassword.current.value);
		Validate.applyToInput(this.refNewPassword.current, valid.code);
		if (valid.code !== Validate.VALID) {
			this.setPasswordAlertData(0, "Password" + valid.msg);
			return false;
		}

		valid = Validate.checkPassword(this.refConfirmPassword.current.value);
		Validate.applyToInput(this.refConfirmPassword.current, valid.code);
		if (valid.code !== Validate.VALID) {
			this.setPasswordAlertData(0, "Password" + valid.msg);
			return false;
		}

		if (
			this.refNewPassword.current.value !==
			this.refConfirmPassword.current.value
		) {
			this.setPasswordAlertData(0, "Password doesn't match!");
			return false;
		}

		return true;
	};

	validateEmail = () => {
		let valid = Validate.checkEmail(this.refNewEmail.current.value);
		Validate.applyToInput(this.refNewEmail.current, valid.code);
		if (valid.code !== Validate.VALID) {
			this.setEmailAlertData(0, "Email" + valid.msg);
			return false;
		}

		valid = Validate.checkEmail(this.refConfirmEmail.current.value);
		Validate.applyToInput(this.refConfirmEmail.current, valid.code);
		if (valid.code !== Validate.VALID) {
			this.setEmailAlertData(0, "Email" + valid.msg);
			return false;
		}

		if (
			this.refNewEmail.current.value !==
			this.refConfirmEmail.current.value
		) {
			this.setEmailAlertData(0, "Email doesn't match");
			return;
		}

		let password = this.encrypt(this.refInsertPassword.current.value);
		if (this.state.userData.user.password !== password) {
			Validate.applyToInput(this.refInsertPassword.current, -1);
			this.setEmailAlertData(0, "Password is not correct");
			return;
		} else {
			Validate.applyToInput(
				this.refInsertPassword.current,
				Validate.VALID
			);
		}

		return true;
	};

	handleClickChangePassword = async e => {
		let { userData } = this.state;

		if (!this.validatePassword()) {
			return;
		}

		this.setState({ isProcessing: true });

		await requestAPI("/user/change-password", "POST", {
			id: userData.user.id,
			password: this.refNewPassword.current.value
		}).then(res => {
			if (res.status !== 1) {
				this.setPasswordAlertData(0, res.data);
			} else {
				userData.user.password = res.data;
				sessionStorage.setItem(LOGGED_USER, JSON.stringify(userData));
				this.setPasswordAlertData(1, res.message);
			}
			this.setState({ isProcessing: false });
		});
	};

	handleClickChangeEmail = async e => {
		let { userData } = this.state;
		if (!this.validateEmail()) {
			return;
		}

		let emailData = {
			id: userData.user.id,
			newEmail: this.refNewEmail.current.value
		};

		this.setState({ isProcessing: true });

		await requestAPI("/user/update-email", "POST", emailData)
			.then(res => {
				if (res.status === 1) {
					userData.user.email = res.data;
					sessionStorage.setItem(
						LOGGED_USER,
						JSON.stringify(userData)
					);
					this.setEmailAlertData(1, "Email changed successfully!");
				} else {
					this.setEmailAlertData(0, res.message);
				}
			})
			.catch(err => {
				console.log(err);
			});
		this.setState({ isProcessing: false });
	};

	handleClickDelete = async e => {
		const { userData } = this.state;
		let removePhotos = userData.user.productPhotos.slice(0);
		removePhotos = [
			...removePhotos,
			userData.user.background,
			userData.user.logo
		];

		userData.posts.map(post => {
			removePhotos.push(post.photo);
		});

		let deleteData = {
			id: userData.user.id,
			removePhotos: removePhotos
		};

		this.setState({ isProcessing: true });
		if (window.confirm("Are you sure delete?")) {
			await requestAPI("/user/delete", "POST", deleteData)
				.then(res => {
					if (res.status === 1) {
						sessionStorage.clear();
						window.location.href = "/";
					} else {
						alert(res.message);
					}
					this.setState({ isProcessing: false });
				})
				.catch(err => {
					console.log(err);
				});
		}
	};

	render() {
		const {
			selectedTab,
			userData,
			passwordAlertData,
			emailAlertData,
			isProcessing
		} = this.state;

		const actionsPanel = (
			<div className={selectedTab === 0 ? "d-block" : "d-none"}>
				<div>
					{passwordAlertData && (
						<Alert variant={passwordAlertData.variant}>
							{passwordAlertData.text}
						</Alert>
					)}
					<h6 className="text-uppercase p-3">Change password</h6>
					<div className="info-row">
						<input
							type="password"
							placeholder="Old password"
							ref={this.refOldPassword}
						/>
					</div>
					<div className="info-row">
						<input
							type="password"
							placeholder="New password"
							ref={this.refNewPassword}
						/>
					</div>
					<div className="info-row">
						<input
							type="password"
							placeholder="Confirm password"
							ref={this.refConfirmPassword}
						/>
					</div>
					<div className="info-row my-4">
						<button
							style={{
								minWidth: 180
							}}
							onClick={this.handleClickChangePassword}
						>
							CONFIRM
						</button>
					</div>
				</div>
				<hr />
				<div>
					{emailAlertData && (
						<Alert variant={emailAlertData.variant}>
							{emailAlertData.text}
						</Alert>
					)}
					<h6 className="text-uppercase p-3">Change Account email</h6>
					<div className="info-row">
						<input placeholder="New email" ref={this.refNewEmail} />
					</div>
					<div className="info-row">
						<input
							placeholder="Confirm email"
							ref={this.refConfirmEmail}
						/>
					</div>
					<div className="info-row">
						<input
							type="password"
							placeholder="Insert password"
							ref={this.refInsertPassword}
						/>
					</div>
					<div className="info-row my-4">
						<button
							style={{
								minWidth: 180
							}}
							onClick={this.handleClickChangeEmail}
						>
							CONFIRM
						</button>
					</div>
				</div>
				<hr />
				<div>
					<h6 className="text-uppercase p-3">Delete Profile</h6>
					<div className="info-row px-5 text-secondary pb-3">
						Clicking the DELETE button, your profile won't be
						displayed anymore. Commerciale4.0, as interms and
						condition, will be saving the informations for internal
						use.
					</div>
					<div className="info-row">
						<button
							style={{
								minWidth: 180,
								background: "#d33"
							}}
							onClick={this.handleClickDelete}
						>
							DELETE PROFILE
						</button>
					</div>
				</div>
			</div>
		);

		const infoPanel = (
			<div className={`my-4 ${selectedTab === 1 ? "d-block" : "d-none"}`}>
				<h6 className="text-center mb-4">
					The displayed info are not editable
				</h6>
				<div className="info-row">
					<span>Official name:</span>
					<input
						disabled
						ref={this.refOfficialName}
						defaultValue={userData.user.officialName}
					/>
				</div>
				<div className="info-row">
					<span>City:</span>
					<input
						disabled
						ref={this.refCity}
						defaultValue={userData.user.city}
					/>
				</div>
				<div className="info-row">
					<span>VAT number:</span>
					<input
						disabled
						ref={this.refVat}
						defaultValue={userData.user.vat}
					/>
				</div>
				<div className="info-row">
					<span>NACE code:</span>
					<input
						disabled
						ref={this.refAteco}
						defaultValue={userData.user.ateco}
					/>
				</div>
				<div className="info-row">
					<span>PEC:</span>
					<input
						disabled
						ref={this.refPec}
						defaultValue={userData.user.pec}
					/>
				</div>
			</div>
		);
		return (
			<div className="account-view">
				<div className="tab-header">
					<button
						className={`tab-item ${
							selectedTab === 0 ? "active" : ""
						}`}
						onClick={() =>
							this.setState({
								selectedTab: 0
							})
						}
					>
						Actions
					</button>
					<button
						className={`tab-item ${
							selectedTab === 1 ? "active" : ""
						}`}
						onClick={() =>
							this.setState({
								selectedTab: 1
							})
						}
					>
						Info
					</button>
				</div>
				<div className="tab-body">
					{actionsPanel}
					{infoPanel}
				</div>
				{isProcessing && <SpinnerView />}
			</div>
		);
	}
}
