import React, { Component } from "react";
import "./index.css";

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
                            <h5>{post.title}</h5>
                        </div>
                        <div className="px-4 d-flex justify-content-center">{post.photo && <img src={process.env.REACT_APP_AWS_PREFIX + post.photo} alt="" />}</div>
                        <p className="mt-3">{post.description}</p>
                        <div className="published">Published on {new Date(post.published).toLocaleDateString()}</div>
                    </div>
                )}
            </div>
        );
    }
}
