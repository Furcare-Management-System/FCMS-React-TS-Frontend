import React from "react";
import { Button, InputAdornment, TextField } from "@mui/material";
import { Clear, Search } from "@mui/icons-material";

export const SearchPetOwner = ({ query, setQuery, search, getPetowners }) => {
  const handleInputChange = (event) => {
    event.preventDefault();
    setQuery(event.target.value);
  };

  const handleClearClick = () => {
    setQuery(''); // Clear the query state
    getPetowners();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      search(query);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <TextField
         placeholder="Search petowner here..."
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
                <Clear onClick={handleClearClick} style={{ cursor: 'pointer' }} />
              )}
            </InputAdornment>
          ),
          sx: { backgroundColor: 'white' }
        }}
      />

      <Button
        variant="contained"
        onClick={() => search(query)}
        sx={{ marginLeft: '10px' }}
      >
        Search
      </Button>
      
    </div>
  );
};
