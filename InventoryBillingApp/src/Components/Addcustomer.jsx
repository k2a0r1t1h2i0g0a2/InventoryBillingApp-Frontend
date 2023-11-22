import React, { useState } from "react";
import Base from "../Base/Base.jsx";
import { TextField, Button, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

const AddCustomer = () => {
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    address: "",
    phoneNumber: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleAddCustomer = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return setErrorMessage("Authentication token is missing!");
      }

      const response = await fetch("http://localhost:8000/api/customer/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(customerData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        setErrorMessage("");
        navigate("/getcustomers");
       
      } else {
         const errorData = await response.json().catch(() => ({}));
         setSuccessMessage("");
         setErrorMessage(
           response.statusText || errorData.error || "Error adding customer"
         );
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setSuccessMessage("");
      setErrorMessage("An error occurred while adding customer");
    }
  };

  return (
    <Base title="Add Customer">
      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={customerData.name}
        onChange={(e) =>
          setCustomerData({ ...customerData, name: e.target.value })
        }
      />
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={customerData.email}
        onChange={(e) =>
          setCustomerData({ ...customerData, email: e.target.value })
        }
      />
      <TextField
        label="Address"
        variant="outlined"
        fullWidth
        margin="normal"
        value={customerData.address}
        onChange={(e) =>
          setCustomerData({ ...customerData, address: e.target.value })
        }
      />
      <TextField
        label="Phone Number"
        variant="outlined"
        fullWidth
        margin="normal"
        value={customerData.phoneNumber}
        onChange={(e) =>
          setCustomerData({ ...customerData, phoneNumber: e.target.value })
        }
      />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddCustomer}
          style={{ marginTop: "20px" }}
          sx={{ backgroundColor: "#ec407a" }}
        >
          Add Customer
        </Button>
      </Box>
      {successMessage && (
        <Alert severity="success" style={{ marginTop: "20px" }}>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" style={{ marginTop: "20px" }}>
          {errorMessage}
        </Alert>
      )}
    </Base>
  );
};

export default AddCustomer;
