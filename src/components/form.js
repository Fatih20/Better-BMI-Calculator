import React, {useState} from "react";
import styled from "styled-components";

const Main = styled.div`
    align-items: start;
    background-color: #333333;
    border-radius: 5px;
    padding: 20px;

`;

const StyledInput = styled.input`
    height: 100%;
`;

const FormBits = styled.div`
    align-items: center;
    display: flex;
    gap: 10px;
    justify-content: center;

    & > p {
        color: white;
    }
`;

export default function Form () {
    const[height, setHeight] = useState("");
    const[weight, setWeight] = useState("");
    const[isMetric, setIsMetric] = useState(true)

    const listOfNumber = Array.from({length: 10}, (_,i) => i.toString());
    const setOfValidCharacter = new Set(listOfNumber.concat(["."]))

    function countInArray(array, checkedValue){
        return array.reduce((count, element) => count + (element === checkedValue ? 1 : 0), 0)
    }

    function handleChange(e, valueInside, setValueInside){
        console.log(e);
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
            
            
        </Main>
    )
}