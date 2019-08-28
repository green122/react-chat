import React from "react";
import styled from "styled-components";

const StyledHeader = styled.header`
  display: flex;
  background-color: #e9e9e9;
  p {
    width: 100%;
    text-align: center;
    vertical-align: middle;
  }
`;

export function Header() {
  return (
    <StyledHeader>
      <p>Status Meeting Standup</p>
    </StyledHeader>
  );
}
