import React, { useEffect, useState } from "react";
import Base from "../Base/Base.jsx";
import {  IconButton, Paper } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { red} from "@mui/material/colors";
import { format } from "date-fns";

const Getallcategory = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate()
   useEffect(() => {
     if (!localStorage.getItem("token")) {
       navigate("/login", { replace: true });
     }
   }, []);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://inventorybillingapp-fsof.onrender.com/api/category/getall"
        );
        const data = await response.json();

        if (response.ok) {
          setCategories(data.categories);
        } else {
          setError(data.error || "Error fetching categories");
        }
      } catch (error) {
        console.error("Error occurred:", error);
        setError("An error occurred while fetching categories");
      }
    };

    fetchCategories();
  }, []);

const handleDelete = async (categoryId) => {
  try {
    const response = await fetch(
      `https://inventorybillingapp-fsof.onrender.com/api/category/delete/${categoryId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
     
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== categoryId)
      );
          

        
         
           window.location.reload();
       
      console.log(data.message); 
    } else {
      setError(data.error || "Error deleting category");
    }
  } catch (error) {
    console.error("Error occurred:", error);
    setError("An error occurred while deleting category");
  }
};
  



    return (
      <Base title="Categories">
        {categories && (
          <div>
            {categories?.map((data, index) => (
              <Paper elevation={6} key={index}>
                <p> Name:{data.name}</p>
                <p> Description:{data.description}</p>
                <p>
                  Date: {format(new Date(data.date), "yyyy-MM-dd HH:mm:ss")}
                </p>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "end",
                    height: "100%",
                  }}
                >
                  <IconButton
                    onClick={() => {
                      const categoryId = data.id || data._id;
                      navigate(`/editcategory/${categoryId}`);
                    }}
                  >
                    <EditIcon color="success" sx={{ fontSize: 38 }} />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(data.id || data._id)}>
                    <DeleteIcon sx={{ color: red[500], fontSize: 38 }} />
                  </IconButton>
                </Box>
              </Paper>
            ))}
          </div>
        )}{" "}
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
              navigate("/addcategory");
            }}
          >
            <AddCircleIcon color="success" sx={{ fontSize: 40 }} />
          </IconButton>
        </Box>
      </Base>
    );
  };

export default Getallcategory;
