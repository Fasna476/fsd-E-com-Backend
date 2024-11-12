const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const userModel = require("./models/user")
const productModel = require("./models/product")



const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://ayishafasna476:ict2@cluster0.kxunf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")


const allusers = userModel


app.post('/register', (req, res)=>{
    userModel.create(req.body)
    .then(user => res.json(user))
    .catch(err => res.json(err))
})

app.post('/login', (req, res) =>{
    const {email, password} = req.body;
    userModel.findOne({email: email})
    .then(user => {
        if(user) {
            if(user.userType === "Admin" && user.password === password){
                res.json("Admin success")
            }
            else if(user.password === password) {
                res.json("user success")
            } else{
                res.json("the password is incorrect")
            }
        } else{
            res.json("No record exists")
        }
    })
})

app.get("/getalluser" , async(req, res)=>{
    try{
        const allUser= await allusers.find({})
        res.send({status:"ok" , data: allUser})
    }catch(error){
        console.log(error);
    }
})
app.delete("/deleteuser/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await allusers.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).send({ status: "error", message: "User not found" });
        }

        res.send({ status: "ok", message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", message: "An error occurred" });
    }
});



// app.post('/addProduct', async(req,res)=>{
//     try{
//         const{title, price,category,description, image} =req.body;
//         const product = new productModel({ title, price,category,description, image});
//       await product.save();
//       res.json(product);
//     }catch (error) {
//         res.json({ message: 'Error adding product', error });
//       }
// })

app.post('/addProduct', async (req, res) => {
    try {
        const { title, price, category, description, image } = req.body;

        // Basic Validation: Ensure all fields are provided
        if (!title || !price || !category || !description || !image) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create a new product using the provided data
        const product = new productModel({
            title,
            price,
            category,
            description,
            image,
        });

        // Save the product to the database
        await product.save();

        // Return the newly created product
        res.status(201).json(product); // 201 Created status
    } catch (error) {
        // Catch any error and send the response
        res.status(500).json({ message: 'Error adding product', error });
    }
});

// GET all products
app.get('/getAllProducts', async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ status: 'ok', data: products });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
});

// GET a product by ID
app.get('/getProduct/:id', async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ status: 'ok', data: product });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error });
    }
});


// PUT (Update) a product by ID
app.put('/updateProduct/:id', async (req, res) => {
    try {
        const { title, price, category, description, image } = req.body;

        if (!title || !price || !category || !description || !image) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const updatedProduct = await productModel.findByIdAndUpdate(
            req.params.id,
            { title, price, category, description, image },
            { new: true }  // Returns the updated document
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ status: 'ok', data: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error });
    }
});

// DELETE a product by ID
app.delete('/deleteProduct/:id', async (req, res) => {
    try {
        const deletedProduct = await productModel.findByIdAndDelete(req.params.id);
        
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ status: 'ok', message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error });
    }
});




app.post('/checkout', async (req, res) => {
    try {
        const { userId, cartItems, shippingDetails, paymentDetails } = req.body;

        // Validate and process payment here (e.g., using a payment gateway like Stripe or PayPal)
        
        // Save the order in the database
        const newOrder = new Order({
            userId,
            cartItems,
            shippingDetails,
            paymentDetails,
            status: 'Pending', // Order status: Pending, Paid, Shipped, etc.
        });

        await newOrder.save();
        
        // Clear the user's cart (if stored in DB or localStorage)

        res.status(200).json({ message: 'Order placed successfully', orderId: newOrder._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error placing order', error });
    }
});




app.listen(3010, () => {
    console.log("server is running")
})