import React, { Component } from "react";
import "./index.css";
import DetailOverview from "../Overview";
import DetailProduct from "../Product";
import DetailContacts from "../Contacts";

const MENUS = [
	{ id: 1, title: "About us" },
	{ id: 2, title: "Product & Service" },
	{ id: 3, title: "Contacts" }
];

export default class DetailBody extends Component {
	state = {
		selectedMenu: 1,
		isMobile: false
	};

	componentDidMount = () => {
		this.handleWindowResize();
		window.addEventListener("resize", this.handleWindowResize);
	};

	componentWillUnmount() {
		window.removeEventListener("resize", this.handleWindowResize);
	}

	handleWindowResize = () => {
		this.setState({ isMobile: window.innerWidth <= 576 });
	};

	render() {
		const { company } = this.props;
		const { selectedMenu, isMobile } = this.state;

		const menuPanel = (
			<div className="menu-panel">
				{MENUS.map(menu => (
					<div
						key={menu.id}
						className={`menu ${
							selectedMenu === menu.id ? "active" : ""
						}`}
						onClick={() => this.setState({ selectedMenu: menu.id })}
					>
						{menu.title}
					</div>
				))}
			</div>
		);

		const infoPanel = (
			<div className="info-panel">
				<div>
					<p className="-employees">
						<i className="fa fa-users" />
						{company.employees}
					</p>
					<p className="-revenues">
						<i className="fa fa-line-chart" />
						{company.revenues}
					</p>
					<p className="-iso">
						<span>ISO</span>
						9001
					</p>
				</div>
				<div>
					<p className="-ateco">
						<span>NACE</span>
						{company.atecoCode}
					</p>
					<p className="-type">
						<span>TYPE</span>
						Products & Service
					</p>
				</div>
				<div className="-tags">
					<i className="fa fa-tags" />
					<div>
						<label>Lasercut</label>
						<label>Welding</label>
						<label>CNC</label>
						<label>bend</label>
						<label>inox</label>
					</div>
				</div>
			</div>
		);

		return (
			<div className="detail-body">
				<div className="left-panel">
					{isMobile ? infoPanel : menuPanel}
					{isMobile ? menuPanel : infoPanel}
				</div>
				<div className="right-panel">
					{selectedMenu === 1 ? (
						<DetailOverview company={company} />
					) : selectedMenu === 2 ? (
						<DetailProduct company={company} />
					) : selectedMenu === 3 ? (
						<DetailContacts company={company} />
					) : (
						<div />
					)}
				</div>
			</div>
		);
	}
}
