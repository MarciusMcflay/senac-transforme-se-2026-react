import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';

function Painel(){
    const [modal, setModal ] = useState(false) //bollean
    const [users, setUsers] = useState([]) //vetor
    const [user, setUser] = useState({}) //objeto
    const [logged, setLogged] = useState({})
    const [isEdit, setIsEdit] = useState(false)
    const [index, setIndex] = useState(-1)

    const [spiner, setSpiner] = useState(false)
    const [msg, setMsg] = useState('')

    useEffect(
        ()=>{
            const logged = JSON.parse(localStorage.getItem('logged'))
            setLogged(logged)
        },
        []
    );

    useEffect(()=>{
        loadUsers()
    },[]);

    //READ - LER
    async function loadUsers(){
        const {data, error} = await supabase.from('profiles').select('*')
        if(error){
            setMsg(error.message)
            return;
        } 

        setUsers(data)
    }

    async function editUser(){
        setSpiner(true)
        const { data, error } = await supabase
            .from('profiles')
            .update(user)
            .eq('id', index);

        if(error){
            setMsg(error.message)
            setSpiner(false)
            return;
        }

        setMsg("Usuario editado")
        setSpiner(false)
        loadUsers()
    }

    function deleteUser(index){
        
    }

    function updateUser(user){
        setModal(true)
        setUser( user )
        setIndex(user.id)
    }

    async function handleRegister(){
        setSpiner(true)
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: user.email,
            password: user.password
        });

        if(authError){
            setMsg(authError.message)
            setSpiner(false)
            return;
        }

        if(!authData){
            setMsg("Não foi possível cadastrar, verifique a internet")
            setSpiner(false)
            return;
        }

        const { 
            data: loginData, error: loginError 
        } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: user.password
        });

        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                ...user,
                user_id: loginData.user.id
            });

        if(profileError){
            setMsg(profileError.message);
            setSpiner(false)
            return;
        }

        loadUsers()
        setSpiner(false)
        setMsg('Usuário cadastro com sucesso')
    }

    return(
<div>
    <h3>Bem vindo, {logged?.nome}</h3>

{ modal && (
    <div 
        className="fixed flex top-0 right-0 bottom-0 
            left-0 items-center justify-center bg-black/50 z-50">

        <div className="relative max-w-md w-full p-5 bg-about rounded-lg 
            shadow-md flex flex-col bg-white">

            <a onClick={()=>{
                setModal(false)
                setIsEdit(false)
                setUser({})
                setIndex(-1)
            }}
                className="bg-prices absolute top-0 right-0 px-2 
                rounded-full cursor-pointer">
                X
            </a>

            <h2>Cadastre um novo usuário</h2>
            <p>Preencha as informações abaixo</p>
            
            
            { isEdit ? (
            <form className="flex flex-col">
                Nome:
                <input value={user.full_name} onChange={ (e) => setUser({...user, full_name: e.target.value }) } type="text" placeholder="Digite seu nome completo" />
                
                {index == -1 && (
                    <>
                        Email:
                        <input value={user.email} onChange={ (e) => setUser({...user, email: e.target.value }) }  type="email" placeholder="Digite o seu melhor email" />
                    
                        Senha:
                        <input onChange={ (e) => setUser({...user, password: e.target.value }) }  type="password" placeholder="Letra maiúscula e números" />
                    </>
                )}
                Data de nascimento:
                <input value={user.birth} onChange={ (e) => setUser({...user, birth: e.target.value }) }  type="date" />

                CPF:
                <input value={user.cpf} onChange={ (e) => setUser({...user, cpf: e.target.value }) }  type="text" />
       
                { index != -1 && (
                <a onClick={()=> setIsEdit(false)} 
                    className="mt-5 text-black text-center 
                    rounded-md py-2 bg-red-300"
                >
                    Cancelar
                </a>
                )
                }

                <a onClick={ 
                        () => {
                            if(index == -1)
                                handleRegister()
                            else
                                editUser()
                        }
                    } 
                    className="mt-5 bg-primary text-white text-center rounded-md py-2"  
                >
                    {spiner? '...':'Salvar'}
                </a>

                {msg}

            </form>): //else 
            (
                <>
                  <p> Nome: {user.full_name}</p>
                  <p> CPF: {user.cpf}</p>
                  <p> Data de Nascimento: {user.birth}</p>
                  <a onClick={()=> setIsEdit(true)} className="mt-5 bg-primary text-black text-center rounded-md py-2 bg-yellow-500">Editar</a>
                </>    
            )
            }

        </div>
    </div>
)}

<a onClick={() => {
    setModal(true)
    setIsEdit(true)
    setMsg('')
}} 
    className="rounded-full bg-primary text-white 
    px-4 py-3 fixed bottom-0 right-0"> + </a>

    <table>
        <thead>
            <th>Nome</th>
            <th>CPF</th>
            <th>Ações</th>
        </thead>
        <tbody className="font-secundary">
            {users.map( (u) => (
                <tr key={u.id} >
                    <td>{u.full_name}</td>
                    <td>{u.cpf}</td>
                    <td>
                        <a className='cursor-pointer
                                       px-2
                                       mx-4
                                       hover:shadow
                                       shadow-md
                                       text-white
                                       rounded-full
                                       bg-green-500'
                            onClick={()=> updateUser(u)}
                        >V</a>
                        <a className='cursor-pointer
                                       px-2
                                       mx-4
                                       hover:shadow
                                       shadow-md
                                       text-white
                                       rounded-full
                                       bg-red-500'
                            onClick={()=> deleteUser(u)}
                        >X</a>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>

</div>
    )
}

export default Painel;