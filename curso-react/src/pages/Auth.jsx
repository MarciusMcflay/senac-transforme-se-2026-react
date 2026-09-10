import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

function Auth(){

    /* const [variavel, funcaoAlteraVariavel] = useState('valor inicial'); */

    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [msg, setMsg] = useState("");

    const nav = useNavigate();

    function handleLogin(){
        const users =
            JSON.parse(localStorage.getItem('users')) || [];

        let user = users.find(u => {
            return u.email == email;
        });

        if(!user){
            setMsg("Usuário não encontrado.");
            return;
        }


        if(user.senha == pass){
            setMsg("Login realizado com sucesso.");
            
            localStorage.setItem(
                'logged',
                JSON.stringify(user)
            );

            nav('/painel');
        }else{

            setMsg("Senha incorreta.");

        }

    }


    return(

        <div className="h-full flex">

            <div
                className="
                    w-1/2
                    mx-auto
                    my-auto
                    p-4
                    bg-blue-100
                    rounded-lg
                    shadow-md
                    flex
                    flex-col
                "
            >

                <Link
                    to="/"
                    className="mb-5"
                >
                    Voltar
                </Link>


                <form className="flex flex-col">


                    <span>
                        {msg}
                    </span>


                    <span className="text-left">
                        Email:
                    </span>

                    <input
                        type="email"
                        value={email}
                        placeholder="Digite o seu email cadastrado"
                        onChange={(e) => setEmail(e.target.value)}
                    />


                    <span className="text-left">
                        Senha:
                    </span>

                    <input
                        type="password"
                        value={pass}
                        placeholder="Digite sua senha cadastrada"
                        onChange={(e) => setPass(e.target.value)}
                    />


                    <a
                        onClick={handleLogin}
                        className="
                            mt-5
                            bg-primary
                            text-white
                            text-center
                            rounded-md
                            py-2
                            cursor-pointer
                        "
                    >
                        Entrar
                    </a>


                </form>

            </div>

        </div>

    );

}

export default Auth;