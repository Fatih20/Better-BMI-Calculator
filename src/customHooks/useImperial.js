import React, {useState, useRef, useEffect} from "react";

export default function useImperial (){
    const [totalHeight, setTotalHeight] = useState('');
    const inch = useRef('');
    const feet = useRef('');

    function reset (){
        inch.current = '';
        feet.current = '';
        setTotalHeight('');
    }


    function setHeight (value, isInch){
        if (isInch){
            inch.current = value;
        } else {
            feet.current = value;
        }

        let calculatedInch = 0;
        if ((parseFloat(inch.current)).toString() !== "NaN"){
            calculatedInch = parseFloat(inch.current);
        }

        let calculatedFeet = 0;
        if ((parseFloat(feet.current)).toString() !== "NaN"){
            calculatedFeet = parseFloat(feet.current);
        }

        setTotalHeight(calculatedInch + calculatedFeet*12);
    }

    return [totalHeight, setHeight, reset, inch.current, feet.current];
}