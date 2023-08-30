import express from "express";
import mongoose from "mongoose";

//Validators
import checkAuth from './utils/checkAuth.js'
import { registerValidator } from './validators/auth.js';
import { loginValidator } from "./validators/login.js";
import { postCreateValidation } from "./validators/post.js";


//Controllers
import * as UserController from "./constrollers/UserController.js";
import * as PostController from "./constrollers/PostController.js";

mongoose.connect(
    "mongodb+srv://glebasta:12Gjvgtb21@cluster0.d4lortm.mongodb.net/blog?retryWrites=true&w=majority"
).then(() => {
    console.log("DB ok")
}).catch((err) => {
    console.log("DB error", err)
})

const app = express();

app.use(express.json());

app.post('/auth/login', loginValidator, UserController.login)
app.post('/auth/register', registerValidator, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

//Posts
app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
// app.delete('/posts/:id', PostController.remove)
// app.patch('/posts/:id', PostController.update)
app.post('/posts', checkAuth, postCreateValidation, PostController.create)


app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
})