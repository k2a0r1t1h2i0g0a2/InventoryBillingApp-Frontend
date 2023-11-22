import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Button,  
} from "@mui/material";
import Base from "../Base/Base.jsx";
import { Box } from "@mui/material";




const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  
  

  const handleChange = (e) => {
    setCategoryData({
      ...categoryData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      if (id) {
        const response = await fetch(
          `https://inventorybillingapp-fsof.onrender.com/api/category/edit/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(categoryData),
          }
        );

        if (response.ok) {
          const updatedCategory = await response.json();
          setSuccessMessage("Category updated successfully",updatedCategory);
          navigate("/getcategories");
        } else {
          console.error("Failed to update category:", response.statusText);
          setErrorMessage("Failed to update category");
        }
      } else {
        console.error("Invalid category ID");
        setErrorMessage("Invalid category ID");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setErrorMessage("Error occurred");
    }
  };

  return (
    <Base title="Edit Category">
     
      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        margin="normal"
        name="name"
        value={categoryData.name}
        onChange={handleChange}
      />
      <br />
      <label>
        <TextField
          name="description"
          value={categoryData.description}
          onChange={handleChange}
          minRows={3}
          fullWidth
          label="Description"
        />
      </label>
      <br />{" "}
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Button
          sx={{ backgroundColor: "#ec407a" }}
          variant="contained"
          color="primary"
          style={{ marginTop: "20px" }}
          onClick={handleUpdate}
        >
          Update
        </Button>
        {successMessage && (
          <div style={{ color: "green" }}>{successMessage}</div>
        )}
        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      </Box>{" "}
    
    </Base>
  );
};

export default EditCategory;
