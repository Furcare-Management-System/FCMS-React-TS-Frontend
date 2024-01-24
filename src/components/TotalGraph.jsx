import { ArrowCircleRight, Pets } from "@mui/icons-material";
import { Stack, Typography, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function TotalGraph(props) {
  const { total, totaltype, color, icon, link, width } = props;

  const IconComponent = icon || Pets;
  return (
    <>
      <Stack
        padding={2}
        mr={2}
        sx={{
          width: width, // Adjust the width as needed
          height: "90px",
          backgroundColor: color,
          borderRadius: "5px",
        }}
      >
        <Stack
          sx={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center" ,
          }}
        >
          <Box mb={{ xs: 1, md: 0 }}>
            <Typography variant="h6" color="white" fontFamily="sans-serif">
              {totaltype}
            </Typography>
            <Typography
              variant="h5"
              color="white"
              fontWeight="bold"
              fontFamily="monospace"
            >
              {total ? total : 0}
            </Typography>
          </Box>
          <Box
            sx={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <IconComponent
              color="disabled"
              sx={{ width: "30px", height: "30px" }}
            />
            {link && (
              <Typography
                color="white"
                fontSize={{ xs: "12px", md: "15px" }} // Adjust font size based on screen size
                component={Link}
                to={link}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                More info
              </Typography>
            )}
          </Box>
        </Stack>
      </Stack>
    </>
  );
}
