import React, { useState, useCallback, useEffect } from 'react'
import {FaBars, FaGithub, FaPlus, FaSpinner, FaTrash} from 'react-icons/fa'
import "./Home.css"

//import api
import api from "../../services/api"
import { Link } from 'react-router-dom'

const Home = () => {

  const [newRepo, setNewRepo] = useState("")
  const [repositorios, setRepositorios] = useState([])
  const [loading, setLoading] = useState(false)

  //Did Mount // Buscar
useEffect(() => {
  const repoStorage = localStorage.getItem('repos')
  if(repoStorage){
    setRepositorios(JSON.parse(repoStorage))
  }
}, [])


  // Did update // Salvar alterações
useEffect(() => {
  localStorage.setItem('repos', JSON.stringify(repositorios))
}, [repositorios])


  const handleSubmit = useCallback ((e) => {
    e.preventDefault();

    async function submit(){

      setLoading(true)

      try {

        if(newRepo === ""){
          throw new Error("Você precisa indicar um repositório!")
        }
            
        const response = await api.get(`repos/${newRepo}`)

        const hasRepo = repositorios.find(repo => repo.name === newRepo)

        if(hasRepo){
          alert("Este reposirório já existe")
          setNewRepo("")
          throw new Error("Repositório repetido")
        }

        const data = {
          name: response.data.full_name,
        }
        setRepositorios([...repositorios, data])
        setNewRepo("")    

      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
  }

    submit()
  
  }, [newRepo, repositorios, api])

  const handleDelete = useCallback((item) => {
    const find = repositorios.filter( r => r.name !== item)
    setRepositorios(find)
  }, [repositorios]);

  return (
    <div className='container'>   
      <h1>
      <FaGithub size={25}/>
        Meus repositórios
      </h1>
      <form onSubmit={handleSubmit} className='form'>
        <input
         type="text"
         placeholder='Adicionar repositórios'
         value={newRepo}
         onChange={(e) => setNewRepo(e.target.value)}
         />
        <button type='submit'  className='button' loading={loading ? 1: 0}>
          {loading ? (
            <FaSpinner color='#fff' size={14}/>
          ) : (
            <FaPlus color='#fff' size={14}/>
          )
          }
        </button>
      </form>
      <ul className='lista'>
        {repositorios.map(item => (
          <li key={item.name}>
            <span>
              <button className='delete' onClick={() => handleDelete(item.name)}>
                <FaTrash size={14}/>
              </button>
              {item.name}
            </span>
            <Link to={`/repositorio/${encodeURIComponent(item.name)}`}>
              <FaBars size={20}/>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Home
