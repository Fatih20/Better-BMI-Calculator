import { parse } from "path/posix";
import React, {useState, useRef, useEffect} from "react";
import { inputConnectedVariable } from "../components/form";

export default function useImperial (){
    const [totalHeight, setTotalHeight] = useState("" as inputConnectedVariable);
    const inch = useRef("" as inputConnectedVariable);
    const feet = useRef("" as inputConnectedVariable);

    function reset() : void{
        inch.current = "";
        feet.current = "";
        setTotalHeight("");
    }

    function setHeight (value : inputConnectedVariable, isInch:boolean){
        let calculatedInch = 0;
        let calculatedFeet = 0;
        
        if (value !== ""){
            if (isInch){
                calculatedInch = value;
            } else {
                calculatedFeet = value;
            }
        }

        setTotalHeight(calculatedInch + calculatedFeet*12);
    }

    return {
        imperialHeight : totalHeight, 
        setImperialHeight : setHeight, 
        resetImperialHeight : reset, 
        inch : inch.current, 
        feet : feet.current
    };
}