import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../lib/supabase';

function Painel(){

    const nav = useNavigate();

    const [modal, setModal] = useState(false);
    const [users, setUsers] = useState([]);

    const [user, setUser] = useState({
        nome: '',
        email: '',
        senha: '',
        nascimento: ''
    });

    const [logged, setLogged] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [msg, setMsg] = useState('');


    useEffect(() => {

        loadLogged();
        loadUsers();

    }, []);


    async function loadLogged(){

        const {
            data: authData,
            error: authError
        } = await supabase.auth.getUser();


        if(authError || !authData.user){

            nav('/auth');
            return;

        }


        const {
            data: profile,
            error: profileError
        } = await supabase
            .from('profiles')
            .select('*')
            .eq(
                'user_id',
                authData.user.id
            )
            .single();


        if(profileError){

            console.log(profileError);
            return;

        }


        setLogged(profile);
    }


    async function loadUsers(){

        const {
            data,
            error
        } = await supabase
            .from('profiles')
            .select('*')
            .order('nome');


        if(error){

            console.log(error);
            return;

        }


        setUsers(data);
    }


    function openRegister(){

        setUser({
            nome: '',
            email: '',
            senha: '',
            nascimento: ''
        });

        setMsg('');
        setIsEdit(true);
        setModal(true);
    }


    function closeModal(){

        setModal(false);
        setIsEdit(false);
        setMsg('');

        setUser({
            nome: '',
            email: '',
            senha: '',
            nascimento: ''
        });
    }


    function updateUser(pUser){

        setUser({
            ...pUser,
            senha: ''
        });

        setIsEdit(false);
        setModal(true);
        setMsg('');
    }


    async function handleRegister(){

        setMsg('');


        /*
            Se user.id existe,
            significa que o usuário já existe no profiles.

            Então é UPDATE.
        */

        if(user.id){

            const {
                error
            } = await supabase
                .from('profiles')
                .update({
                    nome: user.nome,
                    nascimento: user.nascimento
                })
                .eq(
                    'id',
                    user.id
                );


            if(error){

                console.log(error);
                setMsg('Erro ao atualizar usuário.');
                return;

            }


            await loadUsers();

            closeModal();

            return;
        }



        /*
            Se não existe user.id,
            significa que é um novo usuário.

            Primeiro cadastramos no AUTH.
        */

        const {
            data: authData,
            error: authError
        } = await supabase.auth.signUp({

            email: user.email,

            password: user.senha

        });


        if(authError){

            console.log(authError);
            setMsg(authError.message);

            return;
        }


        /*
            O Supabase criou o usuário no:

            auth.users

            Agora pegamos o ID dele.
        */

        const authUser = authData.user;


        if(!authUser){

            setMsg('Não foi possível criar o usuário.');

            return;
        }


        /*
            Agora criamos manualmente o PROFILE.

            profiles.user_id
                    ↓
            auth.users.id
        */

        const {
            error: profileError
        } = await supabase
            .from('profiles')
            .insert({

                user_id: authUser.id,

                nome: user.nome,

                email: user.email,

                nascimento: user.nascimento

            });


        if(profileError){

            console.log(profileError);
            setMsg(profileError.message);

            return;
        }


        /*
            Busca novamente os usuários
            no banco.
        */

        await loadUsers();


        closeModal();
    }


    async function deleteUser(pUser){

        /*
            IMPORTANTE:

            Aqui estamos apagando somente o PROFILE.

            Para apagar também o usuário de auth.users,
            será necessário posteriormente utilizar
            uma Edge Function / Admin API.
        */

        const {
            error
        } = await supabase
            .from('profiles')
            .delete()
            .eq(
                'id',
                pUser.id
            );


        if(error){

            console.log(error);
            return;

        }


        await loadUsers();
    }


    async function handleLogout(){

        await supabase.auth.signOut();

        nav('/auth');
    }



    return(

        <div>

            <div className="flex items-center p-4">

                <h3>
                    Bem vindo, {logged?.nome}
                </h3>

                <button
                    onClick={handleLogout}
                    className="
                        ml-auto
                        bg-red-500
                        text-white
                        px-4
                        py-2
                        rounded-md
                    "
                >
                    Sair
                </button>

            </div>



            {modal && (

                <div
                    className="
                        fixed
                        flex
                        top-0
                        right-0
                        bottom-0
                        left-0
                        items-center
                        justify-center
                        bg-black/50
                        z-50
                    "
                >

                    <div
                        className="
                            relative
                            max-w-md
                            w-full
                            p-5
                            rounded-lg
                            shadow-md
                            flex
                            flex-col
                            bg-white
                        "
                    >


                        <button
                            type="button"
                            onClick={closeModal}
                            className="
                                absolute
                                top-0
                                right-0
                                px-2
                                rounded-full
                                cursor-pointer
                                bg-red-300
                            "
                        >
                            X
                        </button>



                        {user.id ? (

                            <h2>
                                Dados do usuário
                            </h2>

                        ) : (

                            <h2>
                                Cadastre um novo usuário
                            </h2>

                        )}


                        {msg && (

                            <p className="my-3 text-red-500">
                                {msg}
                            </p>

                        )}



                        {isEdit ? (

                            <form
                                className="flex flex-col"
                                onSubmit={(e) => {

                                    e.preventDefault();

                                    handleRegister();

                                }}
                            >


                                Nome:

                                <input
                                    value={user.nome || ''}
                                    onChange={(e) =>
                                        setUser({
                                            ...user,
                                            nome: e.target.value
                                        })
                                    }
                                    type="text"
                                    placeholder="Digite seu nome completo"
                                />



                                Email:

                                <input
                                    value={user.email || ''}
                                    onChange={(e) =>
                                        setUser({
                                            ...user,
                                            email: e.target.value
                                        })
                                    }
                                    disabled={!!user.id}
                                    type="email"
                                    placeholder="Digite o seu melhor email"
                                />



                                {!user.id && (

                                    <>
                                        Senha:

                                        <input
                                            value={user.senha || ''}
                                            onChange={(e) =>
                                                setUser({
                                                    ...user,
                                                    senha: e.target.value
                                                })
                                            }
                                            type="password"
                                            placeholder="Letra maiúscula e números"
                                        />
                                    </>

                                )}



                                Data de nascimento:

                                <input
                                    value={user.nascimento || ''}
                                    onChange={(e) =>
                                        setUser({
                                            ...user,
                                            nascimento: e.target.value
                                        })
                                    }
                                    type="date"
                                />



                                {user.id && (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsEdit(false)
                                        }
                                        className="
                                            mt-5
                                            text-black
                                            text-center
                                            rounded-md
                                            py-2
                                            bg-red-300
                                        "
                                    >
                                        Cancelar
                                    </button>

                                )}



                                <button
                                    type="submit"
                                    className="
                                        mt-5
                                        bg-primary
                                        text-white
                                        text-center
                                        rounded-md
                                        py-2
                                    "
                                >
                                    Salvar
                                </button>


                            </form>

                        ) : (

                            <>

                                <p>
                                    Nome: {user.nome}
                                </p>

                                <p>
                                    Email: {user.email}
                                </p>

                                <p>
                                    Data de Nascimento: {user.nascimento}
                                </p>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsEdit(true)
                                    }
                                    className="
                                        mt-5
                                        text-black
                                        text-center
                                        rounded-md
                                        py-2
                                        bg-yellow-500
                                    "
                                >
                                    Editar
                                </button>

                            </>

                        )}

                    </div>

                </div>

            )}



            <button
                type="button"
                onClick={openRegister}
                className="
                    rounded-full
                    bg-primary
                    text-white
                    px-4
                    py-3
                    fixed
                    bottom-0
                    right-0
                "
            >
                +
            </button>



            <table>

                <thead>

                    <tr>

                        <th>
                            Nome
                        </th>

                        <th>
                            Email
                        </th>

                        <th>
                            Ações
                        </th>

                    </tr>

                </thead>


                <tbody className="font-secundary">

                    {users.map((u) => (

                        <tr key={u.id}>

                            <td>
                                {u.nome}
                            </td>

                            <td>
                                {u.email}
                            </td>

                            <td>

                                <button
                                    type="button"
                                    className="
                                        cursor-pointer
                                        px-2
                                        mx-4
                                        hover:shadow
                                        shadow-md
                                        text-white
                                        rounded-full
                                        bg-green-500
                                    "
                                    onClick={() =>
                                        updateUser(u)
                                    }
                                >
                                    V
                                </button>


                                <button
                                    type="button"
                                    className="
                                        cursor-pointer
                                        px-2
                                        mx-4
                                        hover:shadow
                                        shadow-md
                                        text-white
                                        rounded-full
                                        bg-red-500
                                    "
                                    onClick={() =>
                                        deleteUser(u)
                                    }
                                >
                                    X
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

export default Painel;