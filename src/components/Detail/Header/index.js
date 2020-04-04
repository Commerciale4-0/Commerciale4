import React, { Component } from "react";
import "./index.css";

export default class DetailHeader extends Component {
	render() {
		const { profile } = this.props;
		const prefix = process.env.REACT_APP_AWS_PREFIX;

		return (
			<div className="detail-header shadow-box">
				<img className="background" src={`${profile && profile.background ? prefix + profile.background : "/images/no-cover.jpg"}`} alt="" />
				<div className="title-bar">
					<img className="logo" src={`${profile && profile.logo ? prefix + profile.logo : "/images/no-logo.jpg"}`} alt="" />
					<div className="official-name">
						<h5>{profile && profile.officialName}</h5>
						<span>
							<i className="fa fa-map-marker pr-2" />
							{profile && profile.city}, {profile && profile.region}
						</span>
					</div>
					<button>
						<a href={profile && profile.website} target="blank">
							Official Website
						</a>
					</button>
				</div>
			</div>
		);
	}
}
