const express=require('express');
const router=express.Router();
const path = require('path');
const authenticateJWT=require('../controllers/jwt-auth')
const usersController=require('../controllers/users.controller')
const searchController=require('../controllers/search-controller')
const productsController=require('../controllers/product-controller')



router.get('/reset-password/:resetToken', (req, res) => {
    
    const root = path.join('./', 'view');
    // Render the HTML page for resetting password
    res.sendFile('reset-password.html', { root });
    
  });
router.get('/email-verification/:email', (req, res) => {
    const userEmail = req.params.email;
    
    // Assuming you have some database logic here to update is_verified status
    // For demonstration purposes, let's assume you have a function to update the status
    usersController.updateUserVerificationStatus(userEmail)
        .then(() => {
            // Render the HTML page for email verification
            const root = path.join('./', 'view');
            res.sendFile('email-verification.html', { root });
        })
        .catch(err => {
            console.error("Error updating user verification status:", err);
            res.status(500).send("Internal Server Error");
        });
});

// search route

router.get('/search', authenticateJWT, searchController.searchByUsername);
router.get('/products', authenticateJWT, productsController.getProducts);


module.exports=router;