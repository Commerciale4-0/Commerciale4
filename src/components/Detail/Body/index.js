import React, { Component } from "react";
import "./index.css";
import DetailOverview from "../Overview";
import DetailProduct from "../Product";
import DetailContacts from "../Contacts";
import { stringWithUnitFromNumber } from "../../../utils";

const MENUS = [
	{ id: 1, title: "About us" },
	{ id: 2, title: "Product & Service" },
	{ id: 3, title: "Contacts" },
];

export default class DetailBody extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedMenu: 1,
			isMobile: false,
		};

		this.leftPanel = React.createRef();
		this.rightPanel = React.createRef();
		this.menuPanel = React.createRef();
	}

	componentDidMount = () => {
		this.handleWindowResize();
		window.addEventListener("resize", this.handleWindowResize);
		if (window.innerWidth <= 576) {
			window.addEventListener("scroll", this.handleWindowScroll);
		}
	};

	componentWillUnmount() {
		window.removeEventListener("resize", this.handleWindowResize);
		if (window.innerWidth <= 576) {
			window.removeEventListener("scroll", this.handleWindowScroll);
		}
	}

	handleWindowResize = () => {
		this.setState({ isMobile: window.innerWidth <= 576 });
	};

	handleWindowScroll = () => {
		const currentScrollPos = window.pageYOffset;
		let topBarHeight = 0;
		// if (prevScrollpos > currentScrollPos) {
		topBarHeight = 46;
		// }
		if (currentScrollPos > 354 - topBarHeight) {
			this.menuPanel.current.style.top = 41 + topBarHeight + "px";
		} else {
			this.menuPanel.current.style.top = `${397 - currentScrollPos}px`;
		}

		this.setState({ prevScrollpos: currentScrollPos });
	};

	render() {
		const { profile } = this.props;
		const { selectedMenu, isMobile } = this.state;

		const menuPanel = (
			<div className="menu-panel" ref={this.menuPanel}>
				{MENUS.map((menu) => (
					<div key={menu.id} className={`menu ${selectedMenu === menu.id ? "active" : ""}`} onClick={() => this.setState({ selectedMenu: menu.id })}>
						{menu.title}
					</div>
				))}
			</div>
		);

		const infoPanel = (
			<div className="info-panel">
				<div className="row1">
					<p>
						<i className="fa fa-users" />
						{profile && stringWithUnitFromNumber(profile.user.employees)}
					</p>
					<p>
						<i className="fa fa-line-chart" />
						{profile && stringWithUnitFromNumber(profile.user.revenues)}
					</p>
					<p>
						<span>ISO</span>
						{profile && profile.user.iso}
					</p>
				</div>
				<div>
					<p className="-ateco">
						<span>NACE</span>
						{profile && profile.user.ateco}
					</p>
					<p className="-type">
						<span>TYPE</span>
						{profile && profile.user.typeOfCompany}
					</p>
				</div>
				<div className="-tags">
					<i className="fa fa-tags" />
					<div>{profile && profile.user.tags && profile.user.tags.map((tag, index) => <label key={index}>{tag}</label>)}</div>
				</div>
			</div>
		);

		return (
			<div className="detail-body">
				<div className="left-panel" ref={this.leftPanel}>
					{isMobile ? infoPanel : menuPanel}
					{isMobile ? menuPanel : infoPanel}
				</div>
				<div className="right-panel" ref={this.rightPanel}>
					{selectedMenu === 1 ? (
						<DetailOverview profile={profile} />
					) : selectedMenu === 2 ? (
						<DetailProduct profile={profile} />
					) : (
						selectedMenu === 3 && <DetailContacts profile={profile} />
					)}
				</div>
			</div>
		);
	}
}
