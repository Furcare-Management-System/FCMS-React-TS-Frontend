import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate()
    return (
        <div>
            404 - Page Not Found
            <Button onClick={() => navigate(-1)} color="primary"> Back</Button>
        </div>
    )
}