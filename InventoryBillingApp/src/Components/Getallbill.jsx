import React, { useState, useEffect } from "react";
import Base from '../Base/Base.jsx';
import { CircularProgress, Paper,Button,Box,IconButton,Typography} from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { red } from "@mui/material/colors";
import { format } from "date-fns";

const Getallbill = () => {
     const [bills, setBills] = useState([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
  const navigate = useNavigate();
 useEffect(() => {
   if (!localStorage.getItem("token")) {
     navigate("/login", { replace: true });
   }
 }, []);
     useEffect(() => {
       const fetchBills = async () => {
         try {
           const token = localStorage.getItem("token");

           if (!token) {
             throw new Error("Authentication token is missing!");
           }

           const response = await fetch(
             "https://inventorybillingapp-fsof.onrender.com/api/bill/get",
             {
               headers: {
                 "Content-Type": "application/json",
                 "x-auth-token": token,
               },
             }
           );

           const data = await response.json();

           if (response.ok) {
             setBills(data.bills);
             setError(null);
           } else {
             setError(data.error || "Error fetching bills");
           }
         } catch (error) {
           console.error("Error occurred:", error);
           setError("An error occurred while fetching bills");
         } finally {
           setLoading(false);
         }
       };

       fetchBills();
     }, []);

    const handleDownloadPDF = (bill) => {
      const element = document.getElementById("bill-content");

      html2canvas(element).then((canvas) => {
          const pdf = new jsPDF("p", "mm", "a4");
          const imgData = canvas.toDataURL("image/png");
const pdfHeight = (canvas.height * 210) / canvas.width;
pdf.internal.pageSize.setHeight(pdfHeight);
        pdf.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          0,
          0,
          210,
          pdfHeight
        );
        pdf.save(`bill_${bill._id}.pdf`);
      });
    };
    
 const handleDeleteBill = async (billId) => {
   try {
     const token = localStorage.getItem("token");

     const response = await fetch(
       `https://inventorybillingapp-fsof.onrender.com/api/bill/delete/${billId}`,
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
       setBills((prevBills) => prevBills.filter((bill) => bill._id !== billId));
setTimeout(() => {
  window.location.reload();
}, 1000);
       console.log(data.message);
     } else {
       setError(data.error || "Error deleting bill");
     }
   } catch (error) {
     console.error("Error occurred:", error);
     setError("An error occurred while deleting bill");
   }
 };


    return (
      <Base title="Bills">
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && (
          <div>
            {bills.map((bill) => (
              <Paper key={bill._id} id="bill-content">
                <p>Order ID: {bill.order}</p>
                <p>Name: {bill.customer?.name}</p>
                <p>Email: {bill.customer?.email}</p>
                <p>Address: {bill.customer?.address}</p>
                <p>Phone Number: {bill.customer?.phonenumber}</p>
                <ul>
                  {bill.items.map((item) => (
                    <li key={item._id}>
                      Product: {item.product} - Quantity: {item.quantity} -
                      Price: {item.price}
                    </li>
                  ))}
                </ul>
                <p>Total Amount: {bill.totalAmount}</p>
                <p>
                  Date: {format(new Date(bill.date), "yyyy-MM-dd HH:mm:ss")}
                </p>
                <Button onClick={() => handleDownloadPDF(bill)}>
                  Download Bill
                </Button>
                <Box
                  style={{
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "end",
                    height: "100%",
                  }}
                >
                  <IconButton onClick={() => handleDeleteBill(bill._id)}>
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
                  navigate("/addbill");
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

export default Getallbill;