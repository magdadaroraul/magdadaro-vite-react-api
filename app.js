const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
//const profileRoutes = require('./routes/profile');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb+srv://raulmagdadaro:arjhayholmes7@add-product.c8f9r.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
  });
  
  // Routes
  //app.use('/api', profileRoutes);

const productSchema = new mongoose.Schema({
  product_code: String,
  name: String,
  description: String,
  price: Number,
  qty: Number,
  date_added: Date,
});

const UserProfileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: false },
    dateOfBirth: { type: Date, required: true },
    sex: { type: String, enum: ["Male", "Female", "Other"], required: true },
    placeOfBirth: { type: String, required: true },
    address: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
});

const Product = mongoose.model("Product", productSchema);

const UserProfile = mongoose.model('UserProfile', UserProfileSchema);

// CRUD Operations
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post("/products", async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.json(newProduct);
});

app.put("/products/:id", async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedProduct);
});

app.delete("/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

// GET endpoint to fetch user profile
app.get('/api/profile', async (req, res) => {
    try {
        const profile = await UserProfile.findOne();  // Fetch the first profile record
        res.json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST: Create a new profile
app.post('/profile', async (req, res) => {
    try {
      const profile = new Profile(req.body);
      const savedProfile = await profile.save();
      res.status(201).json(savedProfile);
    } catch (error) {
      console.error("Error creating profile:", error);
      res.status(500).json({ message: "Failed to create profile", error });
    }
  });
  
  // GET: Retrieve all profiles
  app.get('/profiles', async (req, res) => {
    try {
      const profiles = await Profile.find();
      res.status(200).json(profiles);
    } catch (error) {
      console.error("Error retrieving profiles:", error);
      res.status(500).json({ message: "Failed to retrieve profiles", error });
    }
  });
  
  // GET: Retrieve a single profile by ID
  app.get('/profile/:id', async (req, res) => {
    try {
      const profile = await Profile.findById(req.params.id);
      if (!profile) return res.status(404).json({ message: "Profile not found" });
      res.status(200).json(profile);
    } catch (error) {
      console.error("Error retrieving profile:", error);
      res.status(500).json({ message: "Failed to retrieve profile", error });
    }
  });
  
  // PUT: Update a profile by ID
  app.put('/profile/:id', async (req, res) => {
    try {
      const updatedProfile = await Profile.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedProfile) return res.status(404).json({ message: "Profile not found" });
      res.status(200).json(updatedProfile);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile", error });
    }
  });
  
  // DELETE: Delete a profile by ID
  app.delete('/profile/:id', async (req, res) => {
    try {
      const deletedProfile = await Profile.findByIdAndDelete(req.params.id);
      if (!deletedProfile) return res.status(404).json({ message: "Profile not found" });
      res.status(200).json({ message: "Profile deleted successfully" });
    } catch (error) {
      console.error("Error deleting profile:", error);
      res.status(500).json({ message: "Failed to delete profile", error });
    }
  });



