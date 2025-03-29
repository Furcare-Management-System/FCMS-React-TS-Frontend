import React from "react";
import { Helmet } from "react-helmet-async";
import logo from "../../assets/furcare-logo.png";

const CustomHelmet = ({ title = "No Page Title", children }) => {
  return (
    <Helmet>
      <title>{title} | Furcare</title>

      <link rel="icon" type="image/svg+xml" href={logo} />

      {/* Open Graph for Social Media */}
      <meta property="og:title" content={title || "Furcare"} />

      {children}
    </Helmet>
  );
};

export default CustomHelmet;
