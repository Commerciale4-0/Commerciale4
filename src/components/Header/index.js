import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./index.css";

const menus = [
	{ id: 1, title: "Sign in", link: "/login" },
	{ id: 2, title: "Sign up", link: "/register" },
	{ id: 3, title: "Search", link: "/" },
	{ id: 4, title: "Terms & Conditions", link: "/terms" },
	{ id: 5, title: "Privacy Policy", link: "/policy" }
];

export default class Header extends Component {
	state = {
		isExpanded: false
	};

	handleClickExpand = () => {
		this.setState({
			isExpanded: !this.state.isExpanded
		});
	};

	handleClickMenu = menu => {
		window.location.href = menu.link;
	};

	render() {
		const { isExpanded } = this.state;

		const sideBar = (
			<div className={`sidebar ${isExpanded ? "expanded" : "normal"}`}>
				<div>
					{menus.map(menu => (
						<div
							key={menu.id}
							className="item"
							onClick={this.handleClickMenu.bind(this, menu)}
						>
							{menu.title}
						</div>
					))}
				</div>
				<div className="sidebar-hide" onClick={this.handleClickExpand}></div>
			</div>
		);

		return (
			<div>
				<div className="header">
					<Container>
						<Row>
							<Col className="item title" sm={4}>
								<a href="/">Commerciale 4.0</a>
							</Col>
							<Col className="item search" sm={4}>
								<span className="px-3">
									<i className="fa fa-search"></i>
								</span>
								<input type="text" placeholder="Search" />
							</Col>
							<Col className="item user" sm={2}>
								<a href="/login">Sign in</a>
							</Col>
							<Col className="item lang" sm={2}>
								<a href="/">
									<img src="images/flag/uk.png" alt="" />
								</a>
								<a href="/">
									<img src="images/flag/germany.png" alt="" />
								</a>
								<a href="/">
									<img src="images/flag/italy.png" alt="" />
								</a>
							</Col>
						</Row>
					</Container>
				</div>
				<div className="header-mobile">
					<div className="title">
						<a href="/">Commerciale 4.0</a>
					</div>
					<div>
						<button className="expand" onClick={this.handleClickExpand}>
							<i
								className={`fa ${isExpanded ? "fa-close" : "fa-align-justify"}`}
							/>
						</button>
					</div>
				</div>
				{sideBar}
			</div>
		);
	}
}
