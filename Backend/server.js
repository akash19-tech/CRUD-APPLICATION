require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./db");
const Contact = require("./models/contact");

const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes

// 1. POST /contacts - Add a new contact
app.post("/contacts", async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, company, jobTitle } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !phoneNumber) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    // Create and save contact
    const newContact = new Contact({ firstName, lastName, email, phoneNumber, company, jobTitle });
    await newContact.save();
    res.status(201).json({ message: "Contact added successfully!", contact: newContact });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ message: "Contact with this email already exists." });
    } else {
      res.status(500).json({ message: "Server error", error });
    }
  }
});

// 2. GET /contacts - Get all contacts
app.get("/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// 3. PUT /contacts/:id - Update a contact
app.put("/contacts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found." });
    }
    res.status(200).json({ message: "Contact updated successfully!", contact: updatedContact });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// 4. DELETE /contacts/:id - Delete a contact
app.delete("/contacts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found." });
    }
    res.status(200).json({ message: "Contact deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

