/*  */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useParams } from 'react-router-dom';
import { useNavigate, Link } from "react-router-dom";
import Inputbox from './inputbox'
import AlertBoxenter from './alertboxenter'
import AlertBoxdif from './alertboxdif'
import AlertWord from './alertword'
import Rule from './rule'
export const FatherContext = React.createContext({});
export default function Game (props) {
  /* get redux state */
  let type = Number(useSelector(state => state.type));
  /* rule page pop-up */
  let ruleState = useSelector(state => state.ruleState)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  /* store the right anser */
  const [targetWord, settargetWord] = useState(localStorage.getItem('targetWord') === null ? [] : JSON.parse(localStorage.getItem('targetWord')));
  const [currentGuess, setcurrentGuess] = useState(localStorage.getItem('currentGuess') === null ? [] : JSON.parse(localStorage.getItem('currentGuess')));
  /* result list */
  const [guesslist, setguesslist] = useState(localStorage.getItem('guesslist') === null ? [] : JSON.parse(localStorage.getItem('guesslist')));
  const [shake, setshake] = useState(false);
  const [enterclick, setenterclick] = useState(true);
  const [deficiency, setdeficiency] = useState(false);
  /* click enter to start game */
  const [enterState, setenterState] = useState(false);
  /*check the valid word */
  const [Word, setWord] = useState(false);
  if (targetWord.length === 0) {
    getTargetWord();
  }

  const changeworldState = () => {
    let url = window.location.href;
    console.log(url);
    if (url.indexOf('normal') != -1) {
      /* easy game */
      console.log(type);
      if (type != 1) {
        localStorage.removeItem('targetWord');
        localStorage.removeItem('currentGuess');
        localStorage.removeItem('guesslist');
        dispatch({
          type: "normal"
        });
        window.location.reload();
      }
    } else if (url.indexOf('hard') != -1) {
      /* hard game */
      if (type != 2) {
        localStorage.removeItem('targetWord');
        localStorage.removeItem('currentGuess');
        localStorage.removeItem('guesslist');
        dispatch({
          type: "hard"
        });
        window.location.reload();
      }

    }
  }

  // console.log(useParams())
  useEffect(() => {
    /* change the state */
    changeworldState()
  }, []);// eslint-disable-line
  /* show the current difficulty */
  function showDegree () {
    if (type === 1) {
      return 'normal'
    } else {
      return 'hard'
    }
  }
  const keySubmit = (e) => {
    run(e.target.value)
  }
  function run (val) {
    let size = type === 1 ? 6 : 7;/* 6 attemps for hard / 7 attempt for easy */
    let key = val
    var p = /^[A-Za-z]+$/;
    /* input should be alphabet */
    if (p.test(key) && key.length === 1) {
      if (currentGuess.length < size) {
        let guess = currentGuess;/* current word */
        guess.push(key.toUpperCase());/* add new guesses */
        setcurrentGuess([...guess])
        localStorage.setItem('currentGuess', JSON.stringify(currentGuess))
      }
    } else if (key === "Backspace" || key === 'backspace') {
      let guess = currentGuess.slice(0, -1);
      setcurrentGuess(guess)
      localStorage.setItem('currentGuess', JSON.stringify(guess))
    } else if (key === "Escape" || key === "newgame") {
      newgame('restart')
    } else if (key === "Enter" || key === "enter") {
      if (enterclick === true) {
        setenterclick(false)
        setTimeout(function () {
          setenterclick(true)
        }, 3000)
        if ((type === 1 && guesslist.length === 6) || (type === 2 && guesslist.length === 5)) {
          /* restart the game if the game is over */
          setenterState(true)
        } else {
          if (currentGuess.length === size) {
            Validate()
            // setcurrentGuess([])
            localStorage.setItem('currentGuess', JSON.stringify([]))
          } else {
            /* word too short */
            setdeficiency(true)
          }
        }

      }
    }
  }
  /* if success alert  */
  function newgame (state) {
    let result = ''
    if (state === 'success') {
      result = window.confirm('Congratulations!  Would you like to try again?');
    } else if (state === 'restart') {
      result = window.confirm('Are you sure you want to restart the game?');
    }

    if (result === true) {
      localStorage.clear()
      /* choose the difficulty */
      navigate(`/home`);
    } else {

    }
  }

  function Validate () {
    //Check if it is a valid english word
    fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${currentGuess.join('').toLocaleLowerCase()}`
    ).then((res) => {
      if (res.status == "404") {
        setshake(true);
        setWord(true)
        setTimeout(function () {
          setshake(false);
        }, 2000)
      } else {
        checkSpelling();
      }
    });

  }
 
  function addGuess (guess) {
    if (guess.length !== 0) {
      let guessdata = guesslist;
      guessdata.push(guess)
      setguesslist(guessdata)
      setcurrentGuess([])
      localStorage.setItem('guesslist', JSON.stringify(guesslist))
    }
  
    if (guesslist.length === 0 || guesslist === []) {
      restart();
      getTargetWord();
    } else {
    }
  }
  /* a function to check the spelling */
  async function checkSpelling () {
    // const response = await fetch(`https://trex-sandwich.com/ajax/word/${currentGuess.join('').toLocaleLowerCase()}`);
    //     const data = await response.json();
    const data = JSON.parse(localStorage.getItem('targetWord')).join('').toLocaleLowerCase()

    if (data === currentGuess.join('').toLocaleLowerCase()) {
      let result = currentGuess.map((ele) => {
        let data = {
          data: ele,
          state: 'green'
        }
        return data;
      })
      restart()
      /* add data into result */
      addGuess(result);
      newgame('success')
    } else {
      let result = [];
      currentGuess.forEach((ele, i) => {
        /* right place */
        if (targetWord[i] === ele) {
          result.push({
            data: ele,
            state: 'green'
          })
        } else if (targetWord.indexOf(ele) !== -1 && targetWord[i] !== ele) {
          /* exist, the wrong place*/
          result.push({
            data: ele,
            state: 'orange'
          })
        } else if (targetWord.indexOf(ele) === -1) {
          /* not exist */
          result.push({
            data: ele,
            state: 'gray'
          })
        }
      })

      setshake(true);
      setTimeout(function () {
        setshake(false);
        /* add the data to the result */
        addGuess(result);
        /* if guesses are more than attemp， restart the game*/
        if ((type === 1 && guesslist.length === 6) || (type === 2 && guesslist.length === 5)) {
          let result = window.confirm(`Failure,The answer ${targetWord}, whether to restart the game?`);
          if (result === true) {
            localStorage.clear()
            navigate(`/home`);
          }
        }
      }, 2000)

    }

  }
  /* initial the word */
  async function getTargetWord () {
    const words = await getWords(1);
    settargetWord(words.word.toUpperCase().split(''))
    localStorage.setItem('targetWord', JSON.stringify(words.word.toUpperCase().split('')))
  }
  /* reset the word */
  function restart () {
    let size = type === 1 ? 6 : 7;
    /* update the letter in input field */
    setcurrentGuess([])
    localStorage.setItem('currentGuess', JSON.stringify([]));
  };
  /* get word */
  async function getWords (count) {
    const response = await fetch(`https://trex-sandwich.com/ajax/word?count=${count}&length=${type === 1 ? 6 : 7}`);
    const data = await response.json();
    const targetWord = data[0];
    settargetWord(data[0])
    return targetWord
  }
  return (
    <div id='game'>
      <div className='fn-clear level'>
        <span className='fl'>
          Current difficulty level：{showDegree()}
        </span>
        <span className='fr'>The number of attempts remaining：{type === 1 ? (6 - guesslist.length) : (5 - guesslist.length)}</span>
      </div>
      <div className='btnbox'>
        <button className='defaultbtn' onClick={() => {
          dispatch({
            type: "showruleState"
          });
        }}>Rule</button>
        <Link to="/home" className='defaultbtn'>Home</Link>
      </div>
      <FatherContext.Provider value={currentGuess}>
        {shake === false ?
          <div id="current-guess">
            <Inputbox />
          </div>
          :
          <div id="current-guess" className='animate__animated animate__shakeX'>
            <Inputbox />
          </div>
        }
      </FatherContext.Provider>
      <hr />
      <div className="game_rows">
        {
          guesslist.map((ele, i) => {
            return (
              <div className="Row" key={i}>
                {
                  [...ele].map((m, n) => {
                    return (
                      <div className="Row-letter" key={n} style={{ 'backgroundColor': m.state }}>{m.data}</div>
                    )
                  })
                }
              </div>
            )
          })}
      </div>
      <hr />
      <div id="keyboard">
        <div className="row">
          <button className="key" value="q" onClick={keySubmit}>Q</button>
          <button className="key" value="w" onClick={keySubmit}>W</button>
          <button className="key" value="e" onClick={keySubmit}>E</button>
          <button className="key" value="r" onClick={keySubmit}>R</button>
          <button className="key" value="t" onClick={keySubmit}>T</button>
          <button className="key" value="y" onClick={keySubmit}>Y</button>
          <button className="key" value="u" onClick={keySubmit}>U</button>
          <button className="key" value="i" onClick={keySubmit}>I</button>
          <button className="key" value="o" onClick={keySubmit}>O</button>
          <button className="key" value="p" onClick={keySubmit}>P</button>
          <button id="backspace" className="key" value="backspace" onClick={keySubmit}>Backspace</button>
        </div>
        <div id="row-2" className="row">
          <button className="key" value="a" onClick={keySubmit}>A</button>
          <button className="key" value="s" onClick={keySubmit}>S</button>
          <button className="key" value="d" onClick={keySubmit}>D</button>
          <button className="key" value="f" onClick={keySubmit}>F</button>
          <button className="key" value="g" onClick={keySubmit}>G</button>
          <button className="key" value="h" onClick={keySubmit}>H</button>
          <button className="key" value="j" onClick={keySubmit}>J</button>
          <button className="key" value="k" onClick={keySubmit}>K</button>
          <button className="key" value="l" onClick={keySubmit}>L</button>
          <button id="enter" className="key" value="enter" onClick={keySubmit}>Enter</button>
        </div>
        <div id="row-3" className="row">
          <button className="key" value="z" onClick={keySubmit}>Z</button>
          <button className="key" value="x" onClick={keySubmit}>X</button>
          <button className="key" value="c" onClick={keySubmit}>C</button>
          <button className="key" value="v" onClick={keySubmit}>V</button>
          <button className="key" value="b" onClick={keySubmit}>B</button>
          <button className="key" value="n" onClick={keySubmit}>N</button>
          <button className="key" value="m" onClick={keySubmit}>M</button>
          <button id="new-game" className="key" value="newgame" onClick={keySubmit}>New Game</button>
        </div>
      </div>
      {/* rule page pop up */}
      {ruleState === true ? <Rule /> : ''}
      {/* alert the word is too short */}
      {deficiency === true ? <AlertBoxdif setdeficiency={setdeficiency} msg={`pleace input ${type === 1 ? 6 : 7} characters`} ></AlertBoxdif> : ''}
      {/* alert to start the new game */}
      {enterState === true ? <AlertBoxenter setenterState={setenterState} msg={`Please click new game to restart the game`}></AlertBoxenter> : ''
      }
      {Word === true ? <AlertWord setWord={setWord} msg={`Please enter a valid word`}></AlertWord> : ''
      }
    </div >
  );
}