const express=require('express');
const router=express.Router();
const authenticateJWT=require('../controllers/jwt-auth')
const usersController=require('../controllers/users.controller');
const transferController=require('../controllers/transfer-controller');
const passwordController=require('../controllers/forget.password.controller');
const productsController=require('../controllers/product-controller')
const chartController =require('../controllers/chart-data')
const withdrawalController=require('../controllers/withdraw-controller')
const coinsController=require('../controllers/coins-controller')
const shopStateController=require('../controllers/shop-state-controller')

// signUp Route
router.post('/signUp', usersController.signUp);

// signIn Route
router.post('/signIn', usersController.signIn);

//Route for update user coins 
router.post('/update-user-coins',authenticateJWT, usersController.updateUserCoins);

// return the coins 
router.post('/get-user-coins',authenticateJWT, usersController.getUserCoins);

// decress the user coins 
router.post('/decress-user-coins',authenticateJWT, usersController.decreaseUserCoins);

// Forget Password Route
router.post('/forgetPassword', passwordController.forgetpassword);

// Reset Password Route
router.post('/reset-password', passwordController.resetPassword);


// get all users expect the current user

router.post('/All-users', authenticateJWT, usersController.getAllUsersExceptCurrentUser);

// tranfer coins route
router.post('/send-coins',authenticateJWT, transferController.transferCoins);


// add product 
router.post('/add-products',authenticateJWT ,productsController.addProduct);

// this route for 
router.post('/add-dataPoint',authenticateJWT ,chartController.addDataPoint);
router.post('/chartData',authenticateJWT ,chartController.getLast7DaysData);


// this route for get withdraw status
router.post('/withdraw-status',authenticateJWT ,withdrawalController.getWithdrawalStatusById);
router.post('/update-withdraw-status',authenticateJWT ,withdrawalController.toggleWithdrawalStatus);

// this route for getting and updating quantity of dzm coins

router.post('/coins-quantity',authenticateJWT ,coinsController.getQuantityById);
router.post('/update-coins-quantity',authenticateJWT ,coinsController.toggleCoinsQuantity);

// this route for getting and updating value of dzm coins
router.post('/coins-value',authenticateJWT ,coinsController.getcoinsValue);
router.post('/update-coins-value',authenticateJWT ,coinsController.togglecoinsValue);

// this route for getting and updating baridmob value
router.post('/baridmob-value',authenticateJWT ,coinsController.getbaridValue);
router.post('/update-baridmob-value',authenticateJWT ,coinsController.togglebaridValue);

// this route for shop satet
router.post('/shop-state',authenticateJWT ,shopStateController.getShopState);
router.post('/update-shop-state',authenticateJWT ,shopStateController.toggleShopState);
module.exports=router;