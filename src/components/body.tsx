import React, {useState, useContext, FC} from "react";
import styled from "styled-components";

import Form from "./form";
import Result from "./result";

export type quantityVariable = null | number;
type providedContext = [quantityVariable, (arg0:quantityVariable) => void];

const CalculationContext = React.createContext<providedContext>([null, (arg0) => null]);

export function useCalculationContext(): providedContext{
    return useContext(CalculationContext);
}

const Main = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
`;

export default function Body () {
    const [calculation, setCalculation] = useState(null as quantityVariable);

    function setNewCalculation (newCalculation : quantityVariable) : void {
        setCalculation(newCalculation);
    }

    return (
        <Main>
            <CalculationContext.Provider value={[calculation, setNewCalculation]}>
                <Form />
                <Result />
            </CalculationContext.Provider> 
        </Main>
    )
}