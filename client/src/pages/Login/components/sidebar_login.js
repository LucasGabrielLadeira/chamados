import React from 'react';
import Logo from '../img/Logo.png';

const SidebarLogin = () => {
  return (
    <container class="bg-[#467088] h-screen w-4/12 flex flex-row grow">
      <div class="rounded-full flex aspect-square bg-[#467088] h-1/2 absolute align-middle top-1/4 inset-y-0 end-1/4">
        <img class="object-cover w-full h-full" src={Logo} alt=""/>
      </div>
        <form>
        <div>
            <label htmlFor="title">Usuário</label>
            <input 
            />
        </div>
        <div>
            <label htmlFor="title">Senha</label>
            <input 
            />
        </div>
        </form>
    </container>
  );
};

export default SidebarLogin;