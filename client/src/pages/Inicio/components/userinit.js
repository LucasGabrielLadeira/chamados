import React from 'react';
import styled from 'styled-components';
import FaqItem from './faqitem';

const Faq = styled.div`
    text-decoration: none;
    color: #FFF;
`
const FaqContainer = styled.div`
    margin-top: 2vh;
    flex-grow: 1;
`;

const SpanFaq = styled.span`
    display: block;
    position: relative;
    text-align: center;
    font-family: Roboto;
    font-weight: 100;
`;

const UserInit = () => {
    return (
        <FaqContainer>
            <SpanFaq>
                Perguntas Frequentes
            </SpanFaq>
            <Faq>
                <FaqItem>
                </FaqItem>
            </Faq>
        </FaqContainer>

    );
  };
  
  export default UserInit;