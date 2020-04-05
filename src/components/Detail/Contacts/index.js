import React, { Component } from "react";
import "./index.css";

export default class DetailContacts extends Component {
	render() {
		const { profile } = this.props;
		return (
			<div className="detail-contacts">
				<h5 className="my-4 text-dark-light text-uppercase text-center">Contacts</h5>
				<div className="d-flex justify-content-around">
					<div>
						<div className="d-flex align-items-center py-2">
							<label className="text-dark-light">Address : </label>
							<span>{profile && profile.user.companyAddress}</span>
						</div>
						<div className="d-flex align-items-center py-2">
							<label className="text-dark-light">Phone : </label>
							<span>{profile && profile.user.companyPhone}</span>
						</div>
						<div className="d-flex align-items-center py-2">
							<label className="text-dark-light">Website : </label>
							<span>
								<a href={profile && profile.user.website} className="text-primary" target="blank">
									{profile && profile.user.website}
								</a>
							</span>
						</div>
						<div className="d-flex align-items-center py-2">
							<label className="text-dark-light">Email : </label>
							<span>{profile && profile.user.companyEmail}</span>
						</div>
						<div className="d-flex align-items-center py-2">
							<label className="text-dark-light">2nd Email : </label>
							<span>{profile && profile.user.company2ndEmail}</span>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
