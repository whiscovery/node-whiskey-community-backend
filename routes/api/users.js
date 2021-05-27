const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const key = require('../../config/Keys').secret;
const User = require('../../models/User');

/**
 * @route POST api/users/register
 * @desc Register the User
 * @access Public
 */
 router.post('/register/checkemail', (req, res) => {
    // Check for the Unique Email
    User.findOne({
        email: req.body.email
    }).then(user => {
        if (user) {
            return res.status(400).json({
                msg: "Email is already registred.",
                checkemail: false
            });
        } else {
            return res.status(201).json({
                msg: "You can use this email.",
                checkemail: true
            });
        }
    });
 });

 router.post('/register/checknick', (req, res) => {
    // Check for the Unique Nick
    User.findOne({
        nick: req.body.nick
    }).then(user => {
        if (user) {
            return res.status(400).json({
                msg: "Nickname is already registred.",
                checknick: false
            });
        } else {
            return res.status(201).json({
                msg: "You can use this nickname.",
                checknick: true
            });
        }
    });
 });

 router.post('/register', (req, res) => {
    let {
        nick,
        email,
        password,
        confirm_password,
        checkemail,
        checknick
    } = req.body

    if (password !== confirm_password) {
        return res.status(400).json({
            msg: "Password do not match."
        });
    } else if (!checknick) {
        return res.status(400).json({
            msg: "닉네임 중복 체크해주세요"
        });
    } else if (!checkemail) {
        return res.status(400).json({
            msg: "이메일중복체크해주세요"
        });
    }
    
    // The data is valid and new we can register the user
    let newUser = new User({
        nick,
        password,
        email
    });
    // Hash the password
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save().then(user => {
                return res.status(201).json({
                    success: true,
                    msg: "Hurry! User is now registered."
                });
            });
        });
    });
});




/**
 * @route POST api/users/login
 * @desc Signing in the User
 * @access Public
 */
router.post('/login', (req, res) => {
    User.findOne({
        email: req.body.email
    }).then(user => {
        if (!user) {
            return res.status(404).json({
                msg: "email is not found.",
                success: false
            });
        }
        // If there is user we are now going to compare the password
        bcrypt.compare(req.body.password, user.password).then(isMatch => {
            if (isMatch) {
                // User's password is correct and we need to send the JSON Token for that user
                const payload = {
                    _id: user._id,
                    id: user.id,
                    nick: user.nick,
                    name: user.name,
                    email: user.email
                }
                jwt.sign(payload, key, {
                    expiresIn: 604800
                }, (err, token) => {
                    res.status(200).json({
                        success: true,
                        token: `Bearer ${token}`,
                        user: user,
                        msg: "Hurry! You are now logged in."
                    });
                })
            } else {
                return res.status(404).json({
                    msg: "Incorrect password.",
                    success: false
                });
            }
        })
    });
});

/**
 * @route POST api/users/profile
 * @desc Return the User's Data
 * @access Private
 */
router.get('/myworld', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    return res.json({
        user: req.user
    });
});
module.exports = router;





// app.post("/login", (req, res) => {
//     //로그인을할때 아이디와 비밀번호를 받는다
//     User.findOne({ email: req.body.email }, (err, user) => {
//       if (err || !user) {
//         return res.json({
//           loginSuccess: false,
//           message: "존재하지 않는 아이디입니다.",
//         });
//       }
//       user
//         .comparePassword(req.body.password)
//         .then((isMatch) => {
//           if (!isMatch) {
//             return res.json({
//               loginSuccess: false,
//               message: "비밀번호가 일치하지 않습니다",
//             });
//           }
//           //비밀번호가 일치하면 토큰을 생성한다
//           //해야될것: jwt 토큰 생성하는 메소드 작성
//         user
//             .generateToken()
//             .then((user) => {
//                 res.cookie('x_auth', user.token, { maxAge: 10000 })
//                 .status(200).json({
//                   loginSuccess: true,
//                   userId: user._id,
//                   token: user.token
//               });
//             })
//             .catch((err) => {
//               res.status(400).send(err);
//             });

//         })
//         .catch((err) => res.json({ loginSuccess: false, err }));
//     });
//   });


// //user_id를 찾아서(auth를 통해 user의 정보에 들어있다) db에있는 토큰값을 비워준다
// app.get("/logout", auth, (req, res) => {
//     User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
//       if (err) return res.json({ success: false, err });
//       res.clearCookie("x_auth");
//       console.log("logout");
//       return res.status(200).send({
//         success: true,
//       });
//     });
//   });