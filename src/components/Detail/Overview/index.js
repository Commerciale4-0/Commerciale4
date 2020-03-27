import React, { Component } from "react";
import "./index.css";
import PostItem from "../../PostItem";

export default class DetailOverView extends Component {
	constructor(props) {
		super(props);

		this.newsPanel = React.createRef();
	}

	handleClickGotoNews = e => {
		window.scrollTo({
			top: this.newsPanel.current.offsetTop - 133,
			behavior: "smooth"
		});
	};

	render() {
		const { company } = this.props;

		const data = {
			image: "/images/logo.png",
			title: "Title",
			description: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
						sed diam nonumy eirmod tempor invidunt ut labore et
						dolore magna aliquyam erat, sed diam voluptua. At vero
                        eos et accusam et justo duo dolores et ea rebum.`,
			date: "03/23/2020"
		};

		return (
			<div className="detail-overview">
				{/* <div className="d-flex justify-content-end"> */}
				<button
					className="more-less"
					onClick={this.handleClickGotoNews}
				>
					Go to news
					<i className="pl-1 fa fa-chevron-down" />
				</button>
				{/* </div> */}

				<div>
					<p className="sub-title mb-1">Introduction</p>
					<p>
						Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
						sed diam nonumy eirmod tempor invidunt ut labore et
						dolore magna aliquyam erat, sed diam voluptua. At vero
						eos et accusam et justo duo dolores et ea rebum. Stet
						clita kasd gubergren, no sea takimata sanctus est Lorem
						ipsum dolor sit amet. Lorem ipsum dolor sit amet,
						consetetur sadipscing elitr, sed diam nonumy eirmod
						tempor invidunt ut labore et dolore magna aliquyam erat,
						sed diam voluptua. At vero eos et accusam et justo duo
						dolores et ea rebum. Stet clita kasd gubergren, no sea
						takimata sanctus est Lorem ipsum dolor sit amet.
					</p>
					<p className="sub-title mb-1 pt-2">What we do!</p>
					<p>
						Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
						sed diam nonumy eirmod tempor invidunt ut labore et
						dolore magna aliquyam erat, sed diam voluptua. At vero
						eos et accusam et justo duo dolores et ea rebum. Stet
						clita kasd gubergren, no sea takimata sanctus est Lorem
						ipsum dolor sit amet. Lorem ipsum dolor sit amet,
						consetetur sadipscing elitr, sed diam nonumy eirmod
						tempor invidunt ut labore et dolore magna aliquyam erat,
						sed diam voluptua. At vero eos et accusam et justo duo
						dolores et ea rebum. Stet clita kasd gubergren, no sea
						takimata sanctus est Lorem ipsum dolor sit amet.
					</p>
				</div>

				<p className="sub-title pt-2 my-2" ref={this.newsPanel}>
					news
				</p>
				<div>
					<PostItem data={data} />
					<PostItem data={data} />
				</div>
			</div>
		);
	}
}
