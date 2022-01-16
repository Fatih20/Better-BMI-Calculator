import React, {useEffect} from "react";
import useTimeout from "./useTimeout";

export default function useDebounce (callback : () => void, delay : number , dependencies : any[]){
    const {reset, clear} = useTimeout(callback, delay);
    useEffect(reset, [...dependencies] )
    useEffect (clear, [])
}