import React, { Component } from "react";
import "./index.css";

export default class DetailContacts extends Component {
	render() {
		const { profile } = this.props;
		return (
			<div className="detail-contacts">
				<h5 className="my-4 text-dark-light text-uppercase text-center">
					Contacts
				</h5>
				<div className="d-flex justify-content-around">
					<div>
						<div className="d-flex">
							<label className="text-dark-light">
								Address :{" "}
							</label>
							<p>{profile && profile.user.companyAddress}</p>
						</div>
						<div className="d-flex">
							<label className="text-dark-light">Phone : </label>
							<p>{profile && profile.user.companyPhone}</p>
						</div>
						<div className="d-flex">
							<label className="text-dark-light">
								Website :{" "}
							</label>
							<p>
								<a href="/">
									{profile && profile.user.website}
								</a>
							</p>
						</div>
						<div className="d-flex">
							<label className="text-dark-light">Email : </label>
							<p>{profile && profile.user.companyEmail}</p>
						</div>
						<div className="d-flex">
							<label className="text-dark-light">
								2nd Email :{" "}
							</label>
							<p>{profile && profile.user.company2ndEmail}</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
