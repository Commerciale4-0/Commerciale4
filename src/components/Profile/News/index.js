import React, { Component } from "react";
import "./index.css";
import PostItem from "../../PostItem";

export default class ProfileNews extends Component {
	constructor(props) {
		super(props);
	}

	handleClickPhoto = e => {};
	handleClickPublish = e => {};
	handleDeleteNews = e => {
		console.log(e);
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
						<i className="fa fa-upload pr-2" />
						Upload a photo
					</button>
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
