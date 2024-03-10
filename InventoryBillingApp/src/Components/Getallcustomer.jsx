import React, { useState, useEffect } from "react";
import {
  Typography,
  CircularProgress,
  Paper,
  Box,
  IconButton,
} from "@mui/material";
import Base from "../Base/Base.jsx";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { red } from "@mui/material/colors";
import { format } from "date-fns";

const Getallcustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true });
    }
  }, []);

 useEffect(() => {
   const fetchCustomers = async () => {
     try {
       const token = localStorage.getItem("token");
       if (!token) {
         throw new Error("Authentication token is missing!");
       }

       const response = await fetch(
         "https://inventorybillingapp-fsof.onrender.com/api/customer/getallcustomers",
         {
           headers: {
             "x-auth-token": token,
           },
         }
       );
       const data = await response.json();

       if (response.ok) {
         setCustomers(data.data);
         console.log("Customers Data:", data);
         setError(null);
       } else {
         setError(data.error || "Error fetching customers");
       }
     } catch (error) {
       console.error("Error occurred:", error.message);
       setError("An error occurred while fetching customers");
     } finally {
       setLoading(false);
   
     }
   };

   fetchCustomers();
 },[]);

  
    
const handleDelete = async (customerId) => {
  try {
     const token = localStorage.getItem("token");
    const response = await fetch(
      `https://inventorybillingapp-fsof.onrender.com/api/customer/delete/${customerId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      setCustomers((prevCustomers) =>
        prevCustomers.filter((customer) => customer._id !== customerId)
      );

      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);
      console.log(data.message);
    } else {
      setError(data.error || "Error deleting inventory");
    }
  } catch (error) {
    console.error("Error occurred:", error);
    setError("An error occurred while deleting inventory");
  }
};
  
  return (
    <Base title=" Customers">
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      {!loading && (
        <div>
          {customers.map((customer) => (
            <Paper key={customer._id}>
              <p>Name: {customer.name}</p>
              <p>Email: {customer.email}</p>
              <p>Address: {customer.address}</p>
              <p>Phone Number: {customer.phoneNumber}</p>
              <p>Date: {format(new Date(customer.date), "yyyy-MM-dd HH:mm:ss")}</p>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "end",
                  justifyContent: "end",
                  height: "100%",
                }}
              >
                <IconButton
                  onClick={() => handleDelete(customer.id || customer._id)}
                >
                  <DeleteIcon sx={{ color: red[500], fontSize: 38 }} />
                </IconButton>
              </Box>
            </Paper>
          ))}
          <Box
            style={{
              display: "flex",
              alignItems: "end",
              justifyContent: "end",
              height: "100%",
            }}
          >
            {" "}
            <IconButton
              onClick={() => {
                navigate("/addcustomer");
              }}
            >
              <AddCircleIcon color="success" sx={{ fontSize: 40 }} />
            </IconButton>
          </Box>
        </div>
      )}
    </Base>
  );
};

export default Getallcustomer;
