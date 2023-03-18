import logo from './logo.svg';
import './App.css';
import { Outlet, Link } from 'react-router-dom';

function App () {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default App;
