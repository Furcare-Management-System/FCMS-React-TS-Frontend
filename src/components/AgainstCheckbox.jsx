import React, { useEffect, useState } from "react";
import {
  Checkbox,
  Alert,
  Box,
  Stack,
  TableCell,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
} from "@mui/material";

export default function AgainstCheckbox(props) {
  const {
    againsts,
    checkedItems,
    setCheckedItems,
    errors,
  } = props;

  return (
    <>
    <Box>
            {errors && (
              <Box>
                {Object.keys(errors).map((key) => (
                  <Alert severity="error" key={key}>
                    {errors[key][0]}
                  </Alert>
                ))}
              </Box>
            )}
            <Stack spacing={2} margin={2}>
              <TableContainer  sx={{ height: 380 }}>
                <Table stickyHeader aria-label="sticky table">
               

                  <TableBody>
                    {againsts.map((item) => (
                      <TableRow hover role="checkbox" key={item.id}>
                        <Checkbox
                          checked={checkedItems[item.id]}
                          onChange={() => {
                            setCheckedItems((prevCheckedItems) => ({
                              ...prevCheckedItems,
                              [item.id]: !prevCheckedItems[item.id],
                            }));
                          }}
                        />
                        <TableCell> {item.acronym}</TableCell>
                        <TableCell> {item.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>

            </Box>
    </>
  );
}
