import express from "express"
import UserService from '../../../services/user-service.js';
import { checkRole, getCurrentRole, getUserId, checkAuth, getTokenFromRequest } from "../../../middleware/auth/authHelper.js";
import ROLES from "../../../config/Roles.js";
import { BadRequestError } from "../../../utils/app-errors.js";

const service = new UserService();
const router = express.Router();


router.get("/", async (req, res, next) => {

    try {
        res.status(200).send('<html><body><h1>auth server is saying hello </h1></body></html>');
    } catch (err) {
        next(err);
    }
});

// app.get("/jwt/jwks.json", async (req, res, next) => {
//     try {
//         const response = await axios.get(``);
//         res.status(200).json(response.data);
//     } catch (error) {
//         next(new Error("Unable to fetch JWKS from SuperTokens"));
//     }
// });



export default router;