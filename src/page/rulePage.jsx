
import React, { useEffect } from 'react';
import Ruletext from './ruletext'
import { Outlet, Link } from 'react-router-dom';
export default function Rule (props) {
  // to parent root
  const { setMaking } = props;
  const changeState = (event) => {
    setMaking(false)
  };
  useEffect(() => {
    // document.title = `Hello, ${props.name}`;
  }, []);

  return (
    <div className='RuleBox'>
      <p className='tit'>rule</p>
      <Ruletext />
      <p className='footers'>
        <Link to='/home' className='defaultbtn'>back</Link>
      </p>
    </div>
  );
}