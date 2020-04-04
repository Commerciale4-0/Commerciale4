import React, { Component } from "react";
import "./index.css";
import RegisterForm from "../../components/RegisterForm";

export default class RegisterPage extends Component {
	render() {
		return (
			<div className="register-page">
				<div>
					<div className="my-form intro">
						<p>
							WELCOME TO THE <label>COMMERCIALE4.0</label> COMMUNITY!
						</p>
						In order to complete the access, please follow the next steps.
					</div>

					<RegisterForm />
				</div>
			</div>
		);
	}
}
