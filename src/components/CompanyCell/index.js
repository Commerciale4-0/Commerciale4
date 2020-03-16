import React, { Component } from "react";
import "./index.css";

export default class CompanyCell extends Component {
	render() {
		const { company } = this.props;
		return (
			<div className="company-cell row">
				<div className="logo col-md-2 col-3">
					<img src="images/logo.png" alt="" />
				</div>
				<div className="col-9 title">{company.officialName}</div>
				<div className="col-md-10 col-12 content">
					<h5 className="pb-2">{company.officialName}</h5>
					<div className="d-flex justify-content-between">
						<div>
							Location:{" "}
							<b>
								{company.city}, {company.region}
							</b>
						</div>
						<div className="distance">
							<strong>
								{company.distance
									? `${company.distance} km`
									: "---"}
							</strong>
						</div>
					</div>
					<hr />
					<div className="d-flex justify-content-between">
						<div>
							Revenuse: <b> {company.revenues}</b>
						</div>
						<div>
							Employees: <b> {company.employeesCount}</b>
						</div>
					</div>
					<hr />
					{/* <div className="row px-0">
						<div className="col-lg-6 col-sm-12 col-12 field location">
							Location:{" "}
							<b>
								{company.city}, {company.region}
							</b>
							<hr />
						</div>
						<div className="col-lg-3 col-sm-6 col-6 p-0 field">
							Revenuse: <b> {company.revenues}</b>
						</div>
						<div className="col-lg-3 col-sm-6 col-6 p-0 field text-right">
							Employees: <b> {company.employeesCount}</b>
						</div>
					</div> */}
					<div>Description: {company.description}</div>
					<hr />
					<div className="d-flex justify-content-between">
						<div>TAG results:</div>
						<div>ISO:</div>
					</div>
					<div className="d-flex justify-content-end pt-2">
						<button className="text-uppercase">profile</button>
					</div>
				</div>
			</div>
		);
	}
}
