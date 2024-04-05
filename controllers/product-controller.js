// productsController.js

const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { Products } = require('../models'); // Import the Products model

// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify destination directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use original filename for the uploaded file
  }
});

// Create multer instance with storage configuration
const upload = multer({ storage: storage });

const productsController = {
 // Assuming `Products` is your Sequelize model for products
getProducts: async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Products.findAll();

    // Convert the `product_images` field from stringified JSON to a JavaScript array
    const formattedProducts = products.map(product => ({
      ...product.toJSON(),
      product_images: JSON.parse(product.product_images)
    }));

    // Send the formatted products as the response
    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
},

  // Add a new product with multiple images upload
addProduct: async (req, res) => {
  try {
    // Use upload.array middleware to handle multiple file uploads
    upload.array('product_images', 3)(req, res, async (err) => {
      if (err) {
        console.error('Error uploading images:', err);
        return res.status(400).json({ error: 'Failed to upload images' });
      }

      const { price, product_desc, product_name } = req.body;
      const productImages = req.files;

      // Check if all required fields are provided
      if (!price || !product_desc || !product_name) {
        return res.status(400).json({ error: 'Please provide all required fields' });
      }

      // Check if productImages is undefined or empty
      if (!productImages || productImages.length === 0) {
        return res.status(400).json({ error: 'Please upload at least one image' });
      }

      // Create a new product record in the database
      const newProduct = await Products.create({
        price,
        product_desc,
        product_name,
        product_images: productImages.map(image => image.filename) // Store image filenames in the database
      });
     

      res.status(201).json({ message: 'Product added successfully', product: newProduct });
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

};

module.exports = productsController;
