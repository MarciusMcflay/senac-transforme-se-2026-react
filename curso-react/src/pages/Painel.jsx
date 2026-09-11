import { useState, useEffect } from 'react';
import {Link} from 'react-router';

function Painel(){
    const [modal, setModal ] = useState(false) //bollean
    const [users, setUsers] = useState([]) //vetor
    const [user, setUser] = useState({}) //objeto
    const [logged, setLogged] = useState({})
    const [isEdit, setIsEdit] = useState(false)
    const [index, setIndex] = useState(-1)

    useEffect(
        ()=>{
            const logged = JSON.parse(localStorage.getItem('logged'))
            setLogged(logged)
        },
        []
    );

    useEffect(()=>{
        const usersTemp = JSON.parse(localStorage.getItem('users')) 
        if(usersTemp) setUsers(usersTemp)
    },[])

    function deleteUser(index){
        const newUsers = users.filter((u, i) => {
            return i != index
        })

        setUsers(newUsers)
        localStorage.setItem('users', JSON.stringify(newUsers))
    }

    function updateUser(indice){
        setModal(true)
        setUser( users[indice] )
        setIndex(indice)
    }

    function handleRegister(){
        let newUsers
        if(index != -1){
            newUsers = [...users]
            newUsers[index] = user
        }else{
            newUsers = [...users, user]
        }

        setUsers(newUsers)
        localStorage.setItem('users', JSON.stringify(newUsers))

        setUser({})
        setModal(false)
        setIndex(-1)
        setIsEdit(false)
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
                <input value={user.nome} onChange={ (e) => setUser({...user, nome: e.target.value }) } type="text" placeholder="Digite seu nome completo" />
                Email:
                <input value={user.email} onChange={ (e) => setUser({...user, email: e.target.value }) }  type="email" placeholder="Digite o seu melhor email" />
    
                Senha:
                <input onChange={ (e) => setUser({...user, senha: e.target.value }) }  type="password" placeholder="Letra maiúscula e números" />
                Data de nascimento:
                <input value={user.nascimento} onChange={ (e) => setUser({...user, nascimento: e.target.value }) }  type="date" />
       
                { index != -1 && (
                <a onClick={()=> setIsEdit(false)} 
                    className="mt-5 text-black text-center 
                    rounded-md py-2 bg-red-300"
                >
                    Cancelar
                </a>
                )
                }

                <a onClick={handleRegister} 
                    className="mt-5 bg-primary text-white text-center rounded-md py-2"
                >
                    Salvar
                </a>
            </form>): //else 
            (
                <>
                  <p> Nome: {user.nome}</p>
                  <p> Email: {user.email}</p>
                  <p> Data de Nascimento: {user.nascimento}</p>
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
}} 
    className="rounded-full bg-primary text-white 
    px-4 py-3 fixed bottom-0 right-0"> + </a>

    <table>
        <thead>
            <th>Nome</th>
            <th>Email</th>
            <th>Ações</th>
        </thead>
        <tbody className="font-secundary">
            {users.map( (u,i) => (
                <tr>
                    <td>{u.nome}</td>
                    <td>{u.email}</td>
                    <td>
                        <a className='cursor-pointer
                                       px-2
                                       mx-4
                                       hover:shadow
                                       shadow-md
                                       text-white
                                       rounded-full
                                       bg-green-500'
                            onClick={()=> updateUser(i)}
                        >V</a>
                        <a className='cursor-pointer
                                       px-2
                                       mx-4
                                       hover:shadow
                                       shadow-md
                                       text-white
                                       rounded-full
                                       bg-red-500'
                            onClick={()=> deleteUser(i)}
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