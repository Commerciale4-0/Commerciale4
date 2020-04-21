const FAUNADB_SECRET = process.env.FAUNADB_SECRET;
const SERVER_URL = process.env.SERVER_URL;
const NETLIFY_FUNCTIONS_URL = process.env.NETLIFY_FUNCTIONS_URL;

const OAUTH_ACCOUNT = process.env.OAUTH_ACCOUNT;
const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const OAUTH_REFRESH_TOKEN = process.env.OAUTH_REFRESH_TOKEN;
const OAUTH_REDIRECT_URL = process.env.OAUTH_REDIRECT_URL;

const SENDER_EMAIL = process.env.SENDER_EMAIL;

const VERIFY_EMAIL_SUBJECT = "Verify your account";
const RESET_PASSWORD_SUBJECT = "Reset password";
const VERIFY_EMAIL_MESSAGE = `<h3>Hello</h3>
                    <h4>Thanks for your registering to COMMERCIALE4.0</h4>
                    We will check your information and allow to access our site.<br/>
                    `;
// const VERIFY_EMAIL_MESSAGE = `<h3>Hello</h3>
//                     <h4>Thanks for your registering to COMMERCIALE4.0</h4>
//                     We now need to verify your email address.<br/>
//                     Please check the link in that email to coutinue.
//                     `;
const RESET_PASSWORD_MESSAGE = `<h3>Hello</h3>
                    We've received a request to reset your password. If you didn't make the request, just ignore this email. Otherwise, you can reset your password using this link:
					`;

const MESSAGE_FOOTER = `<p>Thank you</p><p>Commerciale4.0 team</p>`;

const EMAIL_STYLE = `style="background-color: green; margin-top: 30px; text-align: center; border-radius: 5px; font-weight: bold; line-height: 44px; 
                    text-decoration: none; font-size: 14px; color: #ffffff; display: block; width: 20%"`;

const VERIFY_SUCCESS_PAGE = `<html lang="en"><head><title>Verify</title></head>
							<body><div style="background-color: green; margin-top: 30px; text-align: center; border-radius: 5px; font-weight: bold; 
							line-height: 44px; font-size: 15px; color: #ffffff; display: block; width: 50%; margin-left: auto; margin-right: auto;">
							Welcome to the COMMERCIALE4.0! You have been successfully verified.<div></body></html>`;
module.exports.Utils = {
    FAUNADB_SECRET,
    SERVER_URL,
    NETLIFY_FUNCTIONS_URL,
    OAUTH_ACCOUNT,
    OAUTH_CLIENT_ID,
    OAUTH_CLIENT_SECRET,
    OAUTH_REFRESH_TOKEN,
    OAUTH_REDIRECT_URL,
    SENDER_EMAIL,
    VERIFY_EMAIL_SUBJECT,
    RESET_PASSWORD_SUBJECT,
    VERIFY_EMAIL_MESSAGE,
    RESET_PASSWORD_MESSAGE,
    MESSAGE_FOOTER,
    EMAIL_STYLE,
    VERIFY_SUCCESS_PAGE,
};
