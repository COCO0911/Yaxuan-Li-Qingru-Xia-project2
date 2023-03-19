/*  */
import React, { useContext } from 'react';
import { useSelector } from "react-redux";
import { FatherContext } from './game';
export default function Inputbox (props) {
  let type = Number(useSelector(state => state.type));
  const currentGuess = useContext(FatherContext);

  function getguessData () {
    let arrayData = '';
    if (type === 1) {
      arrayData = new Array(6).fill('')
    } else {
      arrayData = new Array(7).fill('')
    }
    if (currentGuess !== undefined) {
      currentGuess.forEach((ele, i) => {
        arrayData[i] = ele;
      })
    }

    return arrayData
  }
  return (
    <div >
      {
        getguessData().map((ele, i) => {
          return <div key={i} className="letter-slot">{ele}</div>
        })
      }
    </div>
  );
}