
import React, { useEffect } from 'react';

export default function AlertWord (props) {
  // 子向父传值
  const { setWord } = props;
  const changeState = (event) => {
    setWord(false)
  };

  return (
    <div className='alertBox'>
      <div className='content'>
        <p className='tit'>Tips</p>
        <p className='desc'>{props.msg}</p>
        <p className='footer'>
          <button className='defaultbtn' onClick={changeState}>close</button>
        </p>
      </div>
    </div>
  );
}