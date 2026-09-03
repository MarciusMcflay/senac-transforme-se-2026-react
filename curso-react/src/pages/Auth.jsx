import { useState } from 'react';
import {Link} from 'react-router';

function Auth(){
    /*const [variavel, funcaoAlteraVariavel] = useState('valor inicial');*/
    const [email, setEmail] = useState("")
    

    return(
<div className="h-full flex">
    <div className="w-1/2 mx-auto my-auto p-4 bg-blue-100 rounded-lg shadow-md flex flex-col">
        <Link to="/" className="mb-5">Voltar</Link>

        <form className="flex flex-col">
            <span className="text-left">Email: </span>
            <input 
                type="email" 
                value={email}
                placeholder="Digite o seu email cadastro"
                onChange={(e) => setEmail(e.target.value)}
            />
            {email}
            
            <span className="text-left">Senha: </span>
            <input id="iPassLogin" type="password" placeholder="Digite sua senha cadastrada" />
            
            <a  id="btLogin"  className="mt-5 bg-primary text-white text-center rounded-md py-2">Entrar</a>
        </form>
    </div>
</div>
    )
}

export default Auth;