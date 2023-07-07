import React from "react";
import styled from "styled-components";

const FaqItemBox=styled.div`
    padding: 3vh;
    box-shadow: 1px 0px 10px 0px #00000080;
`;

const FaqItemTitle=styled.div`
    color:#000;
`;

const FaqItemText=styled.div`
    color:#000;
    display: none;
    height: 0;
`;

const FaqItem = () => {
    return (
        <FaqItemBox>
            <FaqItemTitle>
                Assunto
            </FaqItemTitle>
            <FaqItemText>
                Lorem Ypsulom
            </FaqItemText>
        </FaqItemBox>

    );
  };
  
  export default FaqItem;