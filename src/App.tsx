import styled from "styled-components";

import Body from './components/body';
import Header from './components/header';

import {GlobalTransition} from './GlobalComponent';

const Main = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

function App() {
  return (
    <Main>
      <GlobalTransition />
      <Header />
      <Body />
    </Main>
  );
}

export default App;
