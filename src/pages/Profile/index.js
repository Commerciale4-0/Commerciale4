import React, { Component } from "react";
import "./index.css";
import { requestAPI } from "../../utils/api";
import ProfileCompany from "../../components/Profile/Company";
import ProfileNews from "../../components/Profile/News";
import ProfileAccount from "../../components/Profile/Account";

export default class Profile extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedCategory: 0,
			company: null
		};
	}

	componentDidMount = async () => {
		let id = this.props.match.params.id;
		if (!id) {
			return;
		}

		await requestAPI("/user/get-user", "POST", {
			id: id
		})
			.then(res => res.data)
			.then(data => {
				if (data && data.length) {
					this.setState({ company: data[0] });
				} else {
					console.log("Connection failed!");
				}
			})
			.catch(e => {
				console.log("Connection failed!");
			});
	};

	render() {
		const { selectedCategory } = this.state;
		return (
			<div className="user-profile container">
				<div className="left-panel">
					<button
						onClick={() =>
							this.setState({
								selectedCategory: 0
							})
						}
						className={selectedCategory === 0 ? "active" : ""}
					>
						Profile info
					</button>
					<button
						onClick={() =>
							this.setState({
								selectedCategory: 1
							})
						}
						className={selectedCategory === 1 ? "active" : ""}
					>
						News{" "}
					</button>
					<button
						onClick={() =>
							this.setState({
								selectedCategory: 2
							})
						}
						className={selectedCategory === 2 ? "active" : ""}
					>
						Account info
					</button>
				</div>
				<div className="right-panel">
					{selectedCategory === 0 ? (
						<ProfileCompany />
					) : selectedCategory === 1 ? (
						<ProfileNews />
					) : (
						<ProfileAccount />
					)}
				</div>
			</div>
		);
	}
}
