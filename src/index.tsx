import React from 'react';
import ReactDOM from 'react-dom';
import styled, { createGlobalStyle } from 'styled-components';

const times = (count: number, fn?: (i: number) => any) => {
  const result = new Array(count);
  for (let i = 0; i < count; i++) {
    result[i] = fn ? fn(i) : i;
  }
  return result;
};

const GlobalStyle = createGlobalStyle({
  body: {
    margin: 0,
  },
});

const Container = styled.div({
  position: 'relative',
});

const Select = styled.select({
  fontSize: '16px',
  opacity: '0.5',
  position: 'absolute',
});

const Image = styled.img({
  display: 'block',
  width: '100%',
});

const App = () => {
  const [isPageSelectVisible, setPageSelectVisible] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);

  const onClick = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    const positionX = event.pageX - event.target['offsetLeft'];
    const ratio = positionX / event.target['width'];
    if (ratio < 0.25) {
      if (currentPage > 1) {
        setCurrentPage((page) => page - 1);
      }
    } else if (ratio > 0.75) {
      if (currentPage < 604) {
        setCurrentPage((page) => page + 1);
      }
    } else {
      setPageSelectVisible((isPageSelectVisible) => !isPageSelectVisible);
    }
  };

  return (
    <Container>
      {isPageSelectVisible && (
        <Select
          value={currentPage}
          onChange={(event) => setCurrentPage(parseInt(event.target.value))}
        >
          {times(604).map((i) => (
            <option key={i + 1}>{i + 1}</option>
          ))}
        </Select>
      )}
      <Image
        src={`images/${currentPage}.jpg`}
        onClick={onClick}
        onLoad={() => window.scrollTo(0, 0)}
      />
    </Container>
  );
};

ReactDOM.render(
  <>
    <GlobalStyle />
    <App />
  </>,
  document.querySelector('#app')
);
