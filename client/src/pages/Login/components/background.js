import React from 'react';
import styled from 'styled-components';
import background_image from '../img/2228834.jpg';

const Image = styled.div `

    background-size: 100% 100%;
    flex-direction: column;
    display: table;
    float: left;
    width: 65%;
    background-image: url(${background_image});
    height: 100vh;
`
const SpanBackground = styled.span `
  text-align: center;
  vertical-align: middle;
  height: 100%;
  backdrop-filter: brightness(0.5) blur(0.6px);
  display: table-cell;
  width: 100%;
  align-items: center;
  font-family: imperialscript;
  font-size: 130px;
  color: #fff;
`

const Background = () => {
  return (
    <Image>
        <SpanBackground>
          Chamados
        </SpanBackground>
    </Image>
  );
};

export default Background;