import React, { useEffect, useState } from 'react'
import "./Repositorio.css"
//Hooks
import { Link, useParams } from 'react-router-dom';

//Api
import api from '../../services/api';
import { FaArrowAltCircleLeft } from 'react-icons/fa';

const Repositorio = () => {

  const [repo, setRepo] = useState({})
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  //Pegando o id pela url
  const { id } =  useParams();

  useEffect(()=> {

    async function load(){
      const nomeRepo = id

      const [repositData, issuesData] = await Promise.all([
        api.get(`/repos/${nomeRepo}`),
        api.get(`/repos/${nomeRepo}/issues`, {
          params: {
            state: 'open',
            per_page: 5
          }
        })
      ]);

      setRepo(repositData.data)
      setIssues(issuesData.data)
      setLoading(false)

    }

    load()

  }, [id])

  useEffect(()=> {

    async function loadIssue(){
      const nomeRepo = id

      const res = await api.get(`/repos/${nomeRepo}/issues`, {
        params:{
          state: 'open',
          page: page,
          per_page: 5,
        },
      });

      setIssues(res.data)

    } 

    loadIssue()

  }, [id, page])

  const handlePage = (action) => {
    setPage(action === 'back' ? page -1 : page +1)
  }

  if(loading){
    return(
      <div className='load'>
        <h1>Carregando...</h1>
      </div>
    )
  }

  return (
    <div className="contRep">
      <Link to="/" className='buttonRep'>
        <FaArrowAltCircleLeft color='#000' size={35}/>
      </Link>
      <header className='owner'>
        <img
         src={repo.owner.avatar_url}
         alt={repo.owner.login}
        />
        <h1 className='h1Rep'>{repo.name}</h1>
        <p className='pRepo'>{repo.description}</p>
      </header>

      <ul className='issus'>
        {issues.map((item) => (
          <li key={String(item.id)} className='liRep'>
            <img
            className='imgRep'
             src={item.user.avatar_url}
             alt={item.user.login}
            />

            <div className='divRepMap'>
              <strong className='strongRep'>
                <a className='aRep' href={item.html_url}>{item.title}</a>
                {item.labels.map((label) => (
                  <span key={label.id} className='spanRep'>{label.name}</span>
                ))}
              </strong>
              <p className='pLogin'>{item.user.login}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className='divButtons'>
        <button
         className='bb'
         type='button'
         onClick={()=> handlePage('back')}
         disabled={page < 2}
         >
          Voltar
        </button>
        <button className='bb' type='button' onClick={()=> handlePage('next')}>
          Proximo
        </button>
      </div>
    </div>
  )
}

export default Repositorio;
