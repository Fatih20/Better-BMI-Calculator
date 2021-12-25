import React, {useState, useEffect, useRef} from "react";
import { LabelList } from "recharts";
import styled from "styled-components";
import useDebounce from "../customHooks/useDebounce";
import useEffectUpdate from "../customHooks/useEffectUpdate";
import useImperial from "../customHooks/useImperial";

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
    justify-content: ${({isFeet}) => isFeet !== undefined || isFeet ? "end" : "start"};
    width: 250px;

`;

const MetricChoiceContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
    padding: 10px 0;
`;

const MetricChoice = styled.p`
    color: ${({chosen}) => chosen ? "white" : `rgba(255, 255, 255, 0.4)`};
    margin: 0;
`;

const FormContainer = styled.div`
    display: ${({show}) => show ? "block" : "none"}
`;

function countInArray(array, checkedValue){
    return array.reduce((count, element) => count + (element === checkedValue ? 1 : 0), 0)
}

export default function Form () {
    const[height, setHeight] = useState("");
    const[weight, setWeight] = useState("");
    const [imperialHeight, setImperialHeight, resetImperialHeight, inch, feet] = useImperial();
    const[resetValue, setResetValue] = useState(true);
    const[isMetric, setIsMetric] = useState(true);
    const[calculation, setCalculation] = useCalculationContext();

    useDebounce(calculateBMI, 500, [height, weight])

    useEffect(() => {
        if (!isMetric){
            // console.log(imperialHeight);
            setHeight(imperialHeight);
        }
    }, [imperialHeight])

    useEffectUpdate(() => {
        setWeight("");
        setHeight("");
        resetImperialHeight();
        setCalculation(null);
    }, [isMetric]);

    function calculateBMI(){
        if (height !== "" && weight !== ""){
            const floatHeight = parseFloat(height);
            const floatWeight = parseFloat(weight);
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
        } else {
            console.log("Triggered it");
            setCalculation(null);
        }
    }

    const listOfNumber = Array.from({length: 10}, (_,i) => i.toString());
    const setOfValidCharacter = new Set(listOfNumber.concat(["."]));

    function handleChange(e, setExternalValue){
        // console.log(e);
        let newValue = e.target.value;
        let inputValid = true;
        if (e.nativeEvent.data === null && newValue.length > 0){
            newValue = newValue.substring(0, newValue.length);
        }

        if (newValue.length > 0 && countInArray((e.target.value).split(""), ".") > 1){
            // console.log("More")
            inputValid = false;
        }

        if (e.nativeEvent.data !== null && !setOfValidCharacter.has(e.nativeEvent.data)){
            inputValid = false;
        }

        if (inputValid){
            // console.log("Changing value");
            setExternalValue(newValue);
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
            <MetricChoiceContainer>
                <MetricChoice chosen={isMetric} onClick={() => setIsMetric(prevIsMetric => prevIsMetric ? prevIsMetric : !prevIsMetric)}>Metric</MetricChoice>
                <MetricChoice chosen={!isMetric} onClick={() => setIsMetric(prevIsMetric => prevIsMetric ? !prevIsMetric : prevIsMetric)}>Imperial</MetricChoice>
            </MetricChoiceContainer>
            <FormContainer show={isMetric}>
                <FormBits>
                    <p>Weight</p>
                    <StyledInput value={weight} onChange={(e) => handleChange(e, setWeight)}/>
                    <p>{unit[(isMetric.toString())]["weight"]}</p>
                </FormBits>
                <FormBits>
                    <p>Height</p>
                    <StyledInput value={height} onChange={(e) => handleChange(e, setHeight)}/>
                    <p>{unit[(isMetric.toString())]["height"]}</p>
                </FormBits>
            </FormContainer>
            <FormContainer show={!isMetric}>
                <FormBits>
                    <p>Weight</p>
                    <StyledInput value={weight} onChange={(e) => handleChange(e, setWeight)}/>
                    <p>{unit[(isMetric.toString())]["weight"]}</p>
                </FormBits>
                <FormBits>
                    <p>Height</p>
                    <StyledInput value={inch} onChange={(e) => handleChange(e, (value) => setImperialHeight(value, true))}/>
                    <p>{unit[(isMetric.toString())]["height"]}</p>
                </FormBits>
                <FormBits isFeet={true}>
                <StyledInput value={feet} onChange={(e) => handleChange(e, (value) => setImperialHeight(value, false))}/>
                    <p>feet</p>
                </FormBits>
            </FormContainer>

            
        </Main>
    )
}