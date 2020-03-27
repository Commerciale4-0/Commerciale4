import React, { Component } from "react";
import "./index.css";

export default class ProfileAccount extends Component {
	handleClickSave = e => {};
	handleClickDelete = e => {};
	render() {
		return (
			<div className="account-view">
				<div className="info-row">
					<span>Email address:</span>
					<input disabled />
				</div>
				<div className="info-row">
					<span>Old password:</span>
					<input type="password" />
				</div>
				<div className="info-row">
					<span>New password:</span>
					<input type="password" />
				</div>
				<div className="info-row">
					<span>Confirm password:</span>
					<input type="password" />
				</div>
				<div className="mt-4 d-flex justify-content-center">
					<button
						style={{ minWidth: 180 }}
						onClick={this.handleClickSave}
					>
						Save
					</button>
				</div>
				<div className="mt-3 d-flex justify-content-center">
					<button
						style={{
							minWidth: 180,
							background: "#d33"
						}}
						onClick={this.handleClickDelete}
					>
						Delete this account
					</button>
				</div>
			</div>
		);
	}
}
