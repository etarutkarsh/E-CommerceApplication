// src/pages/SignupDetails.jsx
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { saveUserDetails } from "../features/auth/authThunks";

export default function SignupDetails() {
  const dispatch = useDispatch();

  const queryParams = new URLSearchParams(window.location.search);
  const emailFromSignup = queryParams.get("email") || "";
  const uid = queryParams.get("uid"); // IMPORTANT

  if (!uid) console.warn("❗ UID missing in SignupDetails URL");

  // FORM FIELDS
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState(emailFromSignup);
  const [dob, setDob] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // SHOW/HIDE PASSWORD TOGGLES
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  // ERRORS
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // PASSWORD STRENGTH
  const getPasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 6) score += 30;
    if (/[A-Z]/.test(pwd)) score += 20;
    if (/[a-z]/.test(pwd)) score += 20;
    if (/[0-9]/.test(pwd)) score += 15;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 15;
    return score;
  };

  const passwordStrength = getPasswordStrength(password);

  const calculateAge = (dateString) => {
    const today = new Date();
    const birth = new Date(dateString);

    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  // VALIDATION
  const validate = () => {
    let temp = {};

    if (!fullName.trim()) temp.fullName = "Full name is required";
    else if (fullName.length < 3)
      temp.fullName = "Full name must be at least 3 characters";

    if (!username.trim()) temp.username = "Username is required";
    else if (username.includes(" "))
      temp.username = "Username cannot contain spaces";
    else if (!/^[a-zA-Z0-9_]+$/.test(username))
      temp.username = "Only letters, numbers & underscores allowed";

    if (!age) temp.age = "Age is required";
    else if (Number(age) < 10) temp.age = "Minimum age is 10";

    if (!email.trim()) temp.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) temp.email = "Invalid email format";

    if (!dob) temp.dob = "Date of birth is required";

    if (!password.trim()) temp.password = "Password is required";
    else if (passwordStrength < 50) temp.password = "Password is too weak";

    if (!confirmPassword) temp.confirmPassword = "Confirm your password";
    else if (confirmPassword !== password)
      temp.confirmPassword = "Passwords do not match";

    setErrors(temp);
    setIsFormValid(Object.keys(temp).length === 0);
  };

  useEffect(() => {
    validate();
  }, [fullName, username, age, email, dob, password, confirmPassword]);

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const userData = {
      uid,
      fullName,
      username: username.toLowerCase(),
      age,
      email,
      dob,
    };

    const res = await dispatch(saveUserDetails(userData));

    if (res.meta.requestStatus === "fulfilled") {
      window.location.href = "/dashboard";
    } else {
      alert(res.payload || res.error?.message || "Error saving profile");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 450,
        mx: "auto",
        p: 3,
        mt: 4,
        background: "white",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      <Typography variant="h5" fontWeight={700} textAlign="center" mb={2}>
        Create Account
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Full Name"
          margin="normal"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={!!errors.fullName}
          helperText={errors.fullName}
        />

        <TextField
          fullWidth
          label="Username"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          error={!!errors.username}
          helperText={errors.username}
        />

        <TextField
          fullWidth
          label="Date of Birth"
          type="date"
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={dob}
          onChange={(e) => {
            const selectedDate = e.target.value;
            setDob(selectedDate);
            setAge(calculateAge(selectedDate));
          }}
          error={!!errors.dob}
          helperText={errors.dob}
        />

        <TextField
          fullWidth
          label="Age"
          type="number"
          margin="normal"
          value={age}
          InputProps={{ readOnly: true }}
          error={!!errors.age}
          helperText={errors.age}
        />

        <TextField
          fullWidth
          label="Email"
          type="email"
          margin="normal"
          InputProps={{ readOnly: !!emailFromSignup }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
        />

        {/* PASSWORD FIELD */}
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePassword}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* PASSWORD STRENGTH METER */}
        {password && (
          <Box sx={{ my: 1 }}>
            <LinearProgress
              variant="determinate"
              value={passwordStrength}
              sx={{
                height: 8,
                borderRadius: 5,
                "& .MuiLinearProgress-bar": {
                  backgroundColor:
                    passwordStrength < 50
                      ? "red"
                      : passwordStrength < 80
                      ? "orange"
                      : "green",
                },
              }}
            />
            <Typography variant="caption">
              Strength:{" "}
              {passwordStrength < 50
                ? "Weak"
                : passwordStrength < 80
                ? "Medium"
                : "Strong"}
            </Typography>
          </Box>
        )}

        <TextField
          fullWidth
          margin="normal"
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={toggleConfirmPassword}>
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          sx={{
            mt: 2,
            py: 1.3,
            borderRadius: "10px",
          }}
          disabled={!isFormValid}
        >
          Create Account
        </Button>
      </form>
    </Box>
  );
}
