import React, { useState } from "react";
import Base from "../Base/Base.jsx";
import { TextField, InputAdornment, IconButton, Alert } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { Box } from "@mui/material";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
const [successMessage,setSuccessmessage] = useState("")
  const navigate = useNavigate();
 

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async () => {
    try {
      const payload = { email, password };
      const res = await fetch(
        "https://inventorybillingapp-fsof.onrender.com/api/user/login",
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
  

      if (data.token) {
        setErr("");
        localStorage.setItem("token", data.token);
        navigate("/home");
      } else if (data.success) {
        setSuccessmessage(data.message);
      } else {
        setErr(data.error);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setErr("An error occurred during login.");
    }
  };


  return (
    <Base title="Login">
      <form>
        <TextField
          id="outlined-basic-email"
          label="Email"
          variant="outlined"
          value={email}
          sx={{ mr: 2 }}
          fullWidth
          style={{ marginTop: "20px" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <EmailIcon style={{ color: "#ec407a" }} />
              </InputAdornment>
            ),
          }}
          onChange={(e) => setEmail(e.target.value)}
        />{" "}
      </form>
      <br></br>
      <form>
        <TextField
          id="outlined-basic-password"
          label="Password"
          variant="outlined"
          sx={{ mr: 2 }}
          style={{ marginTop: "20px" }}
          type={showPassword ? "text" : "password"}
          value={password}
          fullWidth
          InputProps={{
            autoComplete: "new-password",
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? (
                    <VisibilityIcon style={{ color: "#ec407a" }} />
                  ) : (
                    <VisibilityOffIcon style={{ color: "#ec407a" }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          onChange={(e) => setPassword(e.target.value)}
        />{" "}
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
          onClick={handleLogin}
        >
          Login
        </Button>

        <Button
          sx={{ backgroundColor: "#ec407a" }}
          variant="contained"
          size="medium"
          style={{ marginTop: "20px", marginLeft: "10px" }}
          onClick={() => navigate("/resetpassword")}
        >
          Forgot Password
        </Button>
      </Box>

      {err ? (
        <Alert severity="error" style={{ marginTop: "20px" }}>
          {err}
        </Alert>
      ) : (
        ""
      )}
      {successMessage && (
        <Alert severity="success" style={{ marginTop: "20px" }}>
          {successMessage}
        </Alert>
      )}
    </Base>
  );
};

export default Login;
