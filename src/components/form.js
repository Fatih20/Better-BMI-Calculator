import React, {useState, useEffect, useRef} from "react";
import { LabelList } from "recharts";
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

// function CorrectedInput ({calculateAndSetExternalValue, resetValue}){
//     const[value, setValue] = useState("");

//     useEffect(() => {
//         setValue("");
//     }, [resetValue]);

//     useEffect(() => {
//         calculateAndSetExternalValue(value);
//     }, [value]);

//     const listOfNumber = Array.from({length: 10}, (_,i) => i.toString());
//     const setOfValidCharacter = new Set(listOfNumber.concat(["."]));

//     if (resetValue){
//         setValue("");
//     }

//     function handleChange(e){
//         // console.log(e);
//         let newValue = e.target.value;
//         let inputValid = true;
//         if (e.nativeEvent.data === null && value.length > 0){
//             newValue = newValue.substring(0, newValue.length);
//         }

//         if (value.length > 0 && countInArray((e.target.value).split(""), ".") > 1){
//             console.log("More")
//             inputValid = false;
//         }

//         if (e.nativeEvent.data !== null && !setOfValidCharacter.has(e.nativeEvent.data)){
//             inputValid = false;
//         }

//         if (inputValid){
//             console.log("Changing value");
//             setValue(newValue);
//         }
//     }
//     return (
//         <StyledInput value={value} onChange={(e) => handleChange(e)}/>
//     )
// }

export default function Form () {
    const[height, setHeight] = useState("");
    const[weight, setWeight] = useState("");
    const[inch, setInch] = useState("");
    const[feet, setFeet] = useState("");
    const[resetValue, setResetValue] = useState(true);
    const[isMetric, setIsMetric] = useState(true);
    const[calculation, setCalculation] = useCalculationContext();

    useEffect(() => {
        if (!isMetric){
            calculateImperialHeight();
        }
    }, [inch, feet])

    useEffect(() => {
        console.log(height);
        console.log(weight);
        if (height !== "" && weight !== ""){
            calculateBMI();   
        } else {
            console.log("Triggered it")
            setCalculation(null)
        }
    }, [height, weight])

    useEffect(() => {
        setWeight("");
        setHeight("");
        setInch("");
        setFeet("");
        setCalculation(null);
    }, [isMetric]);

    function calculateBMI(){
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
    }

    function calculateImperialHeight (){
        if (inch === "" && feet === ""){
            setHeight("")
        } else {
            let convertedInch = 0;
            if (inch !== ""){
                convertedInch = parseFloat(inch);
            }
            let convertedFeet = 0;
            if (feet !== ""){
                convertedFeet = parseFloat(feet);
            }
            const newHeight = convertedInch+12*convertedFeet;
            setHeight(newHeight)
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
            console.log("More")
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
    //f
    

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
                    <StyledInput value={inch} onChange={(e) => handleChange(e, setInch)}/>
                    <p>{unit[(isMetric.toString())]["height"]}</p>
                </FormBits>
                <FormBits isFeet={true}>
                <StyledInput value={feet} onChange={(e) => handleChange(e, setFeet)}/>
                    <p>feet</p>
                </FormBits>
            </FormContainer>

            
        </Main>
    )
}