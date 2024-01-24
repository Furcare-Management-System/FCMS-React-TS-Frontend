import { Stack, Snackbar, Alert, AlertTitle } from "@mui/material";

export default function Notif(props) {
  const { open, notification, severity } = props;

  return (
    <>
      {notification && (
        <Stack spacing={3} sx={{ width: "100%" }}>
          <Snackbar
            open={open}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert
              variant="filled"
              severity={severity}
              sx={{ fontSize: "14px", width: "100%" }}
            >
              {/* <AlertTitle>{title}</AlertTitle> */}
              {notification}
            </Alert>
          </Snackbar>
        </Stack>
      )}
    </>
  );
}
