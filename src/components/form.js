import React, {useState, useEffect, useRef} from "react";
import { LabelList } from "recharts";
import styled from "styled-components";
import useDebounce from "../customHooks/useDebounce";
import useEffectUpdate from "../customHooks/useEffectUpdate";
import useImperial from "../customHooks/useImperial";
import { VanillaButton } from "../GlobalComponent";

import { useCalculationContext } from "./body";

const Main = styled.div`
    align-items: center;
    background-color: #333333;
    border-radius: 10px;
    box-shadow: 0 2px 10px #000000;
    color : white;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px 20px 30px 20px;
`;

const FormContainer = styled.div`
    display: ${({show}) => show ? "flex" : "none"};
    flex-direction: column;
    gap: 20px;
`;

const FormBits = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    font-size: 18px;
    gap: 10px;
    & * {
        margin: 0;
    }
    /* border: solid 1px white; */
    /* justify-content: ${({isFeet}) => isFeet !== undefined || isFeet ? "end" : "start"}; */
`;

const FormInput = styled.div`
    align-items: center;
    align-self: start;
    display: flex;
    gap: 5px;
`;

const StyledInput = styled.input`
    border: solid 1px black;
    border-radius: 3px;
    font-size: 18px;
    font-family: 'Inter', sans-serif;
    height: 100%;
    padding: 5px;
    width: 90px;

    &::-webkit-inner-spin-button, &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
    }

    &:focus {
        outline-color: black;
    }
`;

const MetricChoiceContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
    padding: 10px 0;

`;

const MetricChoice = styled(VanillaButton)`
    background-color: rgba(0, 0, 0, 0);
    color: ${({chosen}) => chosen ? "white" : `rgba(255, 255, 255, 0.4)`};
    font-size: 14px;
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
                    setCalculation(calculationResult);
                }   
            }
        } else {
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
            "height" : "inch",
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
                    <FormInput>
                        <StyledInput type="number" value={weight} onChange={(e) => handleChange(e, setWeight)}/>
                        <p>{unit[(isMetric.toString())]["weight"]}</p>
                    </FormInput>
                </FormBits>
                <FormBits>
                    <p>Height</p>
                    <FormInput>
                        <StyledInput type="number" value={height} onChange={(e) => handleChange(e, setHeight)}/>
                        <p>{unit[(isMetric.toString())]["height"]}</p>
                    </FormInput>
                </FormBits>
            </FormContainer>
            <FormContainer show={!isMetric}>
                <FormBits>
                    <p>Weight</p>
                    <FormInput>
                        <StyledInput type="number" value={weight} onChange={(e) => handleChange(e, setWeight)}/>
                        <p>{unit[(isMetric.toString())]["weight"]}</p>
                    </FormInput>
                </FormBits>
                <FormBits>
                    <p>Height</p>
                    <FormBits isFeet={true}>
                    <FormInput>
                        <StyledInput type="number" value={feet} onChange={(e) => handleChange(e, (value) => setImperialHeight(value, false))}/>
                        <p>feet</p>
                    </FormInput>
                </FormBits>
                    <FormInput>
                        <StyledInput type="number" value={inch} onChange={(e) => handleChange(e, (value) => setImperialHeight(value, true))}/>
                        <p>{unit[(isMetric.toString())]["height"]}</p>
                    </FormInput>
                </FormBits>
            </FormContainer>

            
        </Main>
    )
}