import React, { Component } from "react";
import "./index.css";
import ImagePreview from "../ImagePreview";

export default class PostItem extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isMobile: false
			// preview: false
		};
	}

	componentDidMount = () => {
		this.handleWindowResize();
		window.addEventListener("resize", this.handleWindowResize);
	};

	componentWillUnmount = () => {
		window.removeEventListener("resize", this.handleWindowResize);
	};

	handleWindowResize = () => {
		this.setState({ isMobile: window.innerWidth <= 576 });
	};

	getPublished(date) {
		let date_ob = new Date(date);
		let day = date_ob.getDate();
		let month = date_ob.getMonth() + 1;
		let year = date_ob.getFullYear();

		return day + "/" + month + "/" + year;
	}

	// handleClosePreview = () => {
	// 	this.setState({ preview: false });
	// };

	render() {
		const { isMobile /*, preview*/ } = this.state;
		const { data, handleDelete, bg } = this.props;
		return (
			<div>
				{isMobile ? (
					<div
						className="post-item"
						style={{ background: bg ? bg : "white" }}
					>
						{handleDelete && (
							<button onClick={handleDelete}>
								<i className="fa fa-close" />
							</button>
						)}

						<div className="d-flex align-items-center">
							{data.photo && (
								<div>
									<img
										className="post-img mr-3"
										src={
											process.env.REACT_APP_AWS_PREFIX +
											data.photo
										}
										alt=""
										onClick={() =>
											this.setState({ preview: true })
										}
									/>
								</div>
							)}

							<p className="text-uppercase text-bold text-dark-light">
								{data.title}
							</p>
						</div>
						<p className="mt-2 text-gray">{data.description}</p>
						<p className="publish-date">
							Published on {this.getPublished(data.published)}
						</p>
					</div>
				) : (
					<div
						className="post-item"
						style={{ background: bg ? bg : "white" }}
					>
						{data.photo && (
							<img
								className="post-img mr-3"
								src={
									process.env.REACT_APP_AWS_PREFIX +
									data.photo
								}
								alt=""
								onClick={() => this.setState({ preview: true })}
							/>
						)}
						<div className="w-100">
							{handleDelete && (
								<button onClick={handleDelete}>
									<i className="fa fa-close" />
								</button>
							)}
							<p className="text-uppercase text-bold text-dark-light">
								{data.title}
							</p>
							<p className="text-gray">{data.description}</p>
							<p className="publish-date">
								Published on {this.getPublished(data.published)}
							</p>
						</div>
					</div>
				)}

				{/* {preview && (
					<ImagePreview
						images={[process.env.REACT_APP_AWS_PREFIX + data.photo]}
						onClose={this.handleClosePreview}
					/>
				)} */}
			</div>
		);
	}
}
