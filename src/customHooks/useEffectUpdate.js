import React, {useEffect, useRef} from "react";

export default function useEffectUpdate(callback, dependencies) {
    const firstRender = useRef(true);

    useEffect(() => {
        if (!firstRender.current){
            callback()
        } else {
            firstRender.current = false;
        }
    }, dependencies)
}