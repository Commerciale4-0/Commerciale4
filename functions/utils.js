!function(e,t){for(var r in t)e[r]=t[r]}(exports,function(e){var t={};function r(o){if(t[o])return t[o].exports;var n=t[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=e,r.c=t,r.d=function(e,t,o){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(r.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(o,n,function(t){return e[t]}.bind(null,n));return o},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=51)}({51:function(e,t){const r=process.env.FAUNADB_SECRET,o=process.env.SERVER_URL,n=process.env.NETLIFY_FUNCTIONS_URL,i=process.env.NODEMAILER_ACCOUNT,l=process.env.NODEMAILER_PASSWORD;process.env.SENDER_EMAIL;e.exports.Utils={FAUNADB_SECRET:r,SERVER_URL:o,NETLIFY_FUNCTIONS_URL:n,NODEMAILER_ACCOUNT:i,NODEMAILER_PASSWORD:l,VERIFY_EMAIL_SUBJECT:"Verify your account",RESET_PASSWORD_SUBJECT:"Reset password",VERIFY_EMAIL_MESSAGE:"<h3>Hello</h3>\n                    <h4>Thanks for your registering to COMMERCIALE4.0</h4>\n                    We will check your information and allow to access our site.<br/>\n                    ",RESET_PASSWORD_MESSAGE:"<h3>Hello</h3>\n                    We've received a request to reset your password. If you didn't make the request, just ignore this email. Otherwise, you can reset your password using this link:\n\t\t\t\t\t",MESSAGE_FOOTER:"<p>Thank you</p><p>Commerciale4.0 team</p>",EMAIL_STYLE:'style="background-color: green; margin-top: 30px; text-align: center; border-radius: 5px; font-weight: bold; line-height: 44px; \n                    text-decoration: none; font-size: 14px; color: #ffffff; display: block; width: 20%"',VERIFY_SUCCESS_PAGE:'<html lang="en"><head><title>Verify</title></head>\n\t\t\t\t\t\t\t<body><div style="background-color: green; margin-top: 30px; text-align: center; border-radius: 5px; font-weight: bold; \n\t\t\t\t\t\t\tline-height: 44px; font-size: 15px; color: #ffffff; display: block; width: 50%; margin-left: auto; margin-right: auto;">\n\t\t\t\t\t\t\tWelcome to the COMMERCIALE4.0! You have been successfully verified.<div></body></html>'}}}));