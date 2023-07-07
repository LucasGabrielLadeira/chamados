import React from 'react';
import Menu from '../components/menu';
import UserInit from './components/userinit';
import styled from 'styled-components';

const ContainerInicio = styled.div`
    display:flex;
`

const PagInicioUser = () => {
    return (
        <ContainerInicio>
            <Menu>
                
            </Menu>
            <UserInit>
            
            </UserInit>
        </ContainerInicio>
    );
  };
  
  export default PagInicioUser;