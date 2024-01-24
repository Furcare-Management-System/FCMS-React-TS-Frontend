import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Typography } from "@mui/material";

export default function DropDownButtons(props) {
  const {
    title,
    optionLabel1,
    optionLabel2,
    optionLabel3,
    optionLabel4,
    optionLabel5,
    handleCloseMenu,
    anchorEl,
    handleMenuItemClick,
    handleOpenMenu,
    vets,
    status,
  } = props;

  return (
    <>
      {status && (
        <div>
          <Button
            aria-controls="button-menu"
            aria-haspopup="true"
            onClick={handleOpenMenu}
            endIcon={<ArrowDropDownIcon />}
          >
            <Typography variant="body2">{title}</Typography>
          </Button>
          <Menu
            id="button-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={() => handleMenuItemClick(optionLabel1)}>
              {optionLabel1}
            </MenuItem>
            {optionLabel2 && (
              <MenuItem onClick={() => handleMenuItemClick(optionLabel2)}>
                {optionLabel2}
              </MenuItem>
            )}
            {optionLabel3 && (
              <MenuItem onClick={() => handleMenuItemClick(optionLabel3)}>
                {optionLabel3}
              </MenuItem>
            )}
            {optionLabel4 && (
              <MenuItem onClick={() => handleMenuItemClick(optionLabel4)}>
                {optionLabel4}
              </MenuItem>
            )}
            {optionLabel5 && (
              <MenuItem onClick={() => handleMenuItemClick(optionLabel5)}>
                {optionLabel5}
              </MenuItem>
            )}
          </Menu>{" "}
        </div>
      )}
      
      {vets && (
        <div>
          <Button
            aria-controls="button-menu"
            aria-haspopup="true"
            onClick={handleOpenMenu}
            endIcon={<ArrowDropDownIcon />}
          >
            <Typography variant="body2">{title}</Typography>
          </Button>
          <Menu
            id="button-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            {vets.map((item) => (
              <MenuItem key={item.id} value={item.id} onClick={() => handleMenuItemClick(item.id)}>
                {item.fullname}
              </MenuItem>
            ))}
          </Menu>
        </div>
      )}
    </>
  );
}
