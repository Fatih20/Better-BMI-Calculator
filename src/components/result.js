import React, {useState, useEffect, useRef} from "react";
import styled from "styled-components";
import { BarChart, Bar, XAxis, ResponsiveContainer, ReferenceLine, YAxis, Label, LabelList } from "recharts";

import { useCalculationContext } from "./body";

const Main = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
`;

const Index = styled.h2`
    color : ${({color}) => color};
    font-size: 72px;
`;

const BodyTypeContainer = styled.div`
    align-items: end;
    display: flex;
    justify-content: center;
    gap: 10px;

    & > *:nth-child(2){
        font-size: 36px;
    }
`;

const BodyType = styled.h2`
    color: ${({color}) => color};
`;

const ChartContainer = styled.div`
    display: ${({show}) => show ? "block" : "none"};
`;

export default function Result () {
    const [calculation, setCalculation] = useCalculationContext();
    const [bodyType, setBodyType] = useState(null);

    useEffect(() => {
        // console.log(bodyType);
        // console.log(calculation);
        if (calculation !== null){
            determineBodyType();
        }
    }, [calculation])

    function determineBodyType (){
        let newBodyType;
        if (calculation < 18.5){
            newBodyType = "Underweight"
        } else if (calculation < 25){
            newBodyType = "Normal"
        } else if (calculation < 30){
            newBodyType = "Overweight"
        } else if (calculation < 40){
            newBodyType = "Obese"
        } else {
            newBodyType = "Morbidly Obese"
        }
        setBodyType(newBodyType);
    }

    const dataOfBodyType = {
        "Underweight" : {
            "lower" : 0,
            "upper" : 18.5,
            "color": "#64baff"
        },
        "Normal" : {
            "lower" : 18.5,
            "upper" : 25,
            "color": "#68b723"
        },
        "Overweight" : {
            "lower" : 25,
            "upper" : 30,
            "color": "#f9c440"
        },
        "Obese" : {
            "lower" : 30,
            "upper" : 40,
            "color": "#f37329"
        },
        "Morbidly Obese" : {
            "lower" : 40,
            "upper" : 1000000000,
            "color": "#c6262e"
        },
    }

    function bodyTypeAround(centerBodyType) {
        const listOfBodyType = Object.keys(dataOfBodyType);
        const indexOfCenter = listOfBodyType.findIndex((element) => element === centerBodyType);
        const listOfIndex = [indexOfCenter-1, indexOfCenter, indexOfCenter+1].filter(index => index >= 0 && index < listOfBodyType.length);
        return listOfIndex.map((index) => listOfBodyType[index])
    }

    function renderBodyType (includedBodyType){
        return (
            <BodyType id={includedBodyType} color={dataOfBodyType[includedBodyType]["color"]}>{includedBodyType}</BodyType>
        )
    }

    function dataProducer (givenBodyType){
        const value = [dataOfBodyType[bodyType]["lower"], dataOfBodyType[bodyType]["upper"], dataOfBodyType[bodyType]["upper"]+2];
        const nameOfValue = ["bottom", "middle", "upper"];
        let result = [{"name" : "Fatih"}]

        nameOfValue.forEach((name, index) => {
            result[0][name] = value[index]
        })
        console.log(result);

        return result;
    };


    if (calculation === null || bodyType === null){
        return (
            <>

            </>
        )
    } else {
        return (
            <Main>
                <Index color={dataOfBodyType[bodyType]["color"]}>{calculation.toFixed(2)}</Index>
                <BodyTypeContainer>
                    {bodyTypeAround(bodyType).map(renderBodyType)}
                </BodyTypeContainer>
                <ChartContainer show={(bodyType === "Morbidly Obese" || bodyType === "") ? false : true}>
                    <BarChart data={dataProducer(bodyType)} layout="vertical" width={700} height={100}>
                        <ReferenceLine xAxisId={0} x={calculation.toFixed(2)} isFront={true} strokeWidth={3}>
                            {/* <Label value="You're here" position="insideTop" fill="white"/> */}
                        </ReferenceLine>
                        <YAxis dataKey="name" type="category" hide={true}/>
                        <XAxis xAxisId={0} dataKey="value" type="number" domain={[dataOfBodyType[bodyType]["lower"]-1, dataOfBodyType[bodyType]["upper"]+1]} ticks={[dataOfBodyType[bodyType]["lower"], dataOfBodyType[bodyType]["upper"]]} />
                        <Bar dataKey="upper" stackId="a" fill={dataOfBodyType[bodyType]["color"]}/>
                        <Bar dataKey="middle" stackId="a" fill={dataOfBodyType[bodyType]["color"]}/>
                        <Bar dataKey="bottom" stackId="a" fill={dataOfBodyType[bodyType]["color"]}/>
                    </BarChart>
                </ChartContainer>
            </Main>
        )
    }
}