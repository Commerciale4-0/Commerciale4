import React, { Component } from "react";
import "./index.css";

export default class DetailOverView extends Component {
    state = {
        showMore: false,
        isMobile: false
    };

    componentDidMount = () => {
        this.handleWindowResize();
        window.addEventListener("resize", this.handleWindowResize);
    };

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleWindowResize);
    }

    handleWindowResize = () => {
        this.setState({ isMobile: window.innerWidth <= 576 });
    };

    render() {
        const { company } = this.props;
        const { showMore, isMobile } = this.state;

        const postItem = (
            <div className="post-item">
                <img className="post-img" src="/images/logo.png" />
                <div className="ml-3">
                    <p className="text-uppercase text-bold">Title</p>
                    <p>
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
                        sed diam nonumy eirmod tempor invidunt ut labore et
                        dolore magna aliquyam erat, sed diam voluptua. At vero
                        eos et accusam et justo duo dolores et ea rebum.
                    </p>
                    <p className="publish-date">Published on 03/23/2020</p>
                </div>
            </div>
        );
        const postItemXS = (
            <div className="post-item">
                <div className="d-flex align-items-center">
                    <img className="post-img" src="/images/logo.png" />
                    <p className="ml-3 text-uppercase text-bold">Title</p>
                </div>
                <p className="mt-2">
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                    diam nonumy eirmod tempor invidunt ut labore et dolore magna
                    aliquyam erat, sed diam voluptua. At vero eos et accusam et
                    justo duo dolores et ea rebum.
                </p>
                <p className="publish-date">Published on 03/23/2020</p>
            </div>
        );

        return (
            <div className="detail-overview">
                {/* <div className="d-flex justify-content-end"> */}
                <button
                    className="more-less"
                    onClick={() =>
                        this.setState({
                            showMore: !showMore
                        })
                    }
                >
                    {showMore ? "Show more" : "Show less"}
                    <i
                        className={`pl-1 fa fa-chevron-${
                            showMore ? "down" : "up"
                        }`}
                    />
                </button>
                {/* </div> */}

                {!showMore ? (
                    <div>
                        <p className="sub-title mb-1">Introduction</p>
                        <p>
                            Lorem ipsum dolor sit amet, consetetur sadipscing
                            elitr, sed diam nonumy eirmod tempor invidunt ut
                            labore et dolore magna aliquyam erat, sed diam
                            voluptua. At vero eos et accusam et justo duo
                            dolores et ea rebum. Stet clita kasd gubergren, no
                            sea takimata sanctus est Lorem ipsum dolor sit amet.
                            Lorem ipsum dolor sit amet, consetetur sadipscing
                            elitr, sed diam nonumy eirmod tempor invidunt ut
                            labore et dolore magna aliquyam erat, sed diam
                            voluptua. At vero eos et accusam et justo duo
                            dolores et ea rebum. Stet clita kasd gubergren, no
                            sea takimata sanctus est Lorem ipsum dolor sit amet.
                        </p>
                        <p className="sub-title mb-1 pt-2">What we do!</p>
                        <p>
                            Lorem ipsum dolor sit amet, consetetur sadipscing
                            elitr, sed diam nonumy eirmod tempor invidunt ut
                            labore et dolore magna aliquyam erat, sed diam
                            voluptua. At vero eos et accusam et justo duo
                            dolores et ea rebum. Stet clita kasd gubergren, no
                            sea takimata sanctus est Lorem ipsum dolor sit amet.
                            Lorem ipsum dolor sit amet, consetetur sadipscing
                            elitr, sed diam nonumy eirmod tempor invidunt ut
                            labore et dolore magna aliquyam erat, sed diam
                            voluptua. At vero eos et accusam et justo duo
                            dolores et ea rebum. Stet clita kasd gubergren, no
                            sea takimata sanctus est Lorem ipsum dolor sit amet.
                        </p>
                    </div>
                ) : (
                    <div>
                        <p className="sub-title">Introduction</p>
                        <p className="sub-title my-2">What to do!</p>
                    </div>
                )}

                <p className="sub-title pt-2 my-2">Later news</p>
                <div>
                    {isMobile ? postItemXS : postItem}
                    {isMobile ? postItemXS : postItem}
                </div>
            </div>
        );
    }
}
