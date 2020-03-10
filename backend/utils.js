const FAUNADB_SECRET = process.env.REACT_APP_FAUNADB_SECRET;
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const NETLIFY_FUNCTIONS_URL = process.env.REACT_APP_NETLIFY_FUNCTIONS_URL;
const NODEMAILER_ACCOUNT = process.env.REACT_APP_NODEMAILER_ACCOUNT;
const NODEMAILER_PASSWORD = process.env.REACT_APP_NODEMAILER_PASSWORD;

const EMAIL_VERIFY = 1;
const FORGOT_PASSWORD = 2;
const VERIFY_EMAIL_SUBJECT = "Verify your account";
const RESET_PASSWORD_SUBJECT = "Reset password";
const VERIFY_EMAIL_MESSAGE = `<h3>Hello</h3>
                    <h4>Thanks for your registering to COMMERCIALE4.0</h4>
                    We now need to verify your email address.<br/>
                    Please check the link in that email to coutinue.
                    `;
const RESET_PASSWORD_MESSAGE = `<h3>Hello</h3>
                    We've received a request to reset your password. If you didn't make the request, just ignore this email. Otherwise, you can reset your password using this link:
                    `;

module.exports.Utils = {
  FAUNADB_SECRET,
  SERVER_URL,
  NETLIFY_FUNCTIONS_URL,
  NODEMAILER_ACCOUNT,
  NODEMAILER_PASSWORD,
  EMAIL_VERIFY,
  FORGOT_PASSWORD,
  VERIFY_EMAIL_SUBJECT,
  RESET_PASSWORD_SUBJECT,
  VERIFY_EMAIL_MESSAGE,
  RESET_PASSWORD_MESSAGE
};
