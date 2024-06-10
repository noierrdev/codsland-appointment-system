import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function(props){
    return (
            <Outlet {...props} />
    )
}