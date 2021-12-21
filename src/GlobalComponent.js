import styled, { createGlobalStyle } from "styled-components";

export const GlobalTransition = createGlobalStyle`
    
    * {
        transition: color 0.2s, background-color 0.2s;
    }
`;

export const VanillaButton = styled.button`
    display: inline-block;
    border: none;
    margin: 0;
    text-decoration: none;
    cursor: pointer;
    text-align: center;
    -webkit-appearance: none;
    -moz-appearance: none;
`;