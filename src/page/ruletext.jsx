
import React, { useEffect } from 'react';

export default function Ruletext (props) {
  // 子向父传值
  const { setMaking } = props;
  const changeState = (event) => {
    setMaking(false)
  };
  useEffect(() => {
    // document.title = `Hello, ${props.name}`;
  }, []);

  return (
    <div className='RuleBox'>
      <ul>
        <li>1.Enter a 5-letter word</li>
        <li>2.Check the tile colors.
          <br></br>- A green tile indicates that you've guessed the correct letter in the correct place in the word
          <br></br>- A yellow tile means you've guessed a letter that's in the word, but not in the right spot
          <br></br>- A gray tile means that letter is not in today's word
        </li>
        <li>3.Guess another word
          <br />- If you correctly guessed a letter at the correct position (a green tile), make sure to use that letter at that position in your second guess.
          <br />- Letters can appear more than once in the same word

        </li>
        <li>4.Continue entering your guesses until all letters are green</li>
      </ul>
    </div>
  );
}