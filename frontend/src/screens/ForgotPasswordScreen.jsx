import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Avatar,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import { forgotPass } from "../actions/userActions";

function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const forgotPassword = useSelector(state => state.userForgotPassword);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPass(email));
  };

  return (
    <FormContainer>
      <Box sx={{ textAlign: 'center' }}>
        <Avatar sx={{ m: 'auto', bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={handleEmailChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={forgotPassword.loading}
            >
              {forgotPassword.loading ? 'Sending Email...' : 'Reset Password'}
            </Button>
          </Grid>
          {forgotPassword.error && (
            <Grid item xs={12}>
              <Typography variant="body2" color="error">
                {forgotPassword.error}
              </Typography>
            </Grid>
          )}
          {forgotPassword.message && (
            <Grid item xs={12}>
              <Typography variant="body2" color="success">
                {forgotPassword.message}
              </Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography component={Link} to="/login" variant="body2">
              Back to Sign In
            </Typography>
          </Grid>
        </Grid>
      </form>
    </FormContainer>
  );
}

export default ForgotPasswordScreen;
