import React, {useState, useContext} from "react";
import styled from "styled-components";

import Form from "./form";
import Result from "./result";

const CalculationContext = React.createContext();

export function useCalculationContext(){
    return useContext(CalculationContext);
}

const Main = styled.div`
`;



export default function Body () {
    const[calculation, setCalculation] = useState(null);
    return (
        <Main>
            <CalculationContext.Provider value={[calculation, setCalculation]}>
                <Form />
                <Result />
            </CalculationContext.Provider> 
        </Main>
    )
}