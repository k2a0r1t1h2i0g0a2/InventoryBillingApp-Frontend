import React, { useState,useEffect} from "react";
import Base from "../Base/Base.jsx";
import { TextField, Button, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";

const Addinventory = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    


      useEffect(() => {
        const fetchCategories = async () => {
         
          const response = await fetch(
            "https://inventorybillingapp-fsof.onrender.com/api/category/getall"
          );
          const data = await response.json();
          setCategories(data.categories);
        };

        fetchCategories();
      }, []);
  const handleAddInventoryItem = async () => {
    try {
      const response = await fetch(
        "https://inventorybillingapp-fsof.onrender.com/api/inventory/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description,
            price,
            quantity,
            category,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        setErrorMessage("");
        navigate("/getinventories"); 
      } else {
        setSuccessMessage("");
        setErrorMessage(data.error || "Error adding inventory item");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setSuccessMessage("");
      setErrorMessage("An error occurred while adding inventory item");
    }
  };

  return (
    <Base title="Add Inventory Item">
      <TextField
        label="Item Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="Item Description"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        margin="normal"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <TextField
        label="Price"
        variant="outlined"
        fullWidth
        margin="normal"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <TextField
        label="Quantity"
        variant="outlined"
        fullWidth
        margin="normal"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <Autocomplete
        options={categories}
        getOptionLabel={(option) => option.name}
        onChange={(event, newValue) => setCategory(newValue)} 
        renderInput={(params) => (
          <TextField {...params} label="Category" variant="outlined" />
        )}
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
          onClick={handleAddInventoryItem}
          sx={{ backgroundColor: "#ec407a" }}
          style= {{marginTop:"20px"}}
        >
          Add Inventory Item
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

export default Addinventory;
