import React, {useState, useEffect, useRef} from "react";
import styled from "styled-components";
import { BarChart, Bar, XAxis, ResponsiveContainer, ReferenceLine, YAxis } from "recharts";

import { useCalculationContext } from "./body";

const Main = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
`;

const Index = styled.h2`
    color : ${({color}) => color};
    font-size: 48px;
`;

const ChartContainer = styled.div`
    display: ${({show}) => show ? "block" : "none"};
`;

export default function Result () {
    const [calculation, setCalculation] = useCalculationContext();
    const [bodyType, setBodyType] = useState(null);
    const roundedCalculation = useRef(null);
    console.log(calculation);

    useEffect(() => {
        console.log(bodyType);
        console.log(calculation);
        if (calculation !== null){
            determineBodyType();
            roundedCalculation.current = calculation.toFixed(2);
        }
    }, [calculation])

    function determineBodyType (){
        let newBodyType;
        if (calculation < 18.5){
            newBodyType = "underweight"
        } else if (calculation < 25){
            newBodyType = "normal"
        } else if (calculation < 30){
            newBodyType = "overweight"
        } else if (calculation < 40){
            newBodyType = "obese"
        } else {
            newBodyType = "morbidly obese"
        }
        setBodyType(newBodyType);
    }

    const dataOfBodyType = {
        "underweight" : {
            "lower" : 0,
            "upper" : 18.5,
            "color": "#64baff"
        },
        "normal" : {
            "lower" : 18.5,
            "upper" : 25,
            "color": "#68b723"
        },
        "overweight" : {
            "lower" : 25,
            "upper" : 30,
            "color": "#f9c440"
        },
        "obese" : {
            "lower" : 30,
            "upper" : 40,
            "color": "#f37329"
        },
        "morbidly obese" : {
            "lower" : 40,
            "upper" : 1000000000,
            "color": "#c6262e"
        },
    }

    if (calculation === null || bodyType === null){
        return (
            <>

            </>
        )
    } else {
        return (
            <Main>
                <Index color={dataOfBodyType[bodyType]["color"]}>{calculation}</Index>
                    <ChartContainer show={(bodyType === "morbidly obese" || bodyType === "") ? false : true}>
                        <BarChart data={[{"name" : "Fatih", "value" : dataOfBodyType[bodyType]["upper"]}]} layout="vertical" width={700} height={100}>
                            <ReferenceLine xAxisId={0} x={calculation.toFixed()}/>
                            <YAxis dataKey="name" type="category" hide={true}/>
                            <XAxis xAxisId={0} dataKey="value" type="number" domain={[dataOfBodyType[bodyType]["lower"], dataOfBodyType[bodyType]["upper"]]} />
                            <Bar dataKey="value" fill={dataOfBodyType[bodyType]["color"]}/>
                        </BarChart>
                    </ChartContainer>
            </Main>
        )
    }
}