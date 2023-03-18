
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import Ruletext from './ruletext'
export default function Rule (props) {
  // 子向父传值
  const { setMaking } = props;
  const dispatch = useDispatch();
  const changeState = (event) => {
    dispatch({
      type: "hideruleState"
    });
  };

  return (
    <div id='shadowbox'>
      <div className='contentbox'>
        <p className='tit'>rule</p>
        <Ruletext />
        <p className='footers'>
          <button className='defaultbtn' onClick={changeState}>close</button>
        </p>
      </div>
    </div>
  );
}