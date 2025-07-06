const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const VendorAdminModel = require("../models/adminModel");
const { verifyToken } = require("../middleware/authMiddleware");
const { sendEmail } = require("../services/mailService"); // Import the mail service
const { generatePasswordEmailTemplate } = require("../services/mailService"); // Import the password email template function
require("dotenv").config();

// .......................................Login Controller.............................................//
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await VendorAdminModel.findByEmail(email);
    if (!admin)
      return res.status(404).json({ message: "Vendor Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Partial code (only modifying login)
// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const admin = await VendorAdminModel.findByEmail(email);
//     if (!admin)
//       return res.status(404).json({ message: "Vendor Admin not found" });

//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch)
//       return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign(
//       { id: admin.id, role: admin.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     // Return role in response
//     res
//       .status(200)
//       .json({ message: "Login successful", token, role: admin.role });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// ......................................Logout Controller.........................................//
exports.logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// 

exports.addVendor = [
  verifyToken,
  async (req, res) => {
    const {
      name,
      company_name,
      company_type,
      gstin,
      contact_number,
      email,
      password,
      address,
      pincode,
    } = req.body;

    try {
      if (req.user.role !== "vendor") {
        return res
          .status(403)
          .json({ message: "Unauthorized: Only Super Admins can add Vendors" });
      }

      if (
        !name ||
        !company_name ||
        !company_type ||
        !gstin ||
        !contact_number ||
        !email ||
        !password ||
        !address ||
        !pincode
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const existingVendor = await pool.query(
        "SELECT * FROM vendors WHERE email = $1",
        [email]
      );
      if (existingVendor.rows.length > 0) {
        return res
          .status(400)
          .json({ message: "Vendor with this email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newVendor = await pool.query(
        `INSERT INTO vendors (name, company_name, company_type, gstin, contact_number, email, password, address, pincode)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id, name, company_name, email`,
        [
          name,
          company_name,
          company_type,
          gstin,
          contact_number,
          email,
          hashedPassword,
          address,
          pincode,
        ]
      );

      // ✅ Send email with both email and password
      await sendEmail(email, password, "Your Vendor Account Details");

      // ✅ Respond with success
      res
        .status(201)
        .json({
          message: "Vendor added successfully",
          vendor: newVendor.rows[0],
        });
    } catch (error) {
      console.error("Error adding vendor:", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
];

// ........................................Update Vendor...........................................//


exports.updateVendor = [
  verifyToken,
  async (req, res) => {
    const { id } = req.params;
    const {
      name,
      company_name,
      company_type,
      gstin,
      contact_number,
      email,
      address,
      pincode,
      password,
    } = req.body;

    try {
      // Only vendor Admin can update vendors
      if (req.user.role !== "vendor") {
        return res.status(403).json({
          message: "Unauthorized: Only Vendor Admins can update vendors",
        });
      }

      // Check if the vendor exists
      const vendorExists = await pool.query(
        "SELECT id FROM vendors WHERE id = $1",
        [id]
      );

      if (vendorExists.rows.length === 0) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      let hashedPassword = null;

      // If password is provided, hash it
      if (password) {
        const saltRounds = 10;
        hashedPassword = await bcrypt.hash(password, saltRounds);
      }

      // Update the vendor details in the database
      const updatedVendor = await pool.query(
        `UPDATE vendors
           SET name = $1,
               company_name = $2,
               company_type = $3,
               gstin = $4,
               contact_number = $5,
               email = $6,
               address = $7,
               pincode = $8
               ${password ? ", password = $9" : ""}
           WHERE id = $${password ? 10 : 9}
           RETURNING id, name, company_name, email, company_type`,
        password
          ? [
              name,
              company_name,
              company_type,
              gstin,
              contact_number,
              email,
              address,
              pincode,
              hashedPassword,
              id,
            ]
          : [
              name,
              company_name,
              company_type,
              gstin,
              contact_number,
              email,
              address,
              pincode,
              id,
            ]
      );

      // If password was updated, send an email with the updated details
      if (password) {
        await sendEmail(email, password, "Your Vendor Account Updated");
      }

      // Respond with the updated vendor details
      res.status(200).json({
        message: "Vendor updated successfully",
        vendor: updatedVendor.rows[0],
      });
    } catch (error) {
      console.error("Error updating vendor:", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
];

// Endpoint for Vendor Admin to request deactivation
exports.requestVendorDeactivation = [
  verifyToken,
  async (req, res) => {
    const { id } = req.params;

    try {
      // Ensure the user is a Vendor Admin
      if (req.user.role !== "vendor") {
        return res.status(403).json({
          message:
            "Unauthorized: Only Vendor Admins can request vendor deactivation",
        });
      }

      // Check if vendor exists
      const vendorExists = await pool.query(
        "SELECT id, email, name, deactivation_status, is_active FROM vendors WHERE id = $1",
        [id]
      );

      if (vendorExists.rows.length === 0) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      const vendor = vendorExists.rows[0];

      // Check if there's already a pending request or if the vendor is already deactivated
      if (vendor.deactivation_status === "pending_deactivation") {
        return res.status(400).json({
          message: "A deactivation request is already pending for this vendor",
        });
      }

      if (vendor.deactivation_status === "deactivated" || !vendor.is_active) {
        return res.status(400).json({
          message: "Vendor is already deactivated",
        });
      }

      // Submit deactivation request
      await pool.query(
        `UPDATE vendors 
         SET deactivation_status = 'pending_deactivation', 
             deactivation_requested_by = $1, 
             deactivation_requested_at = CURRENT_TIMESTAMP 
         WHERE id = $2`,
        [req.user.id, id] // req.user.id is the Vendor Admin's ID
      );

      res.status(200).json({
        message:
          "Vendor deactivation request submitted successfully. Awaiting Super Admin approval.",
      });
    } catch (error) {
      console.error(
        "Error submitting vendor deactivation request:",
        error.message
      );
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
];


exports.resetVendorStatus = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const vendor = await Vendor.findById(vendorId);

    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    vendor.status = "active";
    await vendor.save();

    res.status(200).json({ message: "Vendor reactivated successfully." });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.requestVendorReactivation = [
  verifyToken,
  async (req, res) => {
    const { id } = req.params;

    try {
      if (req.user.role !== "vendor") {
        return res.status(403).json({
          message: "Unauthorized: Only Vendor Admins can request reactivation",
        });
      }

      const result = await pool.query(
        "SELECT id, deactivation_status, is_active FROM vendors WHERE id = $1",
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      const vendor = result.rows[0];

      if (vendor.deactivation_status === "pending_activation") {
        return res
          .status(400)
          .json({ message: "Activation request is already pending" });
      }

      if (vendor.is_active && vendor.deactivation_status === "active") {
        return res
          .status(400)
          .json({ message: "Vendor is already active" });
      }

      await pool.query(
        `UPDATE vendors 
         SET deactivation_status = 'pending_activation',
             deactivation_requested_by = $1,
             deactivation_requested_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [req.user.id, id]
      );

      res.status(200).json({
        message:
          "Vendor activation request submitted successfully. Awaiting Super Admin approval.",
      });
    } catch (error) {
      console.error("Error in reactivation request:", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
];


exports.getAllVendors = [
  verifyToken,
  async (req, res) => {
    try {
      // Only vendor Admin can fetch vendors
      if (req.user.role !== "vendor") {
        return res.status(403).json({
          message: "Unauthorized: Only vendor Admins can view Vendors",
        });
      }

      // Fetch vendors with their details including is_active
      const result = await pool.query(
        `SELECT 
          id, 
          name, 
          company_name, 
          company_type, 
          gstin, 
          contact_number, 
          email, 
          address, 
          pincode, 
          created_at,
          is_active
        FROM vendors`
      );

      const vendors = result.rows;

      res.status(200).json({
        message: "Vendors fetched successfully",
        vendors,
      });
    } catch (error) {
      console.error("Error fetching vendors:", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
];
