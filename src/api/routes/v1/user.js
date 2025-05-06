import express from "express"
import UserService from '../../../services/user-service.js';
import { checkRole, getCurrentRole, getUserId, checkAuth } from "../../../middleware/auth/authHelper.js";
import ROLES from "../../../config/Roles.js";
import { BadRequestError } from "../../../utils/app-errors.js";

const service = new UserService();
const router = express.Router();


router.get("/", async (req, res, next) => {
    console.log("hello");
    try {
        res.status(200).send('<html><body><h1>user servive is working </h1></body></html>');
    } catch (err) {
        next(err);
    }
});



router.post("/create_user", async (req, res, next) => {
    try {
        const userData = req.body;
        const response = await service.AddUser(userData);
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
});

router.post("/user-cart", async (req, res, next) => {
    try {
        const userData = req.body;
        const response = await service.AddUser(userData);
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
});

router.get("/user-owned-courses", checkAuth, checkRole([ROLES.STUDENT]), async (req, res, next) => {
    try {
        const UserId = getUserId(req.auth, ROLES.STUDENT); // Get the UserId from the request
        console.log("UserId", UserId); // Log UserId for debugging
        const OwnedCourses = await service.getOwnedCourses(UserId); // Get the owned courses from the service
        return res.status(200).json({ success: true, message: "fetched the user courses successfully", data: OwnedCourses }); // Return the owned courses as the response
    } catch (err) {
        next(err); // Pass errors to the error-handling middleware
    }
});

router.get("/owns-course/:courseId", checkAuth, checkRole([ROLES.STUDENT]), async (req, res, next) => {
    try {
        console.log("this is the roles ", ROLES.STUDENT)
        const userId = getUserId(req.auth, ROLES.STUDENT); // Get the UserId from the request
        console.log("UserId", userId); // Log UserId for debugging
        const { courseId } = req.params;
        const doesUserOwnsThisCousre = await service.doesUserOwnsThisCousre(userId, courseId); // Get the owned courses from the service
        return res.status(200).json({ success: true, message: "Successfully Fetched Response", data: doesUserOwnsThisCousre }); // Return the owned courses as the response
    } catch (err) {
        next(err); // Pass errors to the error-handling middleware
    }
});



router.delete("/deleteUser/:userId", async (req, res, next) => {
    try {
        const { userId } = req.params; // Extract userId from the request parameters

        console.log("UserId", userId); // Log UserId for debugging
        const deletedUser = await service.deleteUserById(userId); // Get the owned courses from the service
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: deletedUser
        });

    } catch (err) {
        next(err); // Pass errors to the error-handling middleware
    }
});



router.get("/user-cart/:userId", async (req, res, next) => {
    try {
        const { userId } = req.params; // Extract userId from the request parameters

        console.log("UserId", userId); // Log UserId for debugging
        if (!userId) {
            throw new BadRequestError("User ID is required");
        }
        const userCart = await service.getUserCart(userId); // Get the owned courses from the service
        return res.status(200).json({
            success: true,
            message: "User cart fetched successfully",
            data: userCart
        });

    } catch (err) {
        next(err); // Pass errors to the error-handling middleware
    }
});



router.post("/add-to-cart/:courseId", async (req, res, next) => {
    try {

        const userId = getUserId(req.auth, ROLES.STUDENT);
        const { courseId } = req.params; // Extract courseId from the request body

        console.log("UserId", userId); // Log UserId for debugging
        console.log("CourseId", courseId); // Log CourseId for debugging

        if (!userId || !courseId) {
            throw new BadRequestError("User ID and Course ID are required");
        }


        const result = await service.addToCart(userId, courseId); // Get the owned courses from the service
        return res.status(200).json({
            success: result.success,
            message: result.message,
            data: result.data
        });
    } catch (err) {
        next(err); // Pass errors to the error-handling middleware
    }
});


router.post("/purchaseCourse/:courseId", async (req, res, next) => {
    try {

        const userId = getUserId(req.auth, ROLES.STUDENT);
        const { courseId } = req.params; // Extract courseId from the request body

        console.log("UserId", userId); // Log UserId for debugging
        console.log("CourseId", courseId); // Log CourseId for debugging

        if (!userId || !courseId) {
            throw new BadRequestError("User ID and Course ID are required");
        }


        const result = await service.purchaseCourse(userId, courseId); // Get the owned courses from the service

        return res.status(200).json({
            success: result.success,
            message: result.message,
            data: result.data
        });
    } catch (err) {
        next(err); // Pass errors to the error-handling middleware
    }
});




export default router;