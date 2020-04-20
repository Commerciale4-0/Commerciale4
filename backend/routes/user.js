const router = require("express").Router();
const nodemailer = require("nodemailer");
const { Utils } = require("../utils");
const { client, query } = require("../db");
const q = query;

const crypto = require("crypto");
const AWS = require("aws-sdk");

function sendMailer(emailData) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "daxing999@gmail.com",
            pass: "Eightyfour526",
            // user: Utils.NODEMAILER_ACCOUNT,
            // pass: Utils.NODEMAILER_PASSWORD,
        },
    });

    const mailOption = {
        // from: Utils.SENDER_EMAIL,
        from: "daxing999@gmail.com",
        to: emailData.address,
        subject: emailData.subject,
        html: emailData.html,
    };

    return transporter.sendMail(mailOption);
}
const encrypt = (password) => {
    let mykey = crypto.createCipher("aes-128-cbc", password);
    let encodePassword = mykey.update("abc", "utf8", "hex");
    encodePassword += mykey.final("hex");
    return encodePassword;
};
const getID = () => {
    const hrTime = process.hrtime();
    const nanoSecond = hrTime[0] * 1000000000 + hrTime[1];
    return nanoSecond;
};

// router.post('/upload-companies', async(req, res) => {
//     let companies = req.body;
//     companies.forEach(company => {
//         let result = await client.query(
//             q.Create(q.Collection("User"), {
//                 data: {
//                     ...company,
//                     active: "1",
//                     id: getID(),
//                 },
//             })
//         );

//     })
// })

