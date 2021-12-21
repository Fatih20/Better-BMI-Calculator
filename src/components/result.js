import React from "react";
import styled from "styled-components";

import { useCalculationContext } from "./body";

const Main = styled.div`
`;

export default function Result () {
    const [calculation, setCalculation] = useCalculationContext();

    return (
        <Main>
            <h2>{calculation}</h2>
        </Main>
    )
}