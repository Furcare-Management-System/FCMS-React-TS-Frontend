import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Typography } from "@mui/material";
import capitalizeFirstLetter from "../utilities/capitalizeFirstLetter";

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
              {capitalizeFirstLetter(optionLabel1)}
            </MenuItem>
            {optionLabel2 && (
              <MenuItem onClick={() => handleMenuItemClick(optionLabel2)}>
                {capitalizeFirstLetter(optionLabel2)}
              </MenuItem>
            )}
            {optionLabel3 && (
              <MenuItem onClick={() => handleMenuItemClick(optionLabel3)}>
                {capitalizeFirstLetter(optionLabel3)}
              </MenuItem>
            )}
            {optionLabel4 && (
              <MenuItem onClick={() => handleMenuItemClick(optionLabel4)}>
                {capitalizeFirstLetter(optionLabel4)}
              </MenuItem>
            )}
            {optionLabel5 && (
              <MenuItem onClick={() => handleMenuItemClick(optionLabel5)}>
                {capitalizeFirstLetter(optionLabel5)}
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
              <MenuItem
                key={item.id}
                value={item.id}
                onClick={() => handleMenuItemClick(item.id, item)}
              >
                {item.fullname}
              </MenuItem>
            ))}
          </Menu>
        </div>
      )}
    </>
  );
}
