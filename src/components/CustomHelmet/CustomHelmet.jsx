import React from "react";
import { Helmet } from "react-helmet-async";
import logo from "../../assets/furcare-logo.png";
import { useStateContext } from "../../contexts/ContextProvider";

const CustomHelmet = ({ title = "No Page Title", children }) => {
  // Get user
  const { user } = useStateContext();

  const getPanelRoleTitle = () => {
    // Panel Title
    let panelRoleTitle = "";

    switch (user.role_id) {
      case "1":
        panelRoleTitle = "Admin Panel";
        break;

      case "2":
        panelRoleTitle = "Staff Panel";
        break;
      case "3":
        panelRoleTitle = "Pet Owner Panel";
        break;
    }

    // Return pantel role title
    return panelRoleTitle;
  };

  return (
    <Helmet>
      <title>
        {title} | {getPanelRoleTitle()} | Furcare
      </title>

      <link rel="icon" type="image/svg+xml" href={logo} />

      {/* Open Graph for Social Media */}
      <meta property="og:title" content={title || "Furcare"} />

      {children}
    </Helmet>
  );
};

export default CustomHelmet;
