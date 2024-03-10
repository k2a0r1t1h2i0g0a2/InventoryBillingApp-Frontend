import React, { useState, useEffect } from "react";
import Base from "../Base/Base.jsx";
import {
  Typography,
  CircularProgress,
  IconButton,Paper,Box
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { red } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { format } from "date-fns";

const Getallinventory = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
 useEffect(() => {
   if (!localStorage.getItem("token")) {
     navigate("/login", { replace: true });
   }
 }, []);
  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await fetch(
          "https://inventorybillingapp-fsof.onrender.com/api/inventory/getall"
        );
        const data = await response.json();

        if (response.ok) {
          setInventoryItems(data.inventoryItems);
          setError(null);
        } else {
          setError(data.error || "Error fetching inventory items");
        }
      } catch (error) {
        console.error("Error occurred:", error);
        setError("An error occurred while fetching inventory items");
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryItems();
  }, []);


  
const handleDelete = async (inventoryId) => {
  try {
    const response = await fetch(
      `https://inventorybillingapp-fsof.onrender.com/api/inventory/delete/${inventoryId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      setInventoryItems((prevInventories) =>
        prevInventories.filter((inventory) => inventory.id !== inventoryId)
      );

      
       //  window.location.reload();
     
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
    <Base title="All Inventory Items">
      {loading && (
        <CircularProgress style={{ margin: "20px auto", display: "block" }} />
      )}
      {error && (
        <Typography
          variant="h6"
          color="error"
          style={{ margin: "20px auto", textAlign: "center" }}
        >
          {error}
        </Typography>
      )}
      {!loading && !error && (
        <div>
          {inventoryItems.map((item, index) => (
            <Paper elevation={6} key={index}>
              <p>Name:{item.name}</p>
              <p>Description:{item.description}</p>
              <p>Price:{item.price}</p>
              <p>Quantity:{item.quantity}</p>
              <p>Date: {format(new Date(item.date), "yyyy-MM-dd HH:mm:ss")}</p>
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
                    const inventoryId = item.id || item._id;
                    navigate(`/editinventory/${inventoryId}`);
                  }}
                >
                  <EditIcon color="success" sx={{ fontSize: 38 }} />
                </IconButton>{" "}
                <IconButton onClick={() => handleDelete(item.id || item._id)}>
                  <DeleteIcon sx={{ color: red[500], fontSize: 38 }} />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </div>
      )}
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
            navigate("/addinventory");
          }}
        >
          <AddCircleIcon color="success" sx={{ fontSize: 40 }} />
        </IconButton>
      </Box>
    </Base>
  );
};

export default Getallinventory;