router.post("/verify-pec", async (req, res) => {
    let data = req.body;
    // let html = `${Utils.VERIFY_EMAIL_MESSAGE}
    //       <br/><br/><a href="${Utils.SERVER_URL}${Utils.NETLIFY_FUNCTIONS_URL}/user/get-verified?id=${data.id}" ${Utils.EMAIL_STYLE}>Verify your email</a>${Utils.MESSAGE_FOOTER}`;
    try {
        await sendMailer({
            address: data.pec,
            subject: Utils.VERIFY_EMAIL_SUBJECT,
            html: Utils.VERIFY_EMAIL_MESSAGE + Utils.MESSAGE_FOOTER,
        });
    } catch (e) {
        console.log(e.toString());
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
                q.Paginate(q.Match(q.Index("findUserByEmailAndPassAndActive"), data.email, encrypt(data.password), "1")),
                q.Lambda("ref", q.Select(["data"], q.Get(q.Var("ref"))))
            )
        );
        if (!result.data.length) {
            res.send({
                status: 0,
                message: "Email or password is incorrect",
            });
        } else {
            let posts = await client.query(
                q.Map(q.Paginate(q.Match(q.Index("findPostsByUserId"), result.data[0].id)), q.Lambda("ref", q.Select(["data"], q.Get(q.Var("ref")))))
            );
            res.send({
                status: 1,
                data: { user: result.data[0], posts: posts.data },
            });
        }
    } catch (error) {
        res.send({ status: -1, message: "Connection failed!" });
    }
});
// register route
router.post("/register", async (req, res) => {
    let data = req.body;

    try {
        let result = await client.query(q.Paginate(q.Match(q.Index("findUserByEmail"), data.email)));

        if (result.data.length) {
            return res.send({ status: 0, message: "The email already exists" });
        }

        try {
            result = await client.query(
                q.Create(q.Collection("User"), {
                    data: {
                        ...data,
                        active: "0",
                        id: getID(),
                        password: encrypt(data.password),
                    },
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
            res.send({ status: -1, message: "A document creation failed!" });
        }
    } catch (e) {
        res.send({ status: -1, message: "Database connection failed!" });
    }
});

// verifcation route
router.get("/get-verified", async (req, res) => {
    try {
        await client.query(
            q.Update(q.Ref(q.Collection("User"), req.query.id), {
                data: { active: "1" },
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
        let result = await client.query(q.Paginate(q.Match(q.Index("findUserByEmailAndActive"), data.email, "1")));

        if (result.data.length) {
            let html = `${Utils.RESET_PASSWORD_MESSAGE}
          <br/><br/><a href="${Utils.SERVER_URL}/reset-password?id=${result.data[0].id}">${Utils.SERVER_URL}/reset-password?id=${result.data[0].id}</a>${Utils.MESSAGE_FOOTER}`;
            try {
                result = await sendMailer({
                    address: data.email,
                    subject: Utils.RESET_PASSWORD_SUBJECT,
                    html: html,
                });

                res.send({
                    status: 1,
                    message: "We've sent an email to reset your password. Please check your email inbox.",
                });
            } catch (e) {
                res.send(e);
            }
        } else {
            res.send({
                status: 0,
                message: "The email address doesn't exist.Please enter the email corretly.",
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
        let result = await client.query(
            q.Update(q.Ref(q.Collection("User"), data.userId), {
                data: { password: encrypt(data.password) },
            })
        );

        if (!result.length) {
            res.send({ status: 0, message: "The user doesn't exist" });
        } else {
            res.send({ status: 1, message: "Password has been changed" });
        }
    } catch (e) {
        res.send(e);
    }
});

//get users 3.28
router.post("/", async (req, res) => {
    let userId = parseInt(req.body.id);
    if (!userId) {
        res.send({ status: 0, data: "error!" });
        return;
    }
    try {
        let result = await client.query(q.Map(q.Paginate(q.Match(q.Index("findUserById"), userId)), q.Lambda("ref", q.Select(["data"], q.Get(q.Var("ref"))))));
        let posts = await client.query(
            q.Map(q.Paginate(q.Match(q.Index("findPostsByUserId"), parseInt(userId))), q.Lambda("ref", q.Select(["data"], q.Get(q.Var("ref")))))
        );
        if (result.data.length) {
            res.send({
                status: 1,
                data: { user: result.data[0], posts: posts.data },
            });
        } else {
            res.send({ status: 0, data: "User doesn't exist!" });
        }
    } catch (error) {
        console.log(error);
        res.send({ status: 0, data: "Database connection failed!" });
    }
});

router.post("/all", async (req, res) => {
    try {
        let result = await client.query(q.Map(q.Paginate(q.Match(q.Index("findUserByActive"), "1")), q.Lambda("ref", q.Select(["data"], q.Get(q.Var("ref"))))));
        if (result.data.length) {
            res.send({ status: 1, data: result.data });
        } else {
            res.send({ status: 0, data: "User doesn't exist!" });
        }
    } catch (error) {
        console.log(error);
        res.send({ status: 0, data: "Database connection failed!" });
    }
});
///get profile
router.get("/profile/:id", async (req, res) => {
    let userId = req.params.id;
    try {
        let profile = await client.query(q.Map(q.Paginate(q.Match(q.Index("findUserById"), userId)), q.Lambda("ref", q.Select(["data"], q.Get(q.Var("ref"))))));
        let posts = await client.query(q.Map(q.Paginate(q.Match(q.Index("findPostsByUserId"), userId)), q.Lambda("ref", q.Select(["data"], q.Get(q.Var("ref"))))));
        res.send({ status: 1, profile: profile.data[0], posts: posts.data });
    } catch (e) {
        res.send({ status: 0, data: "Database connection failed!" });
    }
});

const s3Setting = () => {
    AWS.config.setPromisesDependency(require("bluebird"));
    AWS.config.update({
        accessKeyId: process.env.BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.BUCKET_SECRET_KEY,
        region: process.env.BUCKET_REGION,
    });
};

async function deleteImage(keyArray) {
    s3Setting();
    const s3 = new AWS.S3();

    for (let i in keyArray) {
        if (keyArray[i]) {
            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: keyArray[i], //if any sub folder-> path/of/the/folder.ext
            };

            try {
                await s3.headObject(params).promise();
                console.log("File Found in S3");
                try {
                    await s3.deleteObject(params).promise();
                } catch (err) {
                    console.log("ERROR in file Deleting : " + JSON.stringify(err));
                    return false;
                }
            } catch (err) {
                console.log("File not Found ERROR11 : " + err.code);
                return false;
            }
        }
    }
    return true;
}

async function singleImageUpload(imageData, userID) {
    s3Setting();

    const s3 = new AWS.S3();

    let matches = imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches.length !== 3) {
        return new Error("Invalid input string");
    }

    let imageType = matches[1];
    let imageBuffer = Buffer.from(matches[2], "base64");
    let extension = imageType.substr(6, imageType.length);
    let fileName = "image-" + Date.now() + "." + extension;

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: "user-" + userID + "/" + fileName, // type is not required
        Body: imageBuffer,
        ACL: "public-read",
        ContentEncoding: "base64", // required
        ContentType: `${imageType}`, // required. Notice the back ticks
    };

    let key = "";
    try {
        const { Location, Key } = await s3.upload(params).promise();
        key = Key;
        return key;
    } catch (error) {
        return "error";
    }
}

async function multipleImageUpload(imageData, userID) {
    s3Setting();
    const s3 = new AWS.S3();
    let location = [];
    let key = [];

    for (let index in imageData) {
        let matches = imageData[index].match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches) {
            if (matches.length !== 3) {
                return new Error("Invalid input string");
            }
            let imageType = matches[1];
            let imageBuffer = Buffer.from(matches[2], "base64");
            let extension = imageType.substr(6, imageType.length);
            let fileName = "image-" + Date.now() + "." + extension;
            let params = {
                Bucket: process.env.BUCKET_NAME,
                Key: "user-" + userID + "/" + fileName, // type is not required
                Body: imageBuffer,
                ACL: "public-read",
                ContentEncoding: "base64", // required
                ContentType: `${imageType}`, // required. Notice the back ticks
            };
            try {
                const { Location, Key } = await s3.upload(params).promise();
                key.push(Key);
            } catch (error) {
                return "error";
            }
        } else {
            key.push(imageData[index]);
        }
    }
    return key;
}

///Edit User Profile Api
router.post("/profile/edit", async (req, res) => {
    let data = req.body;
    let logoUrl = null;
    let backgroundUrl = null;
    let productPhotos = null;
    let saveToData = { data: data.stringData };

    if (data.imageData.background) {
        try {
            backgroundUrl = await singleImageUpload(data.imageData.background, data.id);
        } catch (error) {
            console.log(error);
        }
        if (backgroundUrl !== "error") {
            saveToData.data.background = backgroundUrl;
        }
    }

    if (data.imageData.logo) {
        try {
            logoUrl = await singleImageUpload(data.imageData.logo, data.id);
        } catch (error) {
            console.log(error);
        }
        if (logoUrl !== "error") {
            saveToData.data.logo = logoUrl;
        }
    }

    if (data.imageData.productPhotos) {
        try {
            productPhotos = await multipleImageUpload(data.imageData.productPhotos, data.id);
        } catch (error) {
            console.log(error);
        }
        if (productPhotos !== "error") {
            saveToData.data.productPhotos = productPhotos;
        }
    }

    try {
        let result = await client.query(q.Update(q.Select("ref", q.Get(q.Match(q.Index("findUserById"), data.id))), saveToData));

        res.send({
            status: 1,
            data: result.data,
        });
    } catch (error) {
        res.send({ status: 0, message: "Database connection failed!" });
    }
});
///Delete user profile
router.post("/profile/remove-photos", async (req, res) => {
    let data = req.body;
    console.log(data);
    if (data) {
        let removeRes = await deleteImage(data);
        if (removeRes) {
            res.send({ status: 1, data: "success" });
        } else {
            res.send({ status: 0, data: "fail" });
        }
    } else {
        res.send({ status: 0, data: "no photos to delete" });
    }
});
//// create news api
router.post("/news/create", async (req, res) => {
    let newsData = req.body;
    let photo = null;
    if (newsData.photo) {
        try {
            photo = await singleImageUpload(newsData.photo, newsData.userId);
        } catch (error) {
            res.send({ status: 0, message: "Image uploading failed!" });
        }
    }
    if (photo !== "error") {
        newsData.photo = photo;
    }
    try {
        let result = await client.query(
            q.Create(q.Collection("Posts"), {
                data: {
                    ...newsData,
                    id: getID(),
                    published: Date.now(),
                },
            })
        );
        res.send({ status: 1, data: result.data });
    } catch (error) {
        res.send({ status: 0, message: "Database connection failed!" });
    }
});

//// delete news api
router.post("/news/delete", async (req, res) => {
    let data = req.body;
    let photo = data.photo;
    if (photo) {
        try {
            photo = await deleteImage([photo]);
        } catch (error) {
            res.send({ status: 0, message: "Image deleting failed!" });
        }
    }

    try {
        await client.query(q.Delete(q.Select("ref", q.Get(q.Match(q.Index("findPostsById"), data.id)))));
        res.send({ status: 1, message: "Deleted successfully!" });
    } catch (error) {
        res.send({ status: 0, message: "Database connection failed!" });
    }
});
////delete user api
router.post("/delete", async (req, res) => {
    let data = req.body;
    try {
        await deleteImage(data.removePhotos);
    } catch (error) {
        res.send({ status: 0, message: "Image deleting failed!" });
    }
    try {
        await client.query(q.Delete(q.Select("ref", q.Get(q.Match(q.Index("findUserById"), data.id)))));
    } catch (error) {
        res.send({ status: 0, message: "Database connection failed!" });
    }
    try {
        let isPosts = await client.query(q.Map(q.Paginate(q.Match(q.Index("findPostsByUserId"), data.id)), q.Lambda("ref", q.Select(["data"], q.Get(q.Var("ref"))))));
        if (isPosts.data.length) {
            await client.query(q.Delete(q.Select("ref", q.Get(q.Match(q.Index("findPostsByUserId"), data.id)))));
        }
    } catch (error) {
        res.send({ status: 0, message: "Database connection failed!" });
        console.log(error);
    }
    res.send({ status: 1, message: "Deleted successfully!" });
});
////update user email
router.post("/update-email", async (req, res) => {
    let data = req.body;
    console.log(data);
    let saveToData = {
        data: {
            email: data.newEmail,
        },
    };
    try {
        let result = await client.query(q.Update(q.Select("ref", q.Get(q.Match(q.Index("findUserById"), data.id))), saveToData));
        res.send({ status: 1, data: result.data.email });
    } catch (error) {
        console.log({ status: 0, message: "Database connection failed!" });
    }
});
////////////////////////////////////////////////////////////////////// change password in profile page
router.post("/change-password", async (req, res) => {
    let data = req.body;

    try {
        let result = await client.query(
            q.Update(q.Select("ref", q.Get(q.Match(q.Index("findUserById"), data.id))), {
                data: { password: encrypt(data.password) },
            })
        );
        res.send({
            status: 1,
            data: result.data.password,
            message: "Password has been changed",
        });
    } catch (e) {
        res.send({ status: 0, message: "Database connection failed!" });
    }
});
module.exports = router;
