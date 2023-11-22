import React, { useState } from "react";
import Base from "../Base/Base.jsx";
import { TextField, InputAdornment, IconButton, Alert } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { Button} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { Box } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
const Signup = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const [successMessage, setSuccessmessage] = useState("");
  const navigate = useNavigate();
  
  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSignup = async () => {
    try {
      const payload = { username, email, password };
      const res = await fetch(
        "https://inventorybillingapp-fsof.onrender.com/api/user/signup",
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
      
      } else if (data.success) {
        setSuccessmessage(data.message);
      } else {
        setErr(data.error);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setErr("An error occurred during sign-up.");
    }
  };

  return (
    <Base title="SignUp">
      <form>
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Stack>
            <Avatar
              alt="User"
              sx={{ width: 100, height: 100 }}
              src="/src/user badge.jpeg"
            />{" "}
          </Stack>
        </Box>
        <TextField
          id="outlined-basic-username"
          label="Username"
          variant="outlined"
          value={username}
          sx={{ mr: 2 }}
          type={showPassword ? "text" : "password"}
          fullWidth
          style={{ marginTop: "20px" }}
          InputProps={{
            autoComplete: "new-password",

            endAdornment: (
              <InputAdornment position="end">
                <PersonIcon style={{ color: "white" }} />
              </InputAdornment>
            ),
          }}
          onChange={(e) => setUserName(e.target.value)}
        />
      </form>
      <br></br>

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
                <EmailIcon style={{ color: "white" }} />
              </InputAdornment>
            ),
          }}
          onChange={(e) => setEmail(e.target.value)}
        />
      </form>
      <br></br>
      <form>
        {" "}
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
                    <VisibilityIcon style={{ color: "white" }} />
                  ) : (
                    <VisibilityOffIcon style={{ color: "white" }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          onChange={(e) => setPassword(e.target.value)}
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
          type="submit"
          variant="contained"
          size="medium"
          style={{ marginTop: "20px" }}
          onClick={handleSignup}
          sx={{ backgroundColor: "#ec407a" }}
        >
          Signup
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

export default Signup;
