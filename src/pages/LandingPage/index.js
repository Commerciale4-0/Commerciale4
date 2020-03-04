import React, { Component } from "react";
import "./index.css";
import SimpleSearch from "../../components/SimpleSearch";

export default class LandingPage extends Component {
	render() {
		return (
			<div className="landing">
				<div className="slide">
					<SimpleSearch />
				</div>
			</div>
		);
	}
}
