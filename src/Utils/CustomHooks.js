import { useCallback, useEffect, useRef, useState } from 'react'
import CustomStack from './CustomStack';
import useBlocker from './UseBlocker.ts';

export const useFocus = () => {
    const ref = useRef(null);
    const setFocus = () => {
        ref.current && ref.current.focus();
    }
    return [ref, setFocus];
}

export const usePrevious = (value) => {
    let stack = new CustomStack(10);
    const ref = useRef(stack);

    useEffect(() => {
        ref.current.push(value);
    }, [value]);
    
    return [ref.current, ref.current.pop];
}

export const useAsyncReducer = (reducer, initState) => {
    const [state, setState] = useState(initState);
    const dispatch = async (action) => setState(await reducer(state, action));
    return [state, dispatch];
}

export const useLocalState = (key,  initVal) => {
    const [state, setState] = useState();
    const setStateData = (data) => {
        window.localStorage.setItem(key, JSON.stringify(data));
        setState(JSON.parse(window.localStorage.getItem(key)) ?? initVal);
    }
    return [JSON.parse(window.localStorage.getItem(key)) ?? initVal, setStateData, state];
}

export const usePrompt = (message, when = true, allowedRoutes) => {
    const blocker = useCallback((tx) => {
        if (window.confirm(message)) {
            tx.retry();
        }
    }, [message]);

    useBlocker(blocker, when, allowedRoutes);
}