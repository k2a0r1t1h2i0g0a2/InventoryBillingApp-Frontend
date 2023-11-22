import React, { useState } from "react";
import Base from "../Base/Base.jsx";
import { TextField, Button, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
//  import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";
const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // const theme = createTheme({
  //   palette: {
  //     primary: {
  //       main: "#ec407a",
  //     },
  //     secondary: {
  //       main: "#00bfa5",
  //     },
  //   },
  // });

  const handleResetPassword = async () => {
    try {
      const payload = {
        email,
        newpassword: newPassword,
        confirmpassword: confirmPassword,
      };
      const res = await fetch("http://localhost:8000/api/user/resetPassword", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.message) {
          setSuccessMessage(data.message);
         
      } else {
        setErrorMessage(data.error);
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  return (
    <Base title="Reset Password">
      {/* <ThemeProvider theme={theme}> */}
    <form>  <TextField
        id="outlined-basic-email"
        label="Email"
        variant="outlined"
        value={email}
        fullWidth
        style={{ marginTop: "20px" }}
        onChange={(e) => setEmail(e.target.value)}
      /></form>
      <br></br>
      <TextField
        id="outlined-basic-new-password"
        label="New Password"
        variant="outlined"
        style={{ marginTop: "20px" }}
        type="password"
        value={newPassword}
        fullWidth
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <br></br>
      <form>
        <TextField
          id="outlined-basic-confirm-password"
          label="Confirm Password"
          variant="outlined"
          style={{ marginTop: "20px" }}
          type="password"
          value={confirmPassword}
          fullWidth
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </form>
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
          type="submit"
          variant="contained"
          size="medium"
          style={{ marginTop: "20px" }}
          onClick={handleResetPassword}
        >
          Reset Password
        </Button>
        <Button
          sx={{ backgroundColor: "#ec407a" }}
          variant="contained"
          size="medium"
          style={{ marginTop: "20px", marginLeft: "10px" }}
          onClick={() => navigate("/login")}
        >
          Go Back
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
      {/* </ThemeProvider> */}
    </Base>
  );
};

export default ResetPassword;
