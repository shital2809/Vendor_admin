
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "../Dashboard/Header";
import { Sidebar } from "../Dashboard/Sidebar";

export const CreateUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    company_name: "",
    company_type: "",
    gstin: "",
    contact_number: "",
    email: "",
    password: "",
    address: "",
    pincode: "",
    role: "",
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Check if editing an existing user (passed via state)
  useEffect(() => {
    const state = location.state;
    if (state?.user) {
      setEditingUserId(state.user.id);
      setFormData({
        name: state.user.name || "",
        company_name: state.user.company_name || "",
        company_type: state.user.company_type || "",
        gstin: state.user.gstin || "",
        contact_number: state.user.contact_number || "",
        email: state.user.email || "",
        password: "",
        address: state.user.address || "",
        pincode: state.user.pincode || "",
        role: state.user.role || "",
      });
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    const requiredFields = [
      "name", "email", "company_name", "company_type", "gstin",
      "contact_number", "address", "pincode"
    ];

    if (!editingUserId) {
      requiredFields.push("password");
    }

    const emptyFields = requiredFields.filter((key) => !formData[key]);

    if (emptyFields.length > 0) {
      alert(`Please fill all required fields: ${emptyFields.join(", ")}`);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const url = editingUserId
        ? `http://localhost:5000/api/auth/update-vendor/${editingUserId}`
        : "http://localhost:5000/api/auth/addVendor";

      const method = editingUserId ? "PUT" : "POST";
      const requestData = { ...formData };

      if (editingUserId && !formData.password) {
        delete requestData.password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(editingUserId ? "Vendor updated successfully!" : "Vendor created successfully!");
        navigate("/user"); // Navigate back to User page after saving
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className={`flex flex-col w-full transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className="p-6">
          <div className="bg-white p-6 rounded-lg shadow-md w-full">
            <h2 className="text-lg font-bold mb-6 text-center">
              {editingUserId ? "Edit Admin" : "Create Vendor Admin"}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter Name"
                  className="w-full p-2 border rounded bg-white"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter Email"
                  className="w-full p-2 border rounded bg-white"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  {editingUserId ? "New Password (optional)" : "Password"}
                </label>
                <input
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={editingUserId ? "Enter New Password" : "Enter Password"}
                  className="w-full p-2 border rounded bg-white"
                />
              </div>
              <div>
                <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  placeholder="Enter Company Name"
                  className="w-full p-2 border rounded bg-white"
                />
              </div>
              <div>
                <label htmlFor="company_type" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Type
                </label>
                <select
                  id="company_type"
                  name="company_type"
                  value={formData.company_type}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded bg-white"
                >
                  <option value="">Select Type</option>
                  <option value="LLP">LLP</option>
                  <option value="PVT">PVT</option>
                  <option value="OPC">OPC</option>
                  <option value="PROP">PROP</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>
              <div>
                <label htmlFor="contact_number" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  id="contact_number"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleInputChange}
                  placeholder="Enter Contact Number"
                  className="w-full p-2 border rounded bg-white"
                />
              </div>
              <div>
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode
                </label>
                <input
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="Enter Pincode"
                  className="w-full p-2 border rounded bg-white"
                />
              </div>
              <div>
                <label htmlFor="gstin" className="block text-sm font-medium text-gray-700 mb-1">
                  GSTIN
                </label>
                <input
                  id="gstin"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleInputChange}
                  placeholder="Enter GSTIN"
                  className="w-full p-2 border rounded bg-white"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter Address"
                  className="w-full p-2 border rounded bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
                {editingUserId ? "Update" : "Create"}
              </button>
              <button onClick={() => navigate("/user")} className="bg-gray-500 text-white px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
  );
};

export default CreateUser;