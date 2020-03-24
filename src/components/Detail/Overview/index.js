import React, { Component } from "react";
import "./index.css";

export default class DetailOverView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMobile: false
        };

        this.newsPanel = React.createRef();
    }

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

    handleClickGotoNews = e => {
        window.scrollTo({
            top: this.newsPanel.current.offsetTop - 133,
            behavior: "smooth"
        });
    };

    render() {
        const { company } = this.props;
        const { isMobile } = this.state;

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
                    onClick={this.handleClickGotoNews}
                >
                    Go to news
                    <i className="pl-1 fa fa-chevron-down" />
                </button>
                {/* </div> */}

                <div>
                    <p className="sub-title color-primary mb-1">Introduction</p>
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
                    <p className="sub-title color-primary mb-1 pt-2">
                        What we do!
                    </p>
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
                    {isMobile ? postItemXS : postItem}
                    {isMobile ? postItemXS : postItem}
                </div>
            </div>
        );
    }
}
