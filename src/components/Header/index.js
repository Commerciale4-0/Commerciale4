import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./index.css";

export default class Header extends Component {
	state = {
		isExpanded: false
	};

	handleClickExpand = () => {
		this.setState({
			isExpanded: !this.state.isExpanded
		});
	};

	render() {
		const { isExpanded } = this.state;

		const sideBar = (
			<div className={`sidebar ${isExpanded ? "expanded" : "normal"}`}>
				<div className="item">Log in</div>
				<div className="item">Log in</div>
				<div className="item">Log in</div>
				<div className="item">Log in</div>
				<div className="item">Log in</div>
			</div>
		);

		return (
			<div>
				<div className="header">
					<Container>
						<Row>
							<Col className="col title" sm={7} xs={12}>
								Commerciale 4.0
							</Col>
							<Col className="col user" sm={2} xs={12}>
								<a href="/login">Log in</a>
							</Col>
							<Col className="col lang" sm={3} xs={12}>
								<a href="/">EN</a> | <a href="/"> GR</a> |<a href="/"> IT</a>
							</Col>
						</Row>
					</Container>
				</div>
				<div className="header-mobile">
					<div className="topbar">
						<div>Commerciale 4.0</div>
						<div>
							<button className="expand" onClick={this.handleClickExpand}>
								<i
									className={`fa ${
										isExpanded ? "fa-close" : "fa-align-justify"
									}`}
								/>
							</button>
						</div>
					</div>
					{sideBar}
				</div>
			</div>
		);
	}
}
