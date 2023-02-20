import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    const jsonValue = localStorage.getItem(key);
    if(jsonValue == null) {
      if(typeof initialValue === "function") {
          return (initialValue as () => T)();
      } else {
          return initialValue;
      }
    } else {
      //console.log('jsonValue: ', jsonValue)
      return JSON.parse(jsonValue);
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key])

  return [value, setValue] as [T, typeof setValue];
}

//we know this function will take in a generic type <RawNote[]> | <Tag[]>,
//a key "NOTES" | "TAGS" and a default initial value []
//useLocalStorage<RawNote[]>("NOTES", []) | useLocalStorage<Tag[]>("TAGS", [])

//initialValue: T | (() => T) --> as when we use useState you can eiter pass it a 
//an initial value or a function in our case [value, setValue] respectively

//in useState<T>(..) we will use the function version of useState as we want to first
//check to see if this data is in local storage

//we'll store this value in local storage using json

//if for some reason we dont have any value from local storage (if(jsonValue == null)), then i want to 
//take that data and i want to make sure that i use the initial value passed in:
//if(typeof initialValue === "function") that means we need to run the function
//version of this: here we need to run initialValue as a function: initialValue();
//initialValue() -->like this TS will give an error as it doesnt know if this is
//actually a function that we can call and we dont know that it returns <T> (type of T)
//so we need to make sure that we take our initialValue and cast it to this exact type:
//(initialValue as () => T)(); (This is function version of our parameter:
// initialValue: T | (() => T) )
//otherwise we can just return our initialValue


//[value, setValue] as [T, typeof setValue] --> first value is T and second value 
//will have the typeof setValue: so we specifically saying to TS that this array we're 
//returning will always have the first value which is our type is T and the second value
//will be whatever type of this setValue is: just to make sure TS know all the types

//useEffect to save our data in local storage every time our value or key changes


//useLocalStorage hook: 1. checks if the value exists yet
//2. everytime we change it, just update it

//with localStorage, we now have a place to store our notes and tags
