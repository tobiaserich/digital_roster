import React from "react";
import { Global, css } from "@emotion/react";

function GlobalStyles() {
  return (
    <Global
      styles={(theme) => css`
        *,
        *:before,
        *:after {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          font-family: "roboto", "sans-serif";
          background-color:black;
        }
        #root {
          position:relative;
          margin:auto;
          min-height:100vh;
          height:100%;
          max-width: 500px;
background-color:white;
        }
      }
      `}
    />
  );
}

export default GlobalStyles;
