/*  */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Rule from './rule'
const FatherContext = React.createContext({});

export default function Home (props) {
  let type = Number(useSelector(state => state.type));
  const dispatch = useDispatch();
  let [Making, setMaking] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  }, []);

  return (
    <div id='bjbox'>
      <div id='start'>
        <h1>Wordle Game</h1>
        <button className='defaultbtn' onClick={() => {
          if (type != 0) {
            localStorage.clear();
          }
          dispatch({
            type: "normal"
          });
          navigate(`/game/normal`);
        }}>normal</button>
        <button className='defaultbtn' onClick={() => {
          if (type != 0) {
            localStorage.clear();
          }
          dispatch({
            type: "hard"
          });
          navigate(`/game/hard`);
        }}>hard</button>
        <button className='defaultbtn' onClick={() => {
          // setMaking(true)
          navigate('/rule')
        }}>Rule</button>
      </div>
      <FatherContext.Provider value={Making}>
        {Making === true ? <Rule setMaking={setMaking} /> : ''}
      </FatherContext.Provider>

    </div>

  );
}