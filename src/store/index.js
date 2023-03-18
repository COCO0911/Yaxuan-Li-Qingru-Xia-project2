import { createStore } from "redux";
function reducer (state = {
  /* 游戏难度 */
  type: localStorage.getItem('type') == null ? 0 : localStorage.getItem('type'),
  /* 规则弹框 */
  ruleState: false
}, action) {
  console.log(state)
  switch (action.type) {
    case "normal":
      localStorage.setItem('type', 1)

      return {
        type: 1,
        ruleState: state.ruleState
      }
    case "hard":
      localStorage.setItem('type', 2)
      return {
        type: 2,
        ruleState: state.ruleState
      }
    case "showruleState":
      console.log(state)
      return {
        type: state.type,
        ruleState: true
      }
    case "hideruleState":
      localStorage.setItem('type', 2)
      return {
        type: state.type,
        ruleState: false
      }
  }
  return state;
}
const store = createStore(reducer);
export { store };