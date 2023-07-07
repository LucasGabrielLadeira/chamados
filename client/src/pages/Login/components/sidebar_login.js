import React from 'react';
import styled from 'styled-components';
import LogoImage from '../img/Logo.png'

const Container = styled.div`
  display: flex;
  float: right;
  width: 35%;
  height: 100vh;
  background-color: #467088;
`;

const LogoDiv = styled.div`
  position: relative;
  right: 30vh;
  align-self: center;
  background-color: #467088;
  border-radius: 100%;
  aspect-ratio: 1;
  height: 50vh;
`;

const Logo = styled.div`
  border-radius: 100%;
  box-shadow: 9px 13px 20px 0px #0000008c;
  background-image: url(${LogoImage});
  height: 100%;
  width: 100%;
  background-size: cover;
`;

const SpanLogin = styled.span`
  left: 5vh;
  display: block;
  margin-bottom: 5vh;
  position: relative;
  font-family: imperialscript;
  font-size: 96px;
  color: #fff;

`;

const FormLogin = styled.form`
  padding-top: 4vh;
  right: 25vh;
  position: relative;
`;

const Label = styled.label`
  display: block;
  width: 100%;
  font-family: imperialscript;
  font-size: 36px;
  color: #fff;
`
const Input = styled.input`
  margin-bottom: 3vh;
  width: 150%;
  border-radius: 2vh;
  border-style: none;
  height: 5vh;
`;

const SubmitButton = styled.button`
  background-color: ${(props) => props.color};
  margin-bottom: 1vh;
  width: 150%;
  border-radius: 2vh;
  border-style: none;
  height: 5vh;
  color: #FFF;
`;

const SidebarLogin = () => {
  return (
    <Container>
      <LogoDiv>
        <Logo/>
      </LogoDiv>
      <FormLogin>
      <SpanLogin>
        Login
      </SpanLogin>
        <Label>
          Usuário:
          <Input type="text" name="user" />
        </Label>
        <Label>
          Senha:
          <Input type="text" name="pass" />
        </Label>
        <SubmitButton color={'#d30000'} type="submit" value="Submit">
          Entrar
        </SubmitButton>
        <SubmitButton color={'#d30000'} type="submit" value="Submit">
          Novo Usuário
        </SubmitButton>
        <SubmitButton color={'#d30000'} type="submit" value="Submit">
          Recuperar Senha
        </SubmitButton>
      </FormLogin>
    </Container>
  );
};

export default SidebarLogin;