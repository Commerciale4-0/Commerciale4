import React, { Component } from "react";
import "./index.css";

export default class DetailHeader extends Component {
	render() {
		const { company } = this.props;

		return (
			<div className="detail-header shadow-box">
				<img
					className="background"
					src="/images/background.png"
					alt=""
				/>
				<div className="title-bar">
					<img className="logo" src="/images/logo.png" alt="" />
					<div className="official-name">
						<h5>{company.officialName}</h5>
						<span>
							<i className="fa fa-map-marker pr-2" />
							{company.city}, {company.region}
						</span>
					</div>
					<button>Website</button>
				</div>
			</div>
		);
	}
}
