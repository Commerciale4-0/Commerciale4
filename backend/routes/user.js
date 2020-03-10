const router = require("express").Router();
const nodemailer = require("nodemailer");
const { Utils } = require("../utils");
const faunadb = require("faunadb"),
    q = faunadb.query;
const client = new faunadb.Client({
    secret: Utils.FAUNADB_SECRET
});

const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
function encrypt(text) {
    console.log(text);
    let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
}
function decrypt(text) {
    console.log("sgs", text.iv);
    let iv = Buffer.from(text.iv, "hex");
    console.log(iv);
    let encryptedText = Buffer.from(text.encryptedData, "hex");
    console.log(encryptedText);
    let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
    console.log(decipher);
    let decrypted = decipher.update(encryptedText);
    decrypted = JSON.parse(decrypt);
    console.log(decrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    console.log(decrypted);
    return decrypted.toString();
}
router.get("/encrypt", (req, res) => {
    console.log(req.query.code);
    console.log(encrypt(req.query.code));
    res.send(encrypt(req.query.code));
});
router.post("/decrypt", (req, res) => {
    console.log(JSON.parse(req.body));
    console.log(decrypt(JSON.parse(req.body)));
    res.send(decrypt(JSON.parse(req.body)));
});

function sendMailer(toEmail, type, value) {
    let toHtml = "";
    let toSubject = "";
    if (type === Utils.EMAIL_VERIFY) {
        toSubject = Utils.VERIFY_EMAIL_SUBJECT; // verify code
        toHtml = `${Utils.VERIFY_EMAIL_MESSAGE}
          <br/><a href="${Utils.SERVER_URL}${Utils.NETLIFY_FUNCTIONS_URL}/user/verify?code=${value}"></a>`;
    } else {
        toSubject = Utils.RESET_PASSWORD_SUBJECT;
        toHtml = `${Utils.RESET_PASSWORD_MESSAGE}
          <br/><a href="${Utils.SERVER_URL}/reset-password?id=${value}"></a>`;
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: Utils.NODEMAILER_ACCOUNT,
            pass: Utils.NODEMAILER_PASSWORD
        }
    });
    const mailOption = {
        from: Utils.NODEMAILER_ACCOUNT,
        to: toEmail,
        subject: toSubject,
        html: toHtml
    };
    transporter.sendMail(mailOption, (error, info) => {
        if (error) {
            return false;
        } else {
            return;
        }
    });
}

router.get("/hello", (req, res) => {
    res.send({ express: "Hello!!!!!!!" });
});

// login route
router.post("/login", async (req, res) => {
    let data = req.body;

    client
        .query(
            q.Paginate(
                q.Match(
                    q.Index("findUserByEmailAndPassAndActive"),
                    data.email,
                    data.password,
                    "1"
                )
            )
        )
        .then(result => {
            if (result.data.length) {
                res.send({ status: 1, data: { email: data.email } });
            } else {
                res.send({
                    status: 0,
                    message: "Email or password is incorrect"
                });
            }
        })
        .catch(err => {
            res.send({ status: 0, message: "Connection failed!" });
        });
});

// register route
router.post("/register", async (req, res) => {
    let data = req.body;
    const code = Math.floor(Math.random() * 99999999999 + 1);
    client
        .query(q.Paginate(q.Match(q.Index("findUserByEmail"), data.email)))
        .then(result => {
            if (result.data.length) {
                console.log("The email already exists");
                res.send({ status: 0, message: "The email already exists" });
            } else {
                client
                    .query(
                        q.Create(q.Collection("User"), {
                            data: {
                                email: data.email,
                                password: data.password,
                                officalName: data.officalName,
                                city: data.city,
                                vatNumber: data.vatNumber,
                                atecoCode: data.atecoCode,
                                pec: data.pec,
                                active: "0",
                                verify: code
                            }
                        })
                    )
                    .then(result => {
                        sendMailer(data.email, Utils.EMAIL_VERIFY, code);
                        let userdata = {
                            email: `${data.email}`,
                            id: result.ref.id
                        };
                        res.cookie("userInfo", userdata);
                        res.send({ status: 1, data: userdata });
                    })
                    .catch(err => {
                        res.send({
                            status: 0,
                            message:
                                "An error occured while create your account"
                        });
                    });
            }
        })
        .catch(err => {
            res.send({
                status: 0,
                message: "Connection failed!"
            });
        });
});

// verifcation route
router.get("/verify", (req, res) => {
    client
        .query(q.Get(q.Ref(q.Collection("user"), req.cookies.userInfo.id)))
        .then(result => {
            activateAccount(result.data.verify);
        })
        .catch(err => {
            console.log("DB failed");
        });
    function activateAccount(verify) {
        if (verify === req.query.code) {
            client
                .query(
                    q.Update(
                        q.Ref(q.Collection("user"), req.cookies.UserInfo.id),
                        {
                            data: { active: "1" }
                        }
                    )
                )
                .then(result => {
                    res.render("index");
                });
        }
    }
});

// forgetpassword route
router.post("/forgotpwd", (req, res) => {
    let data = req.body;
    client
        .query(
            q.Paginate(
                q.Match(q.Index("findUserByEmailAndActive"), data.email, "1")
            )
        )
        .then(result => {
            res.send({
                status: 1,
                message:
                    "We've sent an email to reset your password. Please check your email inbox."
            });
            sendMailer(data.email, Utils.FORGOT_PASSWORD, result.data[0].id);
        })
        .catch(err => {
            res.send({ status: 0, message: "Database cannont be connected!" });
        });
});

//reset password
router.post("/resetpwd", (req, res) => {
    let data = req.body;
    client
        .query(
            q.Update(q.Ref(q.Collection("User"), data.userId), {
                data: { password: data.password }
            })
        )
        .then(result => {
            res.send({ status: 1, message: "Password has been changed" });
        })
        .catch(err => {
            res.send({ status: 0, message: "Database cannont be connected!" });
        });
});

module.exports = router;
