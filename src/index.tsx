import React, { useState } from 'react';
import { render } from 'react-dom';
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
  opacity: '0.5',
  position: 'absolute',
});

const Image = styled.img({
  display: 'block',
  width: '100%',
});

const App = () => {
  const [isPageSelectVisible, setPageSelectVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageSelect = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setCurrentPage(parseInt(event.target.value));
  };

  const handleImageClick = (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>
  ): void => {
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
        <Select value={currentPage} onChange={handlePageSelect}>
          {times(604).map((item) => (
            <option key={item + 1}>{item + 1}</option>
          ))}
        </Select>
      )}
      <Image src={`images/${currentPage}.jpg`} onClick={handleImageClick} />
    </Container>
  );
};

render(
  <>
    <GlobalStyle />
    <App />
  </>,
  document.querySelector('#app')
);
