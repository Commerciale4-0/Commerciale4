const router = require("express").Router();
const nodemailer = require("nodemailer");
const { Utils } = require("../utils");
const { client, query } = require("../db");
const q = query;

function sendMailer(emailData) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: Utils.NODEMAILER_ACCOUNT,
            pass: Utils.NODEMAILER_PASSWORD
        }
    });

    const mailOption = {
        from: Utils.SENDER_EMAIL,
        to: emailData.address,
        subject: emailData.subject,
        html: emailData.html
    };

    return transporter.sendMail(mailOption);
}

router.post("/verify-pec", async (req, res) => {
    let data = req.body;
    // let html = `${Utils.VERIFY_EMAIL_MESSAGE}
    //       <br/><br/><a href="${Utils.SERVER_URL}${Utils.NETLIFY_FUNCTIONS_URL}/user/get-verified?id=${data.id}" ${Utils.EMAIL_STYLE}>Verify your email</a>${Utils.MESSAGE_FOOTER}`;
    try {
        await sendMailer({
            address: data.pec,
            subject: Utils.VERIFY_EMAIL_SUBJECT,
            html: Utils.VERIFY_EMAIL_MESSAGE + Utils.MESSAGE_FOOTER
        });
    } catch (e) {
        return res.send({ status: 0, message: e.toString() });
    }
    res.send({ status: 1, message: "Email has been sent" });
});

router.get("/hello", (req, res) => {
    res.send({ express: "Hello!!!!!!!" });
});

// login route
router.post("/login", async (req, res) => {
    let data = req.body;

    try {
        let result = await client.query(
            q.Map(
                q.Paginate(
                    q.Match(
                        q.Index("findUserByEmailAndPassAndActive"),
                        data.email,
                        data.password,
                        "1"
                    )
                ),
                q.Lambda("ref", q.Select(["data"], q.Get(q.Var("ref"))))
            )
        );

        if (result.data.length) {
            res.send({ status: 1, data: result.data[0] });
        } else {
            res.send({
                status: 0,
                message: "Email or password is incorrect"
            });
        }
    } catch (error) {
        res.send({ status: 0, message: "Connection failed!" });
    }
});
// register route
router.post("/register", async (req, res) => {
    let data = req.body;

    try {
        let result = await client.query(
            q.Paginate(q.Match(q.Index("findUserByEmail"), data.email))
        );

        if (result.data.length) {
            return res.send({ status: 0, message: "The email already exists" });
        }

        try {
            result = await client.query(
                q.Create(q.Collection("User"), {
                    data: { ...data, active: "0" }
                })
            );

            res.send({ status: 1, message: "You have been registered" });
            // try {
            //     await sendMailer({
            //         address: data.pec,
            //         subject: Utils.VERIFY_EMAIL_SUBJECT,
            //         html: Utils.VERIFY_EMAIL_MESSAGE + Utils.MESSAGE_FOOTER
            //     });
            //     res.send({ status: 1, message: "Email has been sent" });
            // } catch (e) {
            //     res.send({ status: 0, message: "Email has not been sent" });
            // }
        } catch (e) {
            res.send({ status: 0, message: "A document creation failed!" });
        }
    } catch (e) {
        res.send({ status: 0, message: "Database connection failed!" });
    }
});

// verifcation route
router.get("/get-verified", async (req, res) => {
    try {
        await client.query(
            q.Update(q.Ref(q.Collection("User"), req.query.id), {
                data: { active: "1" }
            })
        );
        res.send(Utils.VERIFY_SUCCESS_PAGE);
    } catch (e) {
        res.send(e);
    }
});

// forgetpassword route
router.post("/forgot-password", async (req, res) => {
    let data = req.body;
    try {
        let result = await client.query(
            q.Paginate(
                q.Match(q.Index("findUserByEmailAndActive"), data.email, "1")
            )
        );

        if (result.data.length) {
            let html = `${Utils.RESET_PASSWORD_MESSAGE}
		  <br/><br/><a href="${Utils.SERVER_URL}/reset-password?id=${result.data[0].id}">${Utils.SERVER_URL}/reset-password?id=${result.data[0].id}</a>${Utils.MESSAGE_FOOTER}`;
            try {
                result = await sendMailer({
                    address: data.email,
                    subject: Utils.RESET_PASSWORD_SUBJECT,
                    html: html
                });

                res.send({
                    status: 1,
                    message:
                        "We've sent an email to reset your password. Please check your email inbox."
                });
            } catch (e) {
                res.send(e);
            }
        } else {
            res.send({
                status: 0,
                message:
                    "The email address doesn't exist.Please enter the email corretly."
            });
        }
    } catch (e) {
        res.send(e);
    }
});

//reset password
router.post("/reset-password", async (req, res) => {
    let data = req.body;
    try {
        await client.query(
            q.Update(q.Ref(q.Collection("User"), data.userId), {
                data: { password: data.password }
            })
        );
        res.send({ status: 1, message: "Password has been changed" });
    } catch (e) {
        res.send(e);
    }
});

