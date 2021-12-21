import React from "react";
import styled from "styled-components";

import Form from "./form";
import Result from "./result";

const Main = styled.div`
`;

export default function Body () {
    return (
        <Main>
            <Form />
            <Result />
        </Main>
    )
}