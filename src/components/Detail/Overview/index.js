import React, { Component } from "react";
import "./index.css";
import PostItem from "../../PostItem";
import PostItemDetail from "../../PostItemDetail";
import { LangConsumer } from "../../../utils/LanguageContext";
export default class DetailOverView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedPost: null,
		};

		this.newsPanel = React.createRef();
	}

	handleClickGotoNews = (e) => {
		window.scrollTo({
			top: this.newsPanel.current.offsetTop - 133,
			behavior: "smooth",
		});
	};

	render() {
		const { profile } = this.props;
		const { selectedPost } = this.state;

		return (
			<div className="detail-overview">
				{/* <div className="d-flex justify-content-end"> */}
				<button className="more-less" onClick={this.handleClickGotoNews}>
					Go to news
					<i className="pl-1 fa fa-chevron-down" />
				</button>
				{/* </div> */}
				<LangConsumer>
					{(value) => (
						<div>
							<p className="text-uppercase text-bold text-dark-light mb-1">Introduction</p>
							<p className="font-15 text-gray">
								{/* {profile && profile.user.introduction} */}
								{value.lang === 2 ? profile && profile.user.introduction : profile && profile.user.introductionIt}
							</p>
							<p className="text-uppercase text-bold text-dark-light mb-1 pt-2">What we do!</p>
							<p className="font-15 text-gray">{value.lang === 2 ? profile && profile.user.whatWeDo : profile && profile.user.whatWeDoIt}</p>
						</div>
					)}
				</LangConsumer>
				<p className="text-uppercase text-bold text-dark-light pt-2 my-2" ref={this.newsPanel}>
					news
				</p>
				{profile && profile.posts && profile.posts.length ? (
					profile.posts.map((post) => (
						<div key={post.id} onClick={() => this.setState({ selectedPost: post })}>
							<PostItem data={post} bg="#f5f5f5" />
						</div>
					))
				) : (
					<div></div>
				)}
				{selectedPost && <PostItemDetail post={selectedPost} onClose={() => this.setState({ selectedPost: null })} />}
			</div>
		);
	}
}