//get users 3.28
router.get("/:id", async (req, res) => {
    let result = null;
    try {
        if (req.params.id !== "all") {
            result = await client.query(
                q.Map(
                    q.Paginate(q.Match(q.Index("findUserById"), req.params.id)),
                    q.Lambda("ref", q.Select(["data"], q.Get(q.Var("ref"))))
                )
            );
        } else {
            result = await client.query(
                q.Map(
                    q.Paginate(q.Match(q.Index("findUserByActive"), "1")),
                    q.Lambda("ref", q.Select(["data"], q.Get(q.Var("ref"))))
                )
            );
        }
        res.send({ status: 1, data: result.data });
    } catch (e) {
        res.send({ status: 0, data: "Database connection failed!" });
    }
});
///get profile
router.get("/profile/:id", async (req, res) => {
    let userId = req.params.id;
    try {
        let profile = await client.query(
            q.Map(
                q.Paginate(q.Match(q.Index("findUserById"), userId)),
                q.Lambda("ref", q.Select(["data"], q.Get(q.Var("ref"))))
            )
        );
        let posts = await client.query(
            q.Map(
                q.Paginate(q.Match(q.Index("findPostsByUserId"), userId)),
                q.Lambda("ref", q.Select(["data"], q.Get(q.Var("ref"))))
            )
        );
        res.send({ status: 1, profile: profile.data[0], posts: posts.data });
    } catch (e) {
        res.send({ status: 0, data: "Database connection failed!" });
    }
});

const s3Setting = () => {
    AWS.config.setPromisesDependency(require("bluebird"));
    AWS.config.update({
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        region: process.env.REGION
    });
};

async function singleImageUpload(imageData, userID) {
    s3Setting();
    const s3 = new AWS.S3();
    let matches = imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches.length !== 3) {
        return new Error("Invalid input string");
    }
    let imageType = matches[1];
    let imageBuffer = Buffer.from(matches[2], "base64");
    let extension = mime.extension(imageType);
    let fileName = "image-" + Date.now() + "." + extension;

    const params = {
        Bucket: "commerciale",
        Key: "user-" + userID + "/" + fileName, // type is not required
        Body: imageBuffer,
        // ACL: "public-read",
        ContentEncoding: "base64", // required
        ContentType: `${imageType}` // required. Notice the back ticks
    };

    let key = "";
    try {
        const { Location, Key } = await s3.upload(params).promise();
        key = Key;
        return key;
    } catch (error) {
        return error;
    }
}

async function multipleImageUpload(imageData, userID) {
    s3Setting();
    const s3 = new AWS.S3();
    let location = [];
    let key = [];

    for (let values in imageData) {
        let matches = imageData[values].match(
            /^data:([A-Za-z-+\/]+);base64,(.+)$/
        );
        if (matches.length !== 3) {
            return new Error("Invalid input string");
        }
        let imageType = matches[1];
        let imageBuffer = Buffer.from(matches[2], "base64");
        let extension = mime.extension(imageType);
        let fileName = "image-" + Date.now() + "." + extension;
        let params = {
            Bucket: "commerciale",
            Key: "user-" + userID + "/" + fileName, // type is not required
            Body: imageBuffer,
            // ACL: "public-read",
            ContentEncoding: "base64", // required
            ContentType: `${imageType}` // required. Notice the back ticks
        };
        try {
            const { Location, Key } = await s3.upload(params).promise();
            key.push(Key);
        } catch (error) {
            return error;
        }
    }
    return key;
}

///Edit User Profile Api
router.post("/profile/edit", async (req, res) => {
    let editedData = req.body;
    let logo = "";
    let background = "";
    let productPhoto = "";
    try {
        logo = await singleImageUpload(
            editedData.imageData.logo,
            editedData.id
        );
        background = await singleImageUpload(
            editedData.imageData.background,
            editedData.id
        );
        productPhoto = await multipleImageUpload(
            editedData.imageData.productOrServicePhoto,
            editedData.id
        );
    } catch (error) {
        res.send({ status: 0, message: "Image uploading failed!" });
    }
    try {
        await client.query(
            q.Update(
                q.Select(
                    "ref",
                    q.Get(q.Match(q.Index("findUserById"), editedData.id))
                ),
                {
                    data: {
                        ...editedData.stringData,
                        logo: logo,
                        background: background,
                        productOrServicePhoto: productPhoto
                    }
                }
            )
        );
        res.send({ status: 1, message: "success" });
    } catch (error) {
        res.send({ status: 0, message: "Database connection failed!" });
    }
});

//// create news api
router.post("/news/create", async (req, res) => {
    let newsData = req.body;
    let postedPhoto;
    try {
        postedPhoto = await singleImageUpload(newsData.postImage);
    } catch (error) {
        res.send({ status: 0, message: "Image uploading failed!" });
    }

    try {
        await client.query(
            q.Create(q.Collection("Posts"), {
                data: { ...newsData, postImage: postedPhoto }
            })
        );
        res.send({ status: 1, message: "success" });
    } catch (error) {
        res.send({ status: 0, message: "Database connection failed!" });
    }
});

module.exports = router;
