import UserModel from '../models/User.js'; // Adjust the path to the location of your User model file
import {
    APIError,
    BadRequestError,
    STATUS_CODES,
} from '../../utils/app-errors.js';


//Dealing with data base operations
class UserRepository {

    constructor() {
        this.userModel = UserModel;
    }


    ///////////////////////////////////////////////////
    async CreateUser({ email, password_hash, userId, role, emailVerfied, userTimeJoined }) {
        try {
            // Validate required fields
            if (!email || !password_hash || !userId || !role) {
                throw new Error('Missing required fields: email, password_hash, or userId or role');
            }
            console.log("this is the user id ", userId);
            // Create a new user instance, setting the userId as _id
            const user = new UserModel({
                _id: userId,  // Set the userId as _id
                email,
                password_hash,
                role,
                email_verified: emailVerfied,
            });
            // Save the new user to the database
            const userResult = await user.save();
            return userResult;
        } catch (err) {
            console.error(err);
            throw new APIError(
                'API Error',
                STATUS_CODES.INTERNAL_ERROR,
                'Unable to Create User'
            );
        }
    }

    async GetAllUsers() {
        try {
            console.log("GetAllUsers called");
            const users = await this.userModel.find();
            //     console.log(users);  // Retrieve all users
            return users;
        } catch (err) {
            console.error(err);
            throw new APIError(
                'Database Error',
                STATUS_CODES.INTERNAL_ERROR,
                'Unable to Retrieve Users'
            );
        }
    }
    //////////get user by id/////


    async GetUserById(userId) {
        try {
            if (!userId) {
                throw new Error('User ID is required');
            }

            const user = await UserModel.findOne({ user_id: userId.trim() }).lean(); // .lean() improves read performance by returning plain JS objects a7a awel mara a3raf el kalam da

            if (!user) {
                throw new Error(`User with ID ${userId} not found`);
            }

            return user;
        } catch (err) {
            console.error('Error retrieving user:', err);
            throw new Error('Error retrieving user');
        }
    }


    ////delete user/////

    async DeleteUserById(userId) {
        try {
            // Ensure userId is trimmed of any extra characters
            const trimmedUserId = userId.trim();
            //console.log(trimmedUserId);
            // Find and delete the user by their UUID
            const user = await UserModel.findOneAndDelete({ user_id: trimmedUserId });
            //console.log(user);
            if (!user) {
                throw new Error(`User with ID ${userId} not found`);
            }

            return user; // Return the deleted user data
        } catch (err) {
            console.error(err);
            throw new Error('Error deleting user');
        }
    }

    ////////update user//////


    async UpdateUserById(userId, updates) {
        try {
            if (!userId) {
                throw new Error('User ID is required');
            }

            updates.updated_at = new Date();// here any touch update automatically updated_at

            const updatedUser = await UserModel.findOneAndUpdate(
                { user_id: userId.trim() }, // Match by user_id
                { $set: updates },          // Apply updates
                { new: true, runValidators: true } // Return the updated document and validate inputs
            );
            //console.log(updatedUser);
            if (!updatedUser) {
                throw new Error(`User with ID ${userId} not found`);
            }

            return updatedUser;
        } catch (err) {
            console.error('Error updating user:', err);
            throw new Error('Error updating user');
        }
    }
    ////////////////////notification/////////////////////
    async GetNotificationSettings(userId) {
        try {
            if (!userId) {
                throw new Error('User ID is required to retrieve notification settings');
            }

            const user = await UserModel.findOne({ user_id: userId.trim() }).select('notification_settings').lean();

            if (!user) {
                throw new Error(`User with ID ${userId} not found`);
            }

            return user.notification_settings;
        } catch (err) {
            console.error('Error retrieving notification settings:', err);
            throw new Error('Error retrieving notification settings');
        }
    }

    async UpdateNotificationSettings(userId, notificationSettings) {
        try {
            if (!userId) {
                throw new Error('User ID is required to update notification settings');
            }

            const updatedUser = await UserModel.findOneAndUpdate(
                { user_id: userId.trim() },
                { notification_settings: notificationSettings },
                { new: true, runValidators: true } // Return updated user and validate input
            ).select('notification_settings').lean();

            if (!updatedUser) {
                throw new Error(`User with ID ${userId} not found`);
            }

            return updatedUser.notification_settings;
        } catch (err) {
            console.error('Error updating notification settings:', err);
            throw new Error('Error updating notification settings');
        }
    }
    //////////progile pic/////
    async UpdateProfileImage(userId, profileImageUrl) {
        try {
            if (!userId) {
                throw new Error('User ID is required to update profile image');
            }

            const updatedUser = await UserModel.findOneAndUpdate(
                { user_id: userId.trim() },
                { profile_picture_url: profileImageUrl },
                { new: true, runValidators: true } // Validate the URL and return the updated document
            ).select('profile_picture_url').lean();

            if (!updatedUser) {
                throw new Error(`User with ID ${userId} not found`);
            }

            return updatedUser.profile_picture_url;
        } catch (err) {
            console.error('Error updating profile image:', err);
            throw new Error('Error updating profile image');
        }
    }




