import React, { Component } from "react";
import "./index.css";
import PostItem from "../../PostItem";

export default class ProfileNews extends Component {
	constructor(props) {
		super(props);

		this.state = {
			photoFileName: "No image choosed"
		};

		this.refBrowse = React.createRef();
	}

	handleClickPhoto = e => {
		this.refBrowse.current.click();
	};
	handleClickPublish = e => {};
	handleDeleteNews = e => {
		console.log(e);
	};

	handleChangeImage = e => {
		if (!e.target.files || !e.target.files.length) {
			return;
		}

		this.setState({ photoFileName: e.target.files[0].name });

		// const reader = new FileReader();
		// reader.addEventListener(
		// 	"load",
		// 	() => {
		// 		this.setState({
		// 			targetToCrop: {
		// 				...this.state.targetToCrop,
		// 				image: reader.result
		// 			}
		// 		});
		// 	},
		// 	false
		// );
		// reader.readAsDataURL(e.target.files[0]);
	};

	render() {
		const data = {
			image: null,
			title: "Title",
			description: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
						sed diam nonumy eirmod tempor invidunt ut labore et
						dolore magna aliquyam erat, sed diam voluptua. At vero
                        eos et accusam et justo duo dolores et ea rebum.`,
			date: "03/23/2020"
		};

		const { photoFileName } = this.state;
		return (
			<div className="news-view">
				<div className="mb-2 text-bold text-uppercase text-large">
					Make a post
				</div>
				<div className="mt-3 mb-1">Title</div>
				<div>
					<input className="w-100" />
				</div>
				<div className="mt-3 mb-1">What is new</div>
				<div>
					<textarea />
				</div>
				<div>
					<button
						className="secondary btn-photo"
						onClick={this.handleClickPhoto}
					>
						<input
							type="file"
							onChange={this.handleChangeImage}
							style={{ display: "none" }}
							ref={this.refBrowse}
							accept="image/*"
						/>
						<i className="fa fa-upload pr-2" />
						Upload a photo
					</button>
					<span className="pl-2">{photoFileName}</span>
					<button
						className="float-right"
						style={{ minWidth: 160 }}
						onClick={this.handleClickPublish}
					>
						Publish
					</button>
				</div>
				<div className="mt-5 text-bold text-uppercase text-large">
					Previous posts
				</div>
				<hr className="mt-2 mb-3" />
				<div>
					<PostItem
						data={data}
						handleDelete={this.handleDeleteNews}
					/>
					<PostItem
						data={data}
						handleDelete={this.handleDeleteNews}
					/>
				</div>
			</div>
		);
	}
}
