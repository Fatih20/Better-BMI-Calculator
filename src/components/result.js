import React, {useState, useEffect, useRef} from "react";
import styled from "styled-components";
import { BarChart, Bar, XAxis, ResponsiveContainer, ReferenceLine, YAxis, Label, LabelList } from "recharts";

import { useCalculationContext } from "./body";

const Main = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 30px 0;
`;

const Index = styled.h2`
    color : ${({color}) => color};
    font-size: 72px;
    margin: 0;
`;

const BodyTypeContainer = styled.div`
    align-items: end;
    display: flex;
    justify-content: center;
    gap: 10px;
`;

const BodyType = styled.h2`
    color: ${({color}) => color};
    font-size: ${({currentBodyType}) => currentBodyType ? "36px" : null};
    margin: 0;

    /* border: solid 1px white; */
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
            "upper" : 100,
            "color": "#c6262e"
        },
    }

    function indexOfBodyTypeAround(centerBodyType) {
        const listOfBodyType = Object.keys(dataOfBodyType);
        const indexOfCenter = listOfBodyType.findIndex((element) => element === centerBodyType);
        const listOfIndex = [indexOfCenter-1, indexOfCenter, indexOfCenter+1].filter(index => index >= 0 && index < listOfBodyType.length);
        return listOfIndex
    }

    function renderBodyType (indexOfIncludedBodyType){
        const includedBodyType = Object.keys(dataOfBodyType)[indexOfIncludedBodyType]
        return (
            <BodyType currentBodyType={includedBodyType === bodyType ? true : false} id={includedBodyType} color={dataOfBodyType[includedBodyType]["color"]}>{includedBodyType}</BodyType>
        )
    }

    function dataProducer (givenBodyType){
        let indexOffset = 0;
        let value = [];
        const[bottom, middle, upper] = indexOfBodyTypeAround(givenBodyType);
        if (middle === Object.keys(dataOfBodyType).length-1){
            value = [dataOfBodyType[bodyType]["lower"], dataOfBodyType[bodyType]["upper"]];
        } else if (upper === undefined){
            indexOffset += 1;
            value = [dataOfBodyType[bodyType]["upper"], dataOfBodyType[bodyType]["upper"]+2]
        } else {
            value = [dataOfBodyType[bodyType]["lower"], dataOfBodyType[bodyType]["upper"], dataOfBodyType[bodyType]["upper"]+2]
        }

        const nameOfValue = ["bottom", "middle", "upper"];
        let result = [{"name" : "Fatih"}];

        value.forEach((name, index) => {
            console.log(nameOfValue[index+indexOffset])
            result[0][nameOfValue[index + indexOffset]] = name;
        })
        console.log(result);

        return result;
    };

    function domainProducer (givenBodyType){
        const[bottom, middle, upper] = indexOfBodyTypeAround(givenBodyType);
        let domain = [dataOfBodyType[bodyType]["lower"]-1, dataOfBodyType[bodyType]["upper"]+1]
        if (upper === undefined){
            domain[0] = domain[0]+1
        }
        console.log(domain);

        return domain;
    }

    function barGenerator (givenBodyType){

    }

    function tickProducer (givenBodyType){
        let tick = [dataOfBodyType[bodyType]["lower"], dataOfBodyType[bodyType]["upper"]]
        if (givenBodyType === "Morbidly Obese"){
            tick.pop()
        }

        return tick;
    }


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
                    {indexOfBodyTypeAround(bodyType).map(renderBodyType)}
                </BodyTypeContainer>
                <ChartContainer show={bodyType === "" ? false : true}>
                    <BarChart data={dataProducer(bodyType)} layout="vertical" width={700} height={100}>
                        <ReferenceLine xAxisId={0} x={calculation.toFixed(2)} isFront={true} strokeWidth={bodyType === "Morbidly Obese" ? 0 : 3}>
                            {/* <Label value="You're here" position="insideTop" fill="white"/> */}
                        </ReferenceLine>
                        <YAxis dataKey="name" type="category" hide={true}/>
                        <XAxis xAxisId={0} dataKey="value" type="number" domain={domainProducer(bodyType)} ticks={tickProducer(bodyType)} />
                        <Bar dataKey="upper" stackId="a" fill={dataOfBodyType[bodyType]["color"]}/>
                        <Bar dataKey="middle" stackId="a" fill={dataOfBodyType[bodyType]["color"]}/>
                        <Bar dataKey="bottom" stackId="a" fill={dataOfBodyType[bodyType]["color"]}/>
                    </BarChart>
                </ChartContainer>
            </Main>
        )
    }
}