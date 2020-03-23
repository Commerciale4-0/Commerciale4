import React, { Component } from "react";
import "./index.css";

export default class DetailContacts extends Component {
	render() {
		const { company } = this.props;
		return (
			<div className="detail-contacts">
				<h4 className="mb-4 text-uppercase text-center">Contacts</h4>
				<div className="d-flex justify-content-around">
					<div>
						<div className="d-flex">
							<label>Address : </label>
							<p>Industry street, LA, USA</p>
						</div>
						<div className="d-flex">
							<label>Phone : </label>
							<p>+1 95955985</p>
						</div>
						<div className="d-flex">
							<label>Website : </label>
							<p>
								<a href="/">www.starkind.com</a>
							</p>
						</div>
						<div className="d-flex">
							<label>Email : </label>
							<p>{company.email}</p>
						</div>
						<div className="d-flex">
							<label>2nd Email : </label>
							<p>asdscacs@gmail.com</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
