import express from "express";
import mongoose from "mongoose";
import multer from "multer";

//Validators
import checkAuth from './utils/checkAuth.js'
import { registerValidator } from './validators/auth.js';
import { loginValidator } from "./validators/login.js";
import { postCreateValidation } from "./validators/post.js";


//Controllers
import * as UserController from "./constrollers/UserController.js";
import * as PostController from "./constrollers/PostController.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";

mongoose.connect(
    "mongodb+srv://glebasta:12Gjvgtb21@cluster0.d4lortm.mongodb.net/blog?retryWrites=true&w=majority"
).then(() => {
    console.log("DB ok")
}).catch((err) => {
    console.log("DB error", err)
})

const app = express();

//Хранилище для картинок
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
})

//Функция для загрузки
const upload = multer({ storage });

app.use(express.json());
//Роут для того, чтобы при запросе на картинку пользователь мог её посмотреть
app.use('/uploads', express.static('uploads')); // express.static означает что мы делаем get запрос на получение статичного файла

//Auth
app.post('/auth/login',  loginValidator, handleValidationErrors, UserController.login)
app.post('/auth/register',  registerValidator, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)


//Роут для обработки загрузки картинки
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

//Posts
app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)

bla bla
app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
})