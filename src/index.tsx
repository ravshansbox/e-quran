import localForage from 'localforage';
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

const SelectContainer = styled.div({
  display: 'flex',
  justifyContent: 'center',
  opacity: '0.5',
  position: 'absolute',
  width: '100%',
});

const Select = styled.select({
  ':active': {
    fontSize: '16px',
  },
});

const Img = styled.img({
  display: 'block',
  width: '100%',
});

const getBlob = async (page: string) => {
  const cachedBlob = await localForage.getItem<Blob>(page);
  if (cachedBlob !== null) {
    return cachedBlob;
  }
  const response = await fetch(`images/${page}.jpg`);
  const blob = await response.blob();
  await localForage.setItem(page, blob);
  return blob;
};

const pageObjectUrlMap = new Map<string, string>();

const getBlobObjectUrl = async (page: string) => {
  if (!pageObjectUrlMap.has(page)) {
    pageObjectUrlMap.set(page, URL.createObjectURL(await getBlob(page)));
  }
  return pageObjectUrlMap.get(page);
};

const Image = ({ page, onClick }) => {
  const [objectUrl, setObjectUrl] = React.useState<string>(null);

  React.useEffect(() => {
    getBlobObjectUrl(String(page)).then(setObjectUrl);
  }, [page]);

  return (
    <Img
      src={objectUrl}
      onClick={onClick}
      onLoad={() => window.scrollTo(0, 0)}
    />
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = React.useState(1);

  const handleClick = (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    const positionX = event.pageX - event.target['offsetLeft'];
    const ratio = positionX / event.target['width'];
    if (ratio < 0.25) {
      if (currentPage < 604) {
        setCurrentPage((page) => page + 1);
      }
    } else if (ratio > 0.75) {
      if (currentPage > 1) {
        setCurrentPage((page) => page - 1);
      }
    }
  };

  return (
    <Container>
      <SelectContainer>
        <Select
          value={currentPage}
          onChange={(event) => setCurrentPage(parseInt(event.target.value))}
        >
          {times(604).map((i) => (
            <option key={i + 1}>{i + 1}</option>
          ))}
        </Select>
      </SelectContainer>
      <Image page={currentPage} onClick={handleClick} />
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
