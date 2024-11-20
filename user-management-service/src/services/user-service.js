const { UserRepository } = require("../database");
const { FormateData, GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } = require('../utils');
const { APIError, BadRequestError } = require('../utils/app-errors')

const bcrypt = require('bcrypt');


// All Business logic will be here
class UserService { 

    constructor(){
        this.repository = new UserRepository();
    }

//////////////////////////////////////////
async AddUser(email, password) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = await this.repository.CreateUser({
        email,
        password_hash: hashedPassword,
      });
  
      return FormateData(newUser);
    } catch (err) {
      throw new APIError(
        'User Creation Error',
        undefined,
        err.message,
        true
      );
    }
  }
  
////////////all users ////////////////////////


async GetAllUsers() {
    try {
      const users = await this.repository.GetAllUsers();
      
      // Format the data if necessary
      const formattedUsers = users.map(user => ({
        id: user.user_id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      }));

      return formattedUsers;
    } catch (err) {
      console.error(err);
      throw new APIError(
        'User Retrieval Error',
        undefined,
        err.message,
        true
      );
    }
  }

  ////delete user/////


  async DeleteUserById(userId) {
    try {
        if (!userId) {
            throw new Error('User ID is required to delete a user');
        }

        // Call the repository method
        const deletedUser = await this.repository.DeleteUserById(userId);

        return FormateData(deletedUser); // Return formatted data
    } catch (err) {
        console.error('Service Error Deleting User:', err);
        throw new APIError(
            'User Deletion Error',
            undefined,
            err.message,
            true
        );
    }
}



/////////////////////////////////////////////
    async GetProfile(id){

        try {
            const existingCustomer = await this.repository.FindCustomerById({id});
            return FormateData(existingCustomer);
            
        } catch (err) {
            throw new APIError('Data Not found', err)
        }
    }

    async GetShopingDetails(id){

        try {
            const existingCustomer = await this.repository.FindCustomerById({id});
    
            if(existingCustomer){
            return FormateData(existingCustomer);
            }       
            return FormateData({ msg: 'Error'});
            
        } catch (err) {
            throw new APIError('Data Not found', err)
        }
    }

    async GetWishList(customerId){

        try {
            const wishListItems = await this.repository.Wishlist(customerId);
            return FormateData(wishListItems);
        } catch (err) {
            throw new APIError('Data Not found', err)           
        }
    }


    async AddToWishlist(customerId, product) {
        try {
            // Adding a 5-second delay
          //  await new Promise(resolve => setTimeout(resolve, 5000));
    
            const wishlistResult = await this.repository.AddWishlistItem(customerId, product);
            return FormateData(wishlistResult);
    
        } catch (err) {

            throw new APIError(
                'wishlist add Error', // Error name
                undefined,               // No status code provided (defaults to 500)
                err.message, // Custom description
                true,
                          // Pass the actual error message as part of AppError
            );
        }
    }
    

    async ManageCart(customerId, product, qty, isRemove){
        try {
            const cartResult = await this.repository.AddCartItem(customerId, product, qty, isRemove);        
            return FormateData(cartResult);
        } catch (err) {
            throw new APIError('Data Not found', err)
        }
    }

    async ManageOrder(customerId, order){
        try {
            const orderResult = await this.repository.AddOrderToProfile(customerId, order);
            return FormateData(orderResult);
        } catch (err) {
            throw new APIError('Data Not found', err)
        }
    }
    // this is giong to take care of the communication with other services 
    async SubscribeEvents(payload){
        const { event, data } =  payload;

        const { userId, product, order, qty } = data;

        switch(event){
            case 'ADD_TO_WISHLIST':
            case 'REMOVE_FROM_WISHLIST':
                return await this.AddToWishlist(userId,product)
                break;
            case 'ADD_TO_CART':
                this.ManageCart(userId,product, qty, false);
                break;
            case 'REMOVE_FROM_CART':
                this.ManageCart(userId,product,qty, true);
                break;
            case 'CREATE_ORDER':
                this.ManageOrder(userId,order);
                break;
            case 'TESTING':
                console.log("Working --- Subscriber")
                break;
            default:
                break;
        }
 
    }

}

module.exports = UserService;