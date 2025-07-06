
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Sidebar } from "../Dashboard/Sidebar";
// import { Header } from "../Dashboard/Header";
// import { DashboardCards } from "./DashboardCards";
// import { Pencil, Ban, RotateCw } from "lucide-react";

// export const User = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [usersData, setUsersData] = useState([]);
//   const [activeVendorCount, setActiveVendorCount] = useState(0);
//   const navigate = useNavigate();

//   const fetchVendors = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch("https://vendor-admin-ull7.onrender.com/api/auth/getAllVendors", {
//         method: "GET",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await response.json();

//       if (response.ok) {
//         const sortedVendors = [...(data.vendors || [])].reverse();
//         setUsersData(sortedVendors);

//         const activeCount = sortedVendors.filter((vendor) => vendor.is_active).length;
//         setActiveVendorCount(activeCount);
//       } else {
//         alert(`Error: ${data.message}`);
//       }
//     } catch (error) {
//       console.error("Fetch error:", error);
//       alert("An error occurred while fetching vendors.");
//     }
//   };

//   useEffect(() => {
//     fetchVendors();
//   }, []);

//   const handleEdit = (user) => {
//     navigate("/create-user", { state: { user } });
//   };

//   const handleDeactivate = async (id) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`https://vendor-admin-ull7.onrender.com/api/auth/vendors/${id}/deactivate`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await response.json();

//       if (response.ok) {
//         alert("Vendor deactivation request sent!");
//         fetchVendors();
//       } else {
//         alert(`Error: ${data.message}`);
//       }
//     } catch (error) {
//       alert("An error occurred. Please try again.");
//     }
//   };

//   const handleRequestReactivation = async (id) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`https://vendor-admin-ull7.onrender.com/api/auth/vendors/${id}/activate`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await response.json();

//       if (response.ok) {
//         alert("Vendor reactivation request sent successfully!");
//         fetchVendors();
//       } else {
//         alert(`Error: ${data.message}`);
//       }
//     } catch (error) {
//       alert("An error occurred while sending reactivation request.");
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
//       <div className={`flex flex-col w-full transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
//         <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
//         <div className="p-6">
//           <DashboardCards activeVendorCount={activeVendorCount} />
//         </div>

//         <div className="bg-gray-100 min-h-screen p-4">
//           <div className="bg-white p-4 rounded-lg shadow-md w-full overflow-x-auto">
//             <div className="flex flex-col md:flex-row justify-between items-center mb-4">
//               <h1 className="text-xl font-semibold mb-2 md:mb-0">Manage People</h1>
//               <button
//                 className="border border-gray-300 rounded px-3 py-1 bg-blue-500 text-white text-sm"
//                 onClick={() => navigate("/create-user")}
//               >
//                 Create
//               </button>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full text-sm border-collapse">
//                 <thead>
//                   <tr className="bg-gray-200 text-left">
//                     <th className="px-3 py-2 pl-6">Sr No</th>
//                     <th className="px-3 py-2">Name</th>
//                     <th className="px-2 py-2">Email</th>
//                     <th className="px-2 py-2">Status</th>
//                     <th className="px-3 py-2 text-right">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(usersData || []).map((user, index) => (
//                     <tr key={user.id || index} className="border-b hover:bg-gray-50">
//                       <td className="px-3 py-2 pl-6">{index + 1}</td>
//                       <td className="px-3 py-2">{user.name}</td>
//                       <td className="px-2 py-2">{user.email}</td>
//                       <td className="px-2 py-2">
//                         <span
//                           className={`px-2 py-1 rounded text-xs font-semibold ${
//                             user.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
//                           }`}
//                         >
//                           {user.is_active ? "Active" : "Inactive"}
//                         </span>
//                       </td>
//                       <td className="px-3 py-2 text-right">
//                         <button
//                           className="p-1.5 bg-yellow-500 text-white rounded m-1"
//                           onClick={() => handleEdit(user)}
//                           title="Edit"
//                         >
//                           <Pencil size={16} />
//                         </button>

//                         {user.is_active ? (
//                           <button
//                             className="p-1.5 bg-red-500 text-white rounded m-1"
//                             onClick={() => handleDeactivate(user.id)}
//                             title="Request Deactivation"
//                           >
//                             <Ban size={16} />
//                           </button>
//                         ) : (
//                           <button
//                             className="p-1.5 bg-blue-600 text-white rounded"
//                             onClick={() => handleRequestReactivation(user.id)}
//                             title="Request Reactivation"
//                           >
//                             <RotateCw size={16} />
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                   {usersData.length === 0 && (
//                     <tr>
//                       <td colSpan="5" className="text-center py-4 text-gray-500">
//                         No users found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default User;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../Dashboard/Sidebar";
import { Header } from "../Dashboard/Header";
import { Pencil, Ban, RotateCw } from "lucide-react";

export const User = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [usersData, setUsersData] = useState([]);
  const navigate = useNavigate();

  const fetchVendors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://vendor-admin-ull7.onrender.com/api/auth/getAllVendors", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        const sortedVendors = [...(data.vendors || [])].reverse();
        setUsersData(sortedVendors);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("An error occurred while fetching vendors.");
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleEdit = (user) => {
    navigate("/create-user", { state: { user } });
  };

  const handleDeactivate = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://vendor-admin-ull7.onrender.com/api/auth/vendors/${id}/deactivate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        alert("Vendor deactivation request sent!");
        fetchVendors();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  const handleRequestReactivation = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://vendor-admin-ull7.onrender.com/api/auth/vendors/${id}/activate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        alert("Vendor reactivation request sent successfully!");
        fetchVendors();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert("An error occurred while sending reactivation request.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className={`flex flex-col w-full transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        <div className="bg-gray-100 min-h-screen p-4">
          <div className="bg-white p-4 rounded-lg shadow-md w-full overflow-x-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
              <h1 className="text-xl font-semibold mb-2 md:mb-0">Manage People</h1>
              <button
                className="border border-gray-300 rounded px-3 py-1 bg-blue-500 text-white text-sm"
                onClick={() => navigate("/create-user")}
              >
                Create
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="px-3 py-2 pl-6">Sr No</th>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-2 py-2">Email</th>
                    <th className="px-2 py-2">Status</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(usersData || []).map((user, index) => (
                    <tr key={user.id || index} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-2 pl-6">{index + 1}</td>
                      <td className="px-3 py-2">{user.name}</td>
                      <td className="px-2 py-2">{user.email}</td>
                      <td className="px-2 py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            user.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            className="w-9 h-9 flex items-center justify-center bg-yellow-500 text-white rounded"
                            onClick={() => handleEdit(user)}
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>

                          {user.is_active ? (
                            <button
                              className="w-9 h-9 flex items-center justify-center bg-red-500 text-white rounded"
                              onClick={() => handleDeactivate(user.id)}
                              title="Request Deactivation"
                            >
                              <Ban size={16} />
                            </button>
                          ) : (
                            <button
                              className="w-9 h-9 flex items-center justify-center bg-blue-600 text-white rounded"
                              onClick={() => handleRequestReactivation(user.id)}
                              title="Request Reactivation"
                            >
                              <RotateCw size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {usersData.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-gray-500">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
