import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { Close } from "@mui/icons-material";

export default function UserEdit(props) {
  const {
    open,
    onClose,
    onClick,
    onSubmit,
    loading,
    roles,
    user,
    setUser,
    errors,
    isUpdate,
  } = props;

  const handleFieldChange = (fieldName, value) => {
    // Create a copy of the user object and update the specified field
    const updatedUser = { ...user, [fieldName]: value };
    // Update the user object with the updated value
    setUser(updatedUser);
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleCheckboxChange = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {!loading && (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
          <DialogTitle>
            {isUpdate ? "Edit User" : "New User"}
            <IconButton onClick={onClick} style={{ float: "right" }}>
              <Close color="primary"></Close>
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {errors && (
              <Box>
                {Object.keys(errors).map((key) => (
                  <Alert severity="error" key={key}>
                    {errors[key][0]}
                  </Alert>
                ))}
              </Box>
            )}
            <form onSubmit={(e) => onSubmit(e)}>
              <Stack spacing={2} margin={2}>
                {!isUpdate && (
                  <FormControl>
                    <InputLabel>Role</InputLabel>
                    <Select
                      label="Role"
                      value={user.role_id || 1}
                      onChange={(ev) =>
                        handleFieldChange("role_id", ev.target.value)
                      }
                      disabled
                    >
                      {roles.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.role}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                <TextField
                  variant="outlined"
                  id="Email"
                  label="Email"
                  type="email"
                  value={user.email || ""}
                  onChange={(ev) => handleFieldChange("email", ev.target.value)}
                  required
                />
                <TextField
                  variant="outlined"
                  id="Password"
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  value={user.password || ""}
                  onChange={(ev) =>
                    handleFieldChange("password", ev.target.value)
                  }
                  required={!isUpdate}
                />
                <TextField
                  variant="outlined"
                  id="Password Confirmation"
                  label="Password Confirmation"
                  type={showPassword ? "text" : "password"}
                  value={user.password_confirmation || ""}
                  onChange={(ev) =>
                    handleFieldChange("password_confirmation", ev.target.value)
                  }
                  required={!isUpdate}
                  placeholder="Retype Change Password"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showPassword}
                      onChange={handleCheckboxChange}
                      color="primary"
                    />
                  }
                  label="Show Password"
                />
                <Button color="primary" variant="contained" type="submit">
                  Save
                </Button>
              </Stack>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
