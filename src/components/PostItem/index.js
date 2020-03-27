import React, { Component } from "react";
import "./index.css";

export default class PostItem extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isMobile: false
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

	render() {
		const { isMobile } = this.state;
		const { data, handleDelete } = this.props;
		return (
			<div>
				{isMobile ? (
					<div className="post-item">
						{handleDelete ? (
							<button onClick={handleDelete}>
								<i className="fa fa-close" />
							</button>
						) : (
							<div />
						)}

						<div className="d-flex align-items-center">
							{data.image ? (
								<img
									className="post-img mr-3"
									src={data.image}
								/>
							) : (
								<div />
							)}

							<p className="text-uppercase text-bold">
								{data.title}
							</p>
						</div>
						<p className="mt-2">{data.description}</p>
						<p className="publish-date">Published on {data.date}</p>
					</div>
				) : (
					<div className="post-item">
						{data.image ? (
							<img className="post-img mr-3" src={data.image} />
						) : (
							<div />
						)}

						<div>
							{handleDelete ? (
								<button onClick={handleDelete}>
									<i className="fa fa-close" />
								</button>
							) : (
								<div />
							)}
							<p className="text-uppercase text-bold">
								{data.title}
							</p>
							<p>{data.description}</p>
							<p className="publish-date">
								Published on {data.date}
							</p>
						</div>
					</div>
				)}
			</div>
		);
	}
}
