import React from 'react';
import styled from 'styled-components';

const ContainerMenu = styled.div`
    flex-direction: column;
    display: flex;
    width: 20vw;
    height: 100vh;
    background-color: #467088;
`;

const Foto =styled.div`
    display:flex;
    border-radius:100%;
    aspect-ratio: 1;
    height: 15vh;
    background: white;
    float: left;
    position: relative;
`
const DivUser =styled.a`
    border-radius: 5%;
    display: flex;
    margin-top: 2vh;
    position: relative;
    margin-left: 1vw;
    margin-right: 1vw;
    border-bottom: 3px solid #d9d9d9;
    padding-bottom: 2vh;
`
const SpanNome =styled.span`
    left: 0.5vw;
    display: flex;
    position: relative;
    float: right;
    align-items: center;
    color: #FFF;
    font-family: Roboto;
    font-weight: lighter;
`
const SpanLink =styled.div`
    left: 2vw;
    color: #FFF;
    top: 5vh;
    height: 7vh;
    justify-content: space-between;
    display: flex;
    flex-direction: column;
    position: relative;
    font-family: Roboto;
    font-weight: 100;
    text-decoration: none;
`

const ContainerLinks = styled.div`
    flex-grow: 1;
    margin-top: 1vh;
`

const MenuA = styled.a`
    text-decoration: none;
    color: #FFF;
`
const LogoutButton = styled.button`
    font-size: unset;
    font-weight: 100;
    font-family: 'Roboto';
    bottom: 0px;
    position: relative;
    margin-bottom: 1vh;
    width: 6vw;
    border-radius: 2vh;
    border-style: none;
    height: 6vh;
    background-color: #D9D9D9;
    color: black;
    align-self: center;
    display: block;
`

const Menu = () => {
    return (
        <ContainerMenu>
            <DivUser href={''}>
                <Foto>
                </Foto>
                <SpanNome>
                    Lucas Gabriel Ladeira Monteiro 
                </SpanNome>
            </DivUser>
            <ContainerLinks>
                <SpanLink>
                    <MenuA href={''}>
                       Novo Chamado
                    </MenuA>
                </SpanLink>
                <SpanLink>
                    <MenuA href={''}>
                        Histórico de Chamados
                    </MenuA>
                </SpanLink>
                <SpanLink>
                    <MenuA href={''}>
                        Dano ao Patrimônio
                    </MenuA>
                </SpanLink>
            </ContainerLinks>
            <LogoutButton type="submit" value="Submit">
                Sair
            </LogoutButton>
        </ContainerMenu>
    );
  };
  
  export default Menu;