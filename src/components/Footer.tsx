import React from "react";
import styled from "styled-components";

const Nav = styled.div`
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Footer() {
  return (
    <Nav>
      Created by
      <br></br>
      <a
        href="https:/alex-aranda.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        Alex Aranda
      </a>
    </Nav>
  );
}

export default Footer;
