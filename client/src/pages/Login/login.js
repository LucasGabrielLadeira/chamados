import React from 'react';
import Background from './img/Background.png';
import SidebarLogin from './components/sidebar_login';

const Login = () => {
  return (
    <container class="flex">
    <div class="h-screen content-center flex-row w-8/12 grow">
      <span class="font-imperial text-9xl">Chamados</span>
      <img class="object-cover absolute -z-50 w-full h-full" src={Background} alt=""/>
    </div>
    <SidebarLogin/>
    </container>
  );
};

export default Login;