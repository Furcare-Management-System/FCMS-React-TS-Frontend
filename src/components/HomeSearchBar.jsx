import React, { useState } from "react";
import {
  Box,
  Button,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { Clear, Search } from "@mui/icons-material";
import axiosClient from "../axios-client";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export const HomeSearchBar = (props) => {
  const {
    searchwhat,
    placeholder,
    navigatetype,
    query,
    setQuery,
    data,
    setData,
    message,
    setMessage,
    loading,
    setLoading,
    search,
  } = props;
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    event.preventDefault();
    setQuery(event.target.value);
  };

  const handleClick = () => {
    search(query);
  };

  const handleClearClick = () => {
    setQuery("");
    setMessage(null);
    setData([]);
    setLoading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      search(query);
    }
  };

  return (
    <div
      style={{
        alignItems: "center",
        height: "30%",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <TextField
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          fullWidth
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {query && ( // Show clear icon only when query is not empty
                  <Clear
                    onClick={handleClearClick}
                    style={{ cursor: "pointer" }}
                  />
                )}
              </InputAdornment>
            ),
            sx: { backgroundColor: "white" },
          }}
        />
        <Button
          variant="contained"
          onClick={handleClick}
          sx={{ marginLeft: "10px" }}
        >
          Search
        </Button>
      </Box>
      {query && (
        <Box
          p={2}
          sx={{
            maxHeight: "120px",
            backgroundColor: "white",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          }}
          overflow="auto"
        >
          {loading && <span>searching...</span>}
          {data.map((item) => (
            <MenuItem
              key={item.id}
              value={item.id}
              onClick={() => navigate(`${navigatetype}/${item.id}/view`)}
            >
              {searchwhat === "petowners"
                ? `${item.firstname} ${item.lastname}`
                : null}
              {searchwhat === "pets" ? item.name : null}
            </MenuItem>
          ))}
          {message && <span>{message}</span>}
        </Box>
      )}
    </div>
  );
};
