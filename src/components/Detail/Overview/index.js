import React, { Component } from "react";
import "./index.css";
import PostItem from "../../PostItem";
import PostItemDetail from "../../PostItemDetail";
import { LangConsumer } from "../../../utils/LanguageContext";
import { STRINGS } from "../../../utils/strings";

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
                    {STRINGS.goToNews}
                    <i className="pl-1 fa fa-chevron-down" />
                </button>
                {/* </div> */}
                <LangConsumer>
                    {(value) => (
                        <div>
                            <div className="text-uppercase text-bold text-dark-light mb-2 d-flex align-items-center">
                                <i className="fa fa-address-card-o font-22 pr-3" />
                                {STRINGS.introduction}
                            </div>
                            <p className="font-15 text-gray">
                                {/* {profile && profile.user.introduction} */}
                                {value.lang === "en" ? profile && profile.user.introduction : profile && profile.user.introductionIt}
                            </p>
                            <div className="text-uppercase text-bold text-dark-light mb-2 pt-2 d-flex align-items-center">
                                <i className="fa fa-industry font-22 pr-3" />
                                {STRINGS.whatWeDo}
                            </div>
                            <p className="font-15 text-gray">{value.lang === "en" ? profile && profile.user.whatWeDo : profile && profile.user.whatWeDoIt}</p>
                        </div>
                    )}
                </LangConsumer>
                <div className="d-flex align-items-center text-uppercase text-bold text-dark-light pt-2 my-2" ref={this.newsPanel}>
                    <i className="fa fa-newspaper-o font-22 pr-3" />
                    <span>{STRINGS.news}</span>
                </div>
                {profile && profile.posts && profile.posts.length ? (
                    <div className="post-list">
                        {profile.posts.map((post) => (
                            <div key={post.id} onClick={() => this.setState({ selectedPost: post })}>
                                <PostItem data={post} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center pt-2 pb-4">{STRINGS.noNews}</div>
                )}
                {selectedPost && <PostItemDetail post={selectedPost} onClose={() => this.setState({ selectedPost: null })} />}
            </div>
        );
    }
}
