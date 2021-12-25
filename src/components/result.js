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
    align-items: center;
    display: flex;
    justify-content: center;
    gap: 10px;
    width: 100%;
    /* border: solid 1px white; */
`;

const BodyType = styled.h2`
    color: ${({color}) => color};
    font-size: ${({currentBodyType}) => currentBodyType ? "36px" : null};
    margin: 0;

    /* border: solid 1px white; */
`;

const Spacer = styled.div`
    flex-grow: 1;
`;

const ChartContainer = styled.div`
    display: ${({show}) => show ? "block" : "none"};
`;

function swapPosition (array, a, b){
    [array[a], array[b]] = [array[b], array[a]]
}

function shadeColor(color, percent) {

    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    var RR = ((R.toString(16).length===1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length===1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length===1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
}

export default function Result () {
    const [calculation, setCalculation] = useCalculationContext();
    const [bodyType, setBodyType] = useState(null);
    const [indexOfCenter, setIndexOfCenter] = useState(null);

    useEffect(() => {
        // console.log(bodyType);
        // console.log(calculation);
        if (calculation !== null){
            determineBodyTypeAndIndex();
    }}, [calculation]);

    function determineBodyTypeAndIndex (){
        let centerBodyType;
        if (calculation < 18.5){
            centerBodyType = "Underweight"
        } else if (calculation < 25){
            centerBodyType = "Normal"
        } else if (calculation < 30){
            centerBodyType = "Overweight"
        } else if (calculation < 40){
            centerBodyType = "Obese"
        } else {
            centerBodyType = "Morbidly Obese"
        }

        const indexOfCenter = Object.keys(dataOfBodyType).findIndex((element) => element === centerBodyType);
        setBodyType(centerBodyType);
        setIndexOfCenter(indexOfCenter);
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
            "upper" : 60,
            "color": "#c6262e"
        },
    };

    function includedBodyTypeProducer (dataType){
        const listOfBodyType = Object.keys(dataOfBodyType);
        const listOfIndex = [indexOfCenter-1, indexOfCenter, indexOfCenter+1].filter(index => index >= 0 && index < listOfBodyType.length);
        const listOfIncludedBodyType = listOfIndex.map((element) => listOfBodyType[element]);

        if (dataType === "index"){
            return listOfIndex; 
        } else if (dataType === "body type") {
            return listOfIncludedBodyType;
        }
    }

    function dataProducer (){
        let data = [{}];
        if (indexOfCenter === Object.keys(dataOfBodyType).length-1){
            data[0]["middle"] = dataOfBodyType[bodyType]["lower"];
            data[0]["upper"] = dataOfBodyType[bodyType]["upper"]-dataOfBodyType[bodyType]["lower"];
        } else if (indexOfCenter === 0){
            data[0]["bottom"] = dataOfBodyType[bodyType]["upper"];
            data[0]["middle"] = 2;
        } else {
            data[0]["bottom"] = dataOfBodyType[bodyType]["lower"];
            data[0]["middle"] = dataOfBodyType[bodyType]["upper"]-dataOfBodyType[bodyType]["lower"];
            data[0]["upper"] = 2;
        }

        return data;
    }

    function domainProducer (){
        let domain = [dataOfBodyType[bodyType]["lower"]-1, dataOfBodyType[bodyType]["upper"]+1];
        if (indexOfCenter === 0){
            domain[0] = domain[0]+1;
        } else if (indexOfCenter === Object.keys(dataOfBodyType).length-1){
            domain[1] = domain[1]-1;
        }

        return domain;
    };

    function tickProducer (){
        let tick = [dataOfBodyType[bodyType]["lower"], dataOfBodyType[bodyType]["upper"]]
        if (indexOfCenter === Object.keys(dataOfBodyType).length-1){
            tick.pop()
        }
        return tick;
    };

    function renderBodyType (indexOfIncludedBodyType){
        const includedBodyType = Object.keys(dataOfBodyType)[indexOfIncludedBodyType]
        console.log(includedBodyType);
        return (
            <BodyType currentBodyType={includedBodyType === bodyType ? true : false} id={includedBodyType} color={dataOfBodyType[includedBodyType]["color"]}>{includedBodyType}</BodyType>
        )
    };

    function renderBodyTypeBox (){
        let includedBodyTypeElement = [];
        console.log(includedBodyTypeProducer("index"));
        includedBodyTypeProducer("index").forEach((element, index) => {
            includedBodyTypeElement.push(renderBodyType(element));
        })

        includedBodyTypeElement.forEach((element, index) => {
            if ((index+1) % 2 !== 0 ){
                includedBodyTypeElement.splice(index+1, 0, <Spacer />)
            }
        }
        )

        return includedBodyTypeElement;
    }

    function barGenerator (){
        const data = dataProducer()[0];
        const listOfIncludedBodyType = includedBodyTypeProducer("body type");
        let listOfBars = [];
        console.log(data);
        Object.keys(data).forEach((position, index) => {
            const color = dataOfBodyType[listOfIncludedBodyType[index]]["color"];
            listOfBars.push(
                <Bar id={`${index}${position}`} stackId="a" dataKey={position} fill={color} stroke={shadeColor(color, -30)} strokeWidth={1.75}/>
            )
        })
        return listOfBars;
    };


    if (calculation === null || bodyType === null){
        // console.log(calculation);
        // console.log(bodyType);
        return (
            <>

            </>
        )
    } else {
        return (
            <Main>
                <Index color={dataOfBodyType[bodyType]["color"]}>{calculation.toFixed(2)}</Index>
                <BodyTypeContainer>
                    {renderBodyTypeBox()}
                </BodyTypeContainer>
                <ChartContainer show={bodyType === "" ? false : true}>
                    <BarChart data={dataProducer()} layout="vertical" width={700} height={100}>
                        <YAxis dataKey="name" type="category" hide={true}/>
                        <XAxis xAxisId={0} dataKey="value" type="number" domain={domainProducer()} ticks={tickProducer()} />
                        {barGenerator()}
                        <ReferenceLine xAxisId={0} x={calculation.toFixed(2)} isFront={true} strokeWidth={bodyType === "Morbidly Obese" ? 0 : 6} stroke="black" />
                        <ReferenceLine xAxisId={0} x={calculation.toFixed(2)} isFront={true} strokeWidth={bodyType === "Morbidly Obese" ? 0 : 3} stroke="white" />
                    </BarChart>
                </ChartContainer>
            </Main>
        )
    }
}