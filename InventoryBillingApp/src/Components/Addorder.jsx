import React, { useState, useEffect } from "react";
import Base from "../Base/Base.jsx";
import { useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField, Button ,Box} from "@mui/material";

const AddOrder = () => {
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const customersResponse = await fetch(
          "http://localhost:8000/api/customer/getallcustomers",
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
          }
        );

        const customersData = await customersResponse.json();

        if (!customersResponse.ok) {
          console.error(
            "Error fetching customers:",
            customersData.error || "Unknown error"
          );
          return;
        }

        setCustomers(customersData.data || []);

        const itemsResponse = await fetch(
          "http://localhost:8000/api/inventory/getall",
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
          }
        );

        const itemsData = await itemsResponse.json();

        if (!itemsResponse.ok) {
          console.error(
            "Error fetching items:",
            itemsData.error || "Unknown error"
          );
          return;
        }

        console.log("Items Data:", itemsData);

        setItems(itemsData.inventoryItems || []);
      } catch (error) {
        console.error("Error fetching customers and items:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddOrder = async () => {
    try {
      if (!selectedCustomer || selectedItems.length === 0) {
        console.error("Please select a customer and at least one item.");
        return;
      }

      const orderItems = selectedItems.map((item) => ({
        item: item._id,
        quantity: quantities[item._id] || 1,
      }));

      const orderData = {
        customer: selectedCustomer._id,
        items: orderItems,
      };

      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/order/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Order placed successfully:", data);
        navigate("/getorders");
      } else {
        console.error("Error placing order:", data.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error occurred while adding order:", error);
    }
    
    };
    

    

  return (
    <Base title="Add Order">
      <div>
        <label>Select Customer:</label>
        <Autocomplete
          options={customers}
          getOptionLabel={(customer) => customer.name}
          onChange={(_, value) => setSelectedCustomer(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select a customer"
              
            />
          )}
        />
      </div>
      <br></br>
      <div>
        <label>Select Items:</label>
        <Autocomplete
          multiple
          options={items}
          getOptionLabel={(item) => item.name}
          onChange={(_, value) => setSelectedItems(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select items"
            
            />
          )}
        />
      </div>
      <br></br>
      <div>
    <label>Enter Quantities:</label>
        {selectedItems.map((item) => (
          <input
            key={item._id}
            type="number"
            value={quantities[item._id] || ""}
            onChange={(e) =>
              setQuantities({ ...quantities, [item._id]: e.target.value })
            }
          />
        ))}
      </div>
      <br></br>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "20px" }}
          onClick={handleAddOrder}
          sx={{ backgroundColor: "#ec407a" }}
        >
          Add Order
        </Button>
      </Box>
    </Base>
  );
};

export default AddOrder;
