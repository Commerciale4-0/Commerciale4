import React, { Component } from "react";
import "./index.css";
import { STRINGS } from "../../utils/strings";
import { LangConsumer } from "../../utils/LanguageContext";

export default class PostItemDetail extends Component {
    render() {
        const { post, onClose } = this.props;
        return (
            <div className="post-item-detail">
                {post && (
                    <div className="-content">
                        <button className="secondary round no-min" onClick={onClose}>
                            <i className="fa fa-close" />
                        </button>
                        <div className="d-flex justify-content-between mb-3">
                            <LangConsumer>
                                {(context) => <h5>{context.lang === "en" ? (post.title ? post.title : post.titleIt) : post.titleIt ? post.titleIt : post.title}</h5>}
                            </LangConsumer>
                        </div>
                        <div className="px-4 d-flex justify-content-center">{post.photo && <img src={process.env.REACT_APP_AWS_PREFIX + post.photo} alt="" />}</div>
                        <LangConsumer>
                            {(context) => (
                                <p className="mt-3">
                                    {context.lang === "en"
                                        ? post.description
                                            ? post.description
                                            : post.descriptionIt
                                        : post.descriptionIt
                                        ? post.descriptionIt
                                        : post.description}
                                </p>
                            )}
                        </LangConsumer>
                        <div className="published">
                            {STRINGS.publishedOn} {new Date(post.published).toLocaleDateString()}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
