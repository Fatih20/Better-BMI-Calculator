import React, {useState, useEffect} from "react";
import styled from "styled-components";

import { useCalculationContext } from "./body";

const Main = styled.div`
    align-items: center;
    background-color: #333333;
    border-radius: 5px;
    color : white;
    display: flex;
    flex-direction: column;
    padding: 10px 20px;
`;

const StyledInput = styled.input`
    height: 100%;
`;

const FormBits = styled.div`
    align-items: center;
    display: flex;
    gap: 10px;
    justify-content: start;
    width: 250px;

    /* border: solid 1px white; */
`;

const MetricChoiceContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
`;

const MetricChoice = styled.p`
    color: ${({chosen}) => chosen ? "white" : `rgba(255, 255, 255, 0.4)`};
`;

function countInArray(array, checkedValue){
    return array.reduce((count, element) => count + (element === checkedValue ? 1 : 0), 0)
}

export default function Form () {
    const[height, setHeight] = useState("");
    const[weight, setWeight] = useState("");
    const[isMetric, setIsMetric] = useState(true);
    const[calculation, setCalculation] = useCalculationContext();

    const listOfNumber = Array.from({length: 10}, (_,i) => i.toString());
    const setOfValidCharacter = new Set(listOfNumber.concat(["."]));

    useEffect(() => {
        calculateBMI();
    }, [height, weight])

    useEffect(() => {
        setHeight("");
        setWeight("");
        setCalculation(null);
    }, [isMetric]);

    function calculateBMI(){
        const floatHeight = parseFloat(height);
        const floatWeight = parseFloat(weight);
        // console.log(floatWeight);
        if (floatHeight.toString() !== "NaN" && floatWeight.toString() !== "NaN"){
            let calculationResult = floatWeight/(floatHeight**2);
            if (isMetric){
                calculationResult = calculationResult*10000;
            } else {
                calculationResult = calculationResult*703;
            }
            if (calculationResult !== NaN){
                console.log(calculationResult);
                setCalculation(calculationResult);
            }   
        }
    }

    function handleChange(e, valueInside, setValueInside){
        // console.log(e);
        if (e.nativeEvent.data === null && valueInside.length > 0){
            setValueInside((e.target.value).substring(0, (e.target.value).length))
        }

        let inputValid = true;

        if (valueInside.length > 0 && countInArray((e.target.value).split(""), ".") > 1){
            inputValid = false;
        }

        if (!setOfValidCharacter.has(e.nativeEvent.data)){
            inputValid = false;
        }

        if (inputValid){
            setValueInside(e.target.value)
        }
    }

    const unit = {
        "true" : {
            "weight" : "kg",
            "height" : "cm",
        },
        "false" :{
            "weight" : "lbs",
            "height" : "in",
        }
    }
    

    return (
        <Main>
            <FormBits>
                <p>Weight</p>
                <StyledInput value={weight} onChange={(e) => handleChange(e, weight, setWeight)}/>
                <p>{unit[(isMetric.toString())]["weight"]}</p>
            </FormBits>
            <FormBits>
                <p>Height</p>
                <StyledInput value={height} onChange={(e) => handleChange(e, height, setHeight)}/>
                <p>{unit[(isMetric.toString())]["height"]}</p>
            </FormBits>
            <MetricChoiceContainer>
                <MetricChoice chosen={isMetric} onClick={(isMetric) => setIsMetric(prevIsMetric => prevIsMetric ? prevIsMetric : !prevIsMetric)}>Metric</MetricChoice>
                <MetricChoice chosen={!isMetric} onClick={(isMetric) => setIsMetric(prevIsMetric => prevIsMetric ? !prevIsMetric : prevIsMetric)}>Imperial</MetricChoice>
            </MetricChoiceContainer>

            
        </Main>
    )
}