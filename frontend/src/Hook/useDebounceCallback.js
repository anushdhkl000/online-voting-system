import { useEffect, useRef } from "react";

const useDebounceCallback = (callback, delay) => {
    const timeoutRef = useRef();

    useEffect(() => {
        return () => clearTimeout(timeoutRef.current);
    }, []);

    const debouncedCallback = (...args) => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    };

    return debouncedCallback;
};

export default useDebounceCallback;