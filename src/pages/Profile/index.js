import React, { Component } from "react";
import "./index.css";
import { requestAPI } from "../../utils/api";
import ProfileCompany from "../../components/Profile/Company";
import ProfileNews from "../../components/Profile/News";
import ProfileAccount from "../../components/Profile/Account";
import { LOGGED_USER } from "../../utils";

const MENUS = ["Profile info", "News", "Account"];

export default class Profile extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedCategory: 0,
			userData: null
		};
	}

	componentDidMount = async () => {
		let loggedUser = JSON.parse(sessionStorage.getItem(LOGGED_USER));
		if (!loggedUser) {
			window.location.href = "/";
			return;
		}

		this.setState({ userData: loggedUser });
	};

	render() {
		const { selectedCategory, userData } = this.state;
		return (
			<div>
				{userData && (
					<div className="user-profile container">
						<div className="left-panel">
							{MENUS.map((menu, index) => (
								<button
									key={index}
									onClick={() =>
										this.setState({
											selectedCategory: index
										})
									}
									className={
										selectedCategory === index
											? "active"
											: ""
									}
								>
									{menu}
								</button>
							))}
						</div>
						<div className="right-panel">
							<div
								style={{
									display:
										selectedCategory === 0
											? "block"
											: "none"
								}}
							>
								<ProfileCompany profile={userData.user} />
							</div>
							<div
								style={{
									display:
										selectedCategory === 1
											? "block"
											: "none"
								}}
							>
								<ProfileNews
									posts={userData.posts}
									userId={userData.user.id}
								/>
							</div>
							<div
								style={{
									display:
										selectedCategory === 2
											? "block"
											: "none"
								}}
							>
								<ProfileAccount userData={userData} />
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}
}
