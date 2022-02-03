const express = require('express');
const app = express();
const session = require('express-session');
const userRouter = require('./routes/users');
const userData = require('./data/users');
const blogData = require('./data/blogs');

app.use(express.json());
app.use(session({
  name: 'AuthCookie',
  secret: 'this yue lin alone moment',
  resave: false,
  saveUninitialized: true
}));
// app.use("/blog", async (req, res, next) => {
//   if (req.method == "POST") {
//     if (req.url == "/login" || req.url == "/signup") {
//       next();
//     } else if (req.url == "/:id/comments" || req.url == "/:id/:commentId") {
//       next();
//     } else {
//       if (!req.session.user) {
//         res.status(401).json({ error: "You must login first" });
//         return;
//       } else {
//         next();
//       }
//     }
//   } else if (req.method == "PUT" || req.method == "PATCH") {
//     if (!req.session.user) {
//       res.status(401).json({ error: "You need to login first" });
//       return;
//     } else {
//       let curUser = req.session.user;
//       let userInfo = await userData.getUserByUsername(curUser.username);
//       let userId = userInfo._id;
//       let urlID = req.url;
//       let blogId = urlID.substring(1, urlID.length);
//       let blogUser = await blogData.getBlog(blogId);
//       if (userId !== blogUser.userThatPosted._id) {
//         res.status(403).json({ error: "You can onlt modify your own blog" });
//         return;
//       } else {
//         next();
//       }
//     }
//   } else {
//     next();
//   }
// });


app.use('/blog', async (req, res, next) => {
  if (!req.session.user) {
    if (req.url == '/login' || req.url == '/signup') {
      next();
    }
    else if (req.method == "PUT" || req.method == "PATCH") {
      let blogInfo = await blogData.getBlog(req.params.id.trim());
      if (req.session.user._id != blogInfo.userThatPosted._id.toString()) {
        return res.status(403).json({ message: 'You can only change your own blog' });
      }
      else {
        next();
      }
    }
    else if (req.method == "DELETE") {
      let comments = blogResult['comments'];
      let length = comments.length;
      if (length == 0) throw "No comment with that ID";
      for (let i = 0; i < length; i++) {
        if (comments[i]['_id'].toString() == req.params.commentId) {
          if (
            comments[i]['userThatPostedComment']['_id'].toString() != req.session.user._id
          ) {
            return res.status(403).json({ message: 'You can not change other comment' });
          }
          else {
            next();
          }
        }
        else {
          if (i == length - 1) throw "No comment with that ID";
        }
      }
    }
    else {
      return res.status(403).json({ message: 'Please login your account first' });
    }
  }
  else {
    next();
  }
});


app.use("/blog", userRouter);


app.use('*', async (req, res) => {
  res.status(404).json({ error: 'There are no apis for you!' });
});

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});