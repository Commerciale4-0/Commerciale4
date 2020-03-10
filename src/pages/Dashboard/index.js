import React, { Component } from "react";
import "./index.css";

export default class Dashboard extends Component {
	componentDidMount() {
		let userEmail = sessionStorage.getItem("userEmail");
		if (!userEmail) {
			window.location.href = "/";
		}
	}

	render() {
		return (
			<div className="dashboard">
				<div className="main container">
					<div className="logo col-md-3">
						<img src="images/logo.png" alt="" />
					</div>
					<div className="content col-md-9">
						<h5>test company 1</h5>
						<p>Location: milan</p>
						<p>Revenuse: 2M Employees: 30</p>
						<p>
							Description: Small mechanical company specialized in
							the production of welding wires for famous brand
							like ...
						</p>
						<p>
							TAG results: <button>profile</button>
						</p>
					</div>
				</div>
			</div>
		);
	}
}
