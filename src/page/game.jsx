/*  */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useParams } from 'react-router-dom';
/* 頁面跳轉 */
import { useNavigate, Link } from "react-router-dom";
/* 顶部文字组件 */
import Inputbox from './inputbox'
/* 弹框组件 */
import AlertBoxenter from './alertboxenter'
/* 位数缺少提示 */
import AlertBoxdif from './alertboxdif'
/* 单词提示 */
import AlertWord from './alertword'
/* 规则弹框 */
import Rule from './rule'
export const FatherContext = React.createContext({});
export default function Game (props) {
  /* 获取存储在redux中的状态 */
  let type = Number(useSelector(state => state.type));
  /* 规则弹框显示隐藏 */
  let ruleState = useSelector(state => state.ruleState)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  /* 全局存储单词（正确答案） */
  const [targetWord, settargetWord] = useState(localStorage.getItem('targetWord') === null ? [] : JSON.parse(localStorage.getItem('targetWord')));
  /* 输入框输入的字符 */
  const [currentGuess, setcurrentGuess] = useState(localStorage.getItem('currentGuess') === null ? [] : JSON.parse(localStorage.getItem('currentGuess')));
  /* 结果列表 */
  const [guesslist, setguesslist] = useState(localStorage.getItem('guesslist') === null ? [] : JSON.parse(localStorage.getItem('guesslist')));
  /* 是否显示晃动css3效果 */
  const [shake, setshake] = useState(false);
  /* 防止重复点击提交 */
  const [enterclick, setenterclick] = useState(true);
  /* 位数缺少弹框 */
  const [deficiency, setdeficiency] = useState(false);
  /* 提示点击enter重新开始游戏弹框 */
  const [enterState, setenterState] = useState(false);
  /*提示单词是否有效 */
  const [Word, setWord] = useState(false);
  /* 页面初始化获取单词 */
  if (targetWord.length === 0) {
    getTargetWord();
  }

  const changeworldState = () => {
    let url = window.location.href;
    console.log(url);
    if (url.indexOf('normal') != -1) {
      /* 如果是简单的 */
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
      /* 如果是困难的 */
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
  /* 页面初始化调用 */
  useEffect(() => {
    /* 修改链接状态 */
    changeworldState()
  }, []);// eslint-disable-line
  /* 显示当前选择的难度 */
  function showDegree () {
    if (type === 1) {
      return 'normal'
    } else {
      return 'hard'
    }
  }
  /* 页面键盘点击事件绑定 */
  const keySubmit = (e) => {
    run(e.target.value)
  }
  /* 页面程序运行 */
  function run (val) {
    let size = type === 1 ? 6 : 7;/* 答题的次数 */
    let key = val
    var p = /^[A-Za-z]+$/;
    /* 如果输入的为26个英文字母 */
    if (p.test(key) && key.length === 1) {
      /* 追加字符 */
      if (currentGuess.length < size) {
        let guess = currentGuess;/* 当前的单词 */
        guess.push(key.toUpperCase());/* 追加键入的单词 */
        /* 设置输入框显示*/
        setcurrentGuess([...guess])
        /* 存储设定的单词 */
        localStorage.setItem('currentGuess', JSON.stringify(currentGuess))
      }
    } else if (key === "Backspace" || key === 'backspace') {
      /* 撤销键入 */
      let guess = currentGuess.slice(0, -1);
      /* 重置输入框显示*/
      setcurrentGuess(guess)
      localStorage.setItem('currentGuess', JSON.stringify(guess))
    } else if (key === "Escape" || key === "newgame") {
      /* 重新开始游戏 */
      newgame('restart')
    } else if (key === "Enter" || key === "enter") {
      /* 增加状态，防止重复点击提交 */
      if (enterclick === true) {
        setenterclick(false)
        /* 3秒后可以再次点击提交 */
        setTimeout(function () {
          setenterclick(true)
        }, 3000)
        if ((type === 1 && guesslist.length === 6) || (type === 2 && guesslist.length === 5)) {
          /* 游戏已结束,让用户重新开始 */
          setenterState(true)
        } else {
          /* 如果满足指定长度 */
          if (currentGuess.length === size) {
            /* 验证结果 */
            Validate()
            // /* 清空输入框字符显示 */
            // setcurrentGuess([])
            /* 清空本地存储输入框字符 */
            localStorage.setItem('currentGuess', JSON.stringify([]))
          } else {
            /* 输入不足指定位数 */
            setdeficiency(true)
          }
        }

      }
    }
  }
  /* 全部正确显示提示信息 */
  function newgame (state) {
    let result = ''
    /* 如果是全部答对，重新开始 */
    if (state === 'success') {
      result = window.confirm('Congratulations!  Would you like to try again?');
    } else if (state === 'restart') {
      // 如果是点击按钮重新开始
      result = window.confirm('Are you sure you want to restart the game?');
    }

    if (result === true) {
      localStorage.clear()
      /* 跳转首页，重新选择难度开始游戏 */
      navigate(`/home`);
    } else {

    }
  }
  /* 验证结果 */
  function Validate () {
    /* 验证是否为有效单词 */
    //Check if it is a valid english word
    fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${currentGuess.join('').toLocaleLowerCase()}`
    ).then((res) => {
      if (res.status == "404") {
        /* 左右晃动动画 */
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
  /* 添加数据到结果列表 */
  function addGuess (guess) {
    if (guess.length !== 0) {
      let guessdata = guesslist;
      guessdata.push(guess)
      setguesslist(guessdata)
      /* 更新输入框字符显示 */
      setcurrentGuess([])
      localStorage.setItem('guesslist', JSON.stringify(guesslist))
    }
    /* 开始新游戏 */
    // 如果列表没数据开始新游戏
    if (guesslist.length === 0 || guesslist === []) {
      restart();
      getTargetWord();
    } else {
    }
  }
  /* 验证结果 */
  async function checkSpelling () {
    // const response = await fetch(`https://trex-sandwich.com/ajax/word/${currentGuess.join('').toLocaleLowerCase()}`);
    //     const data = await response.json();
    const data = JSON.parse(localStorage.getItem('targetWord')).join('').toLocaleLowerCase()

    if (data === currentGuess.join('').toLocaleLowerCase()) {
      /* 回答正确 */
      let result = currentGuess.map((ele) => {
        let data = {
          data: ele,
          state: 'green'
        }
        return data;
      })
      /* 重置输入框显示 */
      restart()
      /* 添加数据到结果列表 */
      addGuess(result);
      /* 回答正确重新开始 */
      newgame('success')
    } else {
      /* 回答错误 */
      let result = [];
      currentGuess.forEach((ele, i) => {
        /* 相同且位置正确 */
        if (targetWord[i] === ele) {
          result.push({
            data: ele,
            state: 'green'
          })
        } else if (targetWord.indexOf(ele) !== -1 && targetWord[i] !== ele) {
          /* 存在但位置不正确 */
          result.push({
            data: ele,
            state: 'orange'
          })
        } else if (targetWord.indexOf(ele) === -1) {
          /* 不存在 */
          result.push({
            data: ele,
            state: 'gray'
          })
        }
      })

      /* 左右晃动动画 */
      setshake(true);
      setTimeout(function () {
        setshake(false);
        /* 添加数据到结果列表 */
        addGuess(result);
        /* 如果大于指定次数，需要重新开始游戏 */
        if ((type === 1 && guesslist.length === 6) || (type === 2 && guesslist.length === 5)) {
          let result = window.confirm(`Failure,The answer ${targetWord}, whether to restart the game?`);
          if (result === true) {
            localStorage.clear()
            /* 跳转首页，重新选择难度开始游戏 */
            navigate(`/home`);
          }
        }
      }, 2000)

    }

  }
  /* 全局获取初始化的单词 */
  async function getTargetWord () {
    const words = await getWords(1);
    settargetWord(words.word.toUpperCase().split(''))
    localStorage.setItem('targetWord', JSON.stringify(words.word.toUpperCase().split('')))
  }
  /* 重置输入的内容 */
  function restart () {
    let size = type === 1 ? 6 : 7;
    /* 更新输入框字符显示 */
    setcurrentGuess([])
    localStorage.setItem('currentGuess', JSON.stringify([]));
  };
  /* 获取单词接口 */
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
      {/* 规则弹框 */}
      {ruleState === true ? <Rule /> : ''}
      {/* 提示位数缺少弹框 */}
      {deficiency === true ? <AlertBoxdif setdeficiency={setdeficiency} msg={`pleace input ${type === 1 ? 6 : 7} characters`} ></AlertBoxdif> : ''}
      {/* 提示重新开始弹框 */}
      {enterState === true ? <AlertBoxenter setenterState={setenterState} msg={`Please click new game to restart the game`}></AlertBoxenter> : ''
      }
      {Word === true ? <AlertWord setWord={setWord} msg={`Please enter a valid word`}></AlertWord> : ''
      }
    </div >
  );
}