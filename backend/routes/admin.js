const router = require("express").Router();
const nodemailer = require("nodemailer");
const { Utils } = require("../utils");
const { client, query } = require("../db");
const q = query;

const encrypt = (password) => {
    let mykey = crypto.createCipher("aes-128-cbc", password);
    let encodePassword = mykey.update("abc", "utf8", "hex");
    encodePassword += mykey.final("hex");
    return encodePassword;
};

router.post("/users/pending", async (req, res) => {
    try {
        let resultData = await client.query(q.Map(q.Paginate(q.Match(q.Index("findUserByActive"), "0")), q.Lambda("ref", q.Select(["data"], q.Get(q.Var("ref"))))));
        if (resultData.data.length) {
            res.send({ status: 1, data: resultData.data });
        } else {
            res.send({ status: 0, data: "No pending user" });
        }
    } catch (e) {
        res.send({ status: 0, data: "Database connection failed!" });
    }
});

router.post("/users/pending/active", async (req, res) => {
    let data = req.body;
    console.log(data.id);
    let saveToData = {
        data: {
            active: "1",
        },
    };
    try {
        await client.query(q.Update(q.Select("ref", q.Get(q.Match(q.Index("findUserById"), parseInt(data.id)))), saveToData));
        res.send({ status: 1, data: "Updated successfully!" });
    } catch (error) {
        console.log({ status: 0, message: "Database connection failed!" });
    }
});

router.post("/users/pending/delete", async (req, res) => {
    let data = req.body;
    console.log(data);
    try {
        await client.query(q.Delete(q.Select("ref", q.Get(q.Match(q.Index("findUserById"), parseInt(data.id))))));
        res.send({ status: 1, data: "Deleted successfully!" });
    } catch (error) {
        console.log({ status: 0, message: "Database connection failed!" });
    }
});
router.post("/users/reject", async (req, res) => {
    let data = req.body;
    let saveToData = {
        data: {
            blocked: 0,
        },
    };
    try {
        await client.query(q.Update(q.Select("ref", q.Get(q.Match(q.Index("findUserById"), parseInt(data.id)))), saveToData));

        res.send({
            status: 1,
            data: "Updated successfully",
        });
    } catch (error) {
        res.send({ status: 0, message: "Database connection failed!" });
    }
});

router.post("/modify-account", async (req, res) => {
    console.log(req.body);
    try {
        await client.query(
            q.Update(q.Select("ref", q.Get(q.Match(q.Index("findAccountByUserName"), req.body.oldUserName))), {
                data: { username: req.body.newUserName, password: req.body.password },
            })
        );

        res.send({ status: 1, data: "Updated successfully!" });
    } catch (e) {
        res.send({ status: 0, data: "Database connection failed!" });
    }
});
router.post("/login", async (req, res) => {
    let data = req.body;
    try {
        let result = await client.query(
            q.Map(
                q.Paginate(q.Match(q.Index("findAccountByUsernameAndPassword"), data.username, data.password)),
                q.Lambda("ref", q.Select(["data"], q.Get(q.Var("ref"))))
            )
        );

        if (!result.data.length) {
            res.send({
                status: 0,
                data: "UserName or password is incorrect",
            });
        } else {
            res.send({
                status: 1,
                data: result.data[0],
            });
        }
    } catch (error) {
        res.send({ status: 0, data: "Database connection failed!" });
    }
});

module.exports = router;
