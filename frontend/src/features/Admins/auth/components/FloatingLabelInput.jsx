import { PasswordInput, TextInput } from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";

const FloatingLabelInput = ({ label, type, isFocusTrap, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef(null);

  const [wasInitiallyAutofilled, setWasInitiallyAutofilled] = useState(false);

  useEffect(() => {
    const checkAutofilled = () => {
      const autofilled = !!document
        .getElementById(label)
        ?.matches("*:-webkit-autofill");
      setWasInitiallyAutofilled(autofilled);
    };

    const timeout1 = setTimeout(checkAutofilled, 500);
    const timeout2 = setTimeout(checkAutofilled, 1000);
    const timeout3 = setTimeout(checkAutofilled, 2000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, []);

  useEffect(() => {
    if (isFocusTrap && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocusTrap]);

  return type === "password" ? (
    <div className="relative w-full">
      <PasswordInput
        ref={inputRef}
        {...props}
        onFocus={() => {
          setWasInitiallyAutofilled(false);
          setIsFocused(true);
        }}
        onBlur={(e) => {
          setWasInitiallyAutofilled(false);
          setIsFocused(e.target.value !== "");
        }}
        classNames={{
          input: isFocused || props.value ? "!pt-4" : "",
          root: "w-full",
        }}
        className="floating-password"
        styles={{ input: { height: "60px" } }}
        id={label}
      />
      <label
        className={`absolute left-3 transition-all duration-200 ease-in-out ${
          isFocused || props.value || wasInitiallyAutofilled
            ? "top-2 text-xs text-blue-500 mb-2"
            : "top-5 text-sm text-gray-500"
        }`}
      >
        {label}
      </label>
    </div>
  ) : (
    <div className="relative w-full">
      <TextInput
        name={label}
        ref={inputRef}
        {...props}
        onFocus={() => {
          setWasInitiallyAutofilled(false);
          setIsFocused(true);
        }}
        onBlur={(e) => {
          setWasInitiallyAutofilled(false);
          setIsFocused(e.target.value !== "");
        }}
        classNames={{
          input:
            isFocused || props.value || wasInitiallyAutofilled ? "!pt-4" : "",
          root: "w-full",
        }}
        styles={{ input: { height: "60px" } }}
      />
      <label
        className={`absolute left-3 transition-all duration-200 ease-in-out ${
          isFocused || props.value
            ? "top-2 text-xs text-blue-500"
            : "top-5 text-sm text-gray-500"
        }`}
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingLabelInput;
