import React, { useState, useEffect } from "react";
import Base from "../Base/Base.jsx";
import { Button,MenuItem,Select,Typography ,Box ,Alert,CircularProgress} from "@mui/material";
import { useNavigate } from "react-router-dom";
const Addbill = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [message, setMessage] = useState("");
  const [bill, setBill] = useState(null);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token is missing!");
        }

        const response = await fetch(
          "https://inventorybillingapp-fsof.onrender.com/api/order/getall",
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setOrders(data.orders);
         
          
        } else {
          console.error("Error fetching orders:", data.error);
        }
      } catch (error) {
        console.error("Error occurred while fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleCreateBill = async () => {
    try {
        setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token is missing!");
      }

      const response = await fetch(
        "https://inventorybillingapp-fsof.onrender.com/api/bill/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify({ orderId: selectedOrderId }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setBill(data.bill);
          setSuccessMessage("Bills created successfully");
      } else {
        setMessage(data.error || "Error creating bill");
        setBill(null);
         setError("");
         setSuccess(true);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setMessage("An error occurred while creating the bill");
      setBill(null);
     
    } finally {
      setLoading(false);
    }
  };

 return (
   <Base>
     <label>Select Order:</label>
     <Select
      
       fullWidth
       value={selectedOrderId}
       onChange={(e) => setSelectedOrderId(e.target.value)}
     >
       <MenuItem value="">
         <em>Select an order</em>
       </MenuItem>
       {orders.map((order) => (
         <MenuItem key={order._id} value={order._id}>
           {order.customer.name} - {order.date}
         </MenuItem>
       ))}
     </Select>

     <Box
       style={{
         display: "flex",
         alignItems: "center",
         justifyContent: "center",
         height: "100%",
       }}
     >
       <Button
         variant="contained"
         style={{ marginTop: "20px" }}
         onClick={handleCreateBill}
         sx={{ backgroundColor: "#ec407a" }}
       >
         Create Bill
       </Button>
       <Button
         variant="contained"
         onClick={() => navigate("/getbills")}
         style={{ marginTop: "20px", marginLeft: "20px" }}
         sx={{ backgroundColor: "#ec407a" }}
       >
         Go Back
       </Button>
     </Box>

     {loading && <CircularProgress />}
     {error && <Alert severity="error">{error}</Alert>}
     {successMessage && (
       <Alert severity="success" style={{ marginTop: "20px" }}>
         {successMessage}
       </Alert>
     )}

     {bill && (
       <div>
         <Typography>Bill ID: {bill._id}</Typography>
         <Typography>Order ID: {bill.order}</Typography>
         <Typography>Customer Name: {bill.customer?.name}</Typography>
         <Typography>Email: {bill.customer?.email}</Typography>
         <Typography>Address: {bill.customer?.address}</Typography>
         <Typography>Phone Number: {bill.customer?.phonenumber}</Typography>
         {bill.items.map((item) => (
           <div key={item._id}>
             <Typography>Item: {item.name}</Typography>
             <Typography>Quantity: {item.quantity}</Typography>
             <Typography>Price: {item.price}</Typography>
           </div>
         ))}
         <Typography>Total Amount: {bill.totalAmount}</Typography>
         <Typography>Date: {bill.date}</Typography>
       </div>
     )}
   </Base>
 );
  
};

export default Addbill;
