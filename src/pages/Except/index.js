import React, { Component } from "react";
import "./index.css";

export default class Except extends Component {
	render() {
		return (
			<div className="except d-flex align-items-center justify-content-center">
				<div className="except-content text-center p-5">
					<p className="title">404</p>
					<p className="error">Error - Page Not Found</p>
					<hr className="my-5" />
					<p className="check mb-3">Please check the URL</p>
					<p className="click">
						Otherwise, <a href="/">click here</a> to be redirected to the homepage.
					</p>
				</div>
			</div>
		);
	}
}
