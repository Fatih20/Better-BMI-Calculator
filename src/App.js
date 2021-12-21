import logo from './logo.svg';
import './App.css';

import Body from './components/body';
import Header from './components/header';

import {GlobalTransition} from './GlobalComponent';

function App() {
  return (
    <>
      <GlobalTransition />
      <Header />
      <Body />
    </>
  );
}

export default App;
