import React, {useState} from "react";
import styled from "styled-components";

const Main = styled.div`
    background-color: #333333;
    border-radius: 5px;
    padding: 20px;

`;

const StyledInput = styled.input`
`;

export default function Form () {
    const[height, setHeight] = useState("");
    const[weight, setWeight] = useState("");

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
    

    return (
        <Main>
            <StyledInput value={weight} onChange={(e) => handleChange(e, weight, setWeight)}/>
        </Main>
    )
}