/*  */
import React, { useContext } from 'react';
import { useSelector } from "react-redux";
import { FatherContext } from './game';
export default function Inputbox (props) {
  /* 获取存储在redux中的状态 */
  let type = Number(useSelector(state => state.type));
  const currentGuess = useContext(FatherContext);

  /* 设定当前显示数组长度 */
  function getguessData () {
    /* 原先小于6位，也默认显示6位 */
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