    /////////////////////////////////////////////////////////////////////////
    async CreateCustomer({ email, password, phone }) {
        try {
            const customer = new CustomerModel({
                email,
                password,

                phone,
                address: [],
            });
            const customerResult = await customer.save();
            return customerResult;
        } catch (err) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to Create Customer"
            );
        }
    }

    async CreateAddress({ _id, street, postalCode, city, country }) {
        try {
            const profile = await CustomerModel.findById(_id);

            if (profile) {
                const newAddress = new AddressModel({
                    street,
                    postalCode,
                    city,
                    country,
                });

                await newAddress.save();

                profile.address.push(newAddress);
            }

            return await profile.save();
        } catch (err) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Error on Create Address"
            );
        }
    }

    async FindCustomer({ email }) {
        try {
            const existingCustomer = await CustomerModel.findOne({ email: email });
            return existingCustomer;
        } catch (err) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to Find Customer"
            );
        }
    }

    async FindCustomerById({ id }) {
        try {
            const existingCustomer = await CustomerModel.findById(id).populate("address")
            return existingCustomer;
        } catch (err) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to Find Customer"
            );
        }
    }

    async Wishlist(customerId) {
        try {
            const profile = await CustomerModel.findById(customerId).populate(
                "wishlist"
            );

            return profile.wishlist;
        } catch (err) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to Get Wishlist "
            );
        }
    }

    async AddWishlistItem(customerId, { _id, name, desc, price, available, banner }) {
        console.log(`AddWishlistItem called for customer ${customerId} with product ID: ${_id}`);

        const product = { _id, name, desc, price, available, banner };

        const profile = await CustomerModel.findById(customerId).populate('wishlist');
        if (profile) {
            let wishlist = profile.wishlist;
            if (wishlist.length > 0) {
                let isExist = false;
                wishlist = wishlist.filter(item => {
                    if (item._id.toString() === product._id.toString()) {
                        isExist = true;
                        return false; // Removes item if it already exists
                    }
                    return true;
                });

                if (!isExist) {
                    wishlist.push(product); // Add if it doesn’t exist
                }
            } else {
                wishlist.push(product);
            }

            // Set the updated wishlist back to profile
            profile.wishlist = wishlist;

            console.log("Updated Wishlist:", profile.wishlist);

            // Use save instead of update
            const profileResult = await profile.save();

            return profileResult.wishlist;
        } else {
            throw new APIError('Wishlist Add Error', 404, 'Customer profile not found');
        }
    }


    async AddCartItem(customerId, { _id, name, price, banner }, qty, isRemove) {
        try {
            const profile = await CustomerModel.findById(customerId).populate(
                "cart"
            );

            if (profile) {
                const cartItem = {
                    product: { _id, name, price, banner },
                    unit: qty,
                };

                let cartItems = profile.cart;

                if (cartItems.length > 0) {
                    let isExist = false;
                    cartItems.map((item) => {
                        if (item.product._id.toString() === product._id.toString()) {
                            if (isRemove) {
                                cartItems.splice(cartItems.indexOf(item), 1);
                            } else {
                                item.unit = qty;
                            }
                            isExist = true;
                        }
                    });

                    if (!isExist) {
                        cartItems.push(cartItem);
                    }
                } else {
                    cartItems.push(cartItem);
                }

                profile.cart = cartItems;

                const cartSaveResult = await profile.save();

                return cartSaveResult;
            }

            throw new Error("Unable to add to cart!");
        } catch (err) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to Create Customer"
            );
        }
    }

    async AddOrderToProfile(customerId, order) {
        try {
            const profile = await CustomerModel.findById(customerId);

            if (profile) {
                if (profile.orders == undefined) {
                    profile.orders = [];
                }
                profile.orders.push(order);

                profile.cart = [];

                const profileResult = await profile.save();

                return profileResult;
            }

            throw new Error("Unable to add to order!");
        } catch (err) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to Create Customer"
            );
        }
    }
}

export default UserRepository;