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
import { useAppDispatch,useAppSelector } from "../app/hooks";
import { signupAndSaveProfile } from "../features/auth/authThunks";

export default function Signup() {
  const dispatch = useAppDispatch()
  // Form state
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password visibility
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const togglePass = () => setShowPass((p) => !p);
  const toggleConfirm = () => setShowConfirm((p) => !p);

  // Validation
  const [errors, setErrors] = useState({});
  const [valid, setValid] = useState(false);

  // Password strength
  const getStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 6) score += 30;
    if (/[A-Z]/.test(pwd)) score += 20;
    if (/[a-z]/.test(pwd)) score += 20;
    if (/[0-9]/.test(pwd)) score += 15;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 15;
    return score;
  };

  const strength = getStrength(password);

  const calculateAge = (date) => {
    const today = new Date();
    const birth = new Date(date);
    let a = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--;
    return a;
  };

  // Form validation
  const validate = () => {
    const e = {};

    if (!fullName.trim()) e.fullName = "Full name required";
    if (!username.trim()) e.username = "Username required";

    if (!dob) e.dob = "Date of birth required";

    if (!email.trim()) e.email = "Email required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Invalid email";

    if (!password) e.password = "Password required";
    else if (strength < 50) e.password = "Weak password";

    if (!confirmPassword) e.confirmPassword = "Confirm password";
    else if (password !== confirmPassword)
      e.confirmPassword = "Passwords do not match";

    setErrors(e);
    setValid(Object.keys(e).length === 0);
  };

  useEffect(validate, [
    fullName,
    username,
    dob,
    email,
    password,
    confirmPassword,
  ]);

  // Submit
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!valid) return;

    const payload = {
      fullName,
      username: username.toLowerCase(),
      dob,
      age: calculateAge(dob),
      email,
      password,
    };

    const res = dispatch(signupAndSaveProfile(payload));

    if (res.meta.requestStatus === "fulfilled") {
      alert("Signup successful!");
    } else {
      alert(res.payload || "Signup failed");
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
      <Typography variant="h5" textAlign="center" mb={2}>
        Create Account
      </Typography>

      <form onSubmit={handleSignup}>
        <TextField
          label="Full Name"
          fullWidth
          margin="normal"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={!!errors.fullName}
          helperText={errors.fullName}
        />

        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          error={!!errors.username}
          helperText={errors.username}
        />

        <TextField
          label="Date of Birth"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={dob}
          onChange={(e) => {
            setDob(e.target.value);
            setAge(calculateAge(e.target.value));
          }}
          error={!!errors.dob}
          helperText={errors.dob}
        />

        <TextField
          label="Age"
          fullWidth
          margin="normal"
          value={age}
          InputProps={{ readOnly: true }}
        />

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
        />

        {/* Password */}
        <TextField
          label="Password"
          type={showPass ? "text" : "password"}
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePass}>
                  {showPass ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Strength bar */}
        {password && (
          <>
            <LinearProgress
              variant="determinate"
              value={strength}
              sx={{ my: 1, height: 8, borderRadius: 5 }}
            />
            <Typography variant="caption">
              Strength:{" "}
              {strength < 50 ? "Weak" : strength < 80 ? "Medium" : "Strong"}
            </Typography>
          </>
        )}

        {/* Confirm Password */}
        <TextField
          label="Confirm Password"
          type={showConfirm ? "text" : "password"}
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={toggleConfirm}>
                  {showConfirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2, py: 1.3 }}
          disabled={!valid}
        >
          Create Account
        </Button>
      </form>
    </Box>
  );
}
