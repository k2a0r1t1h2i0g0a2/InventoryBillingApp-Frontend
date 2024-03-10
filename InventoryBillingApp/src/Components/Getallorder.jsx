import React, { useState, useEffect } from 'react';
import Base from '../Base/Base.jsx';
import { useNavigate } from "react-router-dom";
import { Typography, CircularProgress, Paper, Box, IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { red } from "@mui/material/colors";
import { format } from "date-fns";


const Getallorder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
 useEffect(() => {
   if (!localStorage.getItem("token")) {
     navigate("/login", { replace: true });
   }
 }, []);
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
          setError(null);
        } else {
          setError(data.error || "Error fetching orders");
        }
      } catch (error) {
        console.error("Error occurred:", error);
        setError("An error occurred while fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDeleteOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://inventorybillingapp-fsof.onrender.com/api/order/delete/${orderId}`,
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
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== orderId)
        );

  setTimeout(() => {
    window.location.reload();
  }, 500);

        console.log(data.message);
      } else {
        setError(data.error || "Error deleting order");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setError("An error occurred while deleting order");
    }
  };




  {
    return (
      <Base title="Orders">
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && (
          <div>
            {orders.map((order) => (
              <Paper key={order._id}>
                {order.customer && (
                  <React.Fragment>
                    <p>Customer: {order.customer.name}</p>
                    <p>Email: {order.customer.email}</p>
                    <p>Address: {order.customer.address}</p>
                    <p>Phone Number: {order.customer.phoneNumber}</p>
                    <p>
                      Date: {format(new Date(order.customer.date), "yyyy-MM-dd HH:mm:ss")}
                    </p>
                  </React.Fragment>
                )}

                <ul>
                  {order.items.map((item) => (
                    <li key={item._id}>
                      {item.item && (
                        <React.Fragment>
                          Item: {item.item.name} - Quantity: {item.quantity} -
                          Price: {item.item.price}
                        </React.Fragment>
                      )}
                    </li>
                  ))}
                </ul>

                <p>Total: {order.total}</p>
                <p>Date: {order.date}</p>
                <Box
                  style={{
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "end",
                    height: "100%",
                  }}
                >
                  <IconButton
                    onClick={() => handleDeleteOrder(order.id || order._id)}
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
                  navigate("/addorder");
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
}

export default Getallorder;