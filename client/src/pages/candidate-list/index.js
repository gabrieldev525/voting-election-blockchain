import React, { useState, useEffect } from 'react'
import CandidateItem from '../../components/candidate-item'
import Header from '../../components/header'

import './style.css'

const CandidateList = ({ contract, accounts, web3 }) => {
  const [candidates, setCandidates] = useState([])
  const [winners, setWinners] = useState([])
  const [isFinished, setIsFinished] = useState(false)


  useEffect(() => {
    if(!web3 || !accounts || !contract)
      return

    (async () => {
      await getCandidates()

      const isFinished = await getIsFinished()
      setIsFinished(isFinished)

      if(isFinished) {
        await getWinners()
      }
    })()
  }, [web3, accounts, contract])

  const getCandidates = async () => {
    try {
      const candidates = await contract.methods.getCandidates().call()
      setCandidates(candidates)
    } catch(err) {
      alert('Aconteceu um erro ao tentar buscar os candidatos')
    }
  }

  const handleClickVote = async (index) => {
    if(!web3 || !accounts || !contract)
      return

    let response
    try {
      response = await contract.methods.vote(index).send({ from: accounts[0] })
    } catch(err) {
      console.log('Aconteceu um erro na transação: ', err)

      if('message' in err && err.message.indexOf('Already voted') != -1) {
        alert('Você só pode votar uma vez')
      }
      return
    }

    if(!response) {
      alert('Nenhuma resposta obtida')
      return
    }

    if(response.transactionHash) {
      alert('Voto computado com sucesso')
    }
    console.log(response)
  }

  const getIsFinished = async () => {
    let isFinished
    try {
      isFinished = await contract.methods.isFinished().call()
    } catch(err) {
      alert('Não foi possível obter a informação do andamento da votação')
      return
    }

    setIsFinished(isFinished)

    return isFinished
  }

  const getWinners = async () => {
    let response
    try {
      response = await contract.methods.winnerName().call()
    } catch(err) {
      alert('Aconteceu um erro na transação')
      return
    }

    if(!response) {
      alert('Não foi possível obter o vencedor')
      return
    }

    setWinners(response.winners_.map(winner => winner.name))
  }

  const finishContractVoting = async () => {
    try {
      await contract.methods.finishVoting().send({ from: accounts[0] })
    } catch(err) {
      console.log('Aconteceu um erro ao tentar encerrar a votação no contrato: ', err)

      if('message' in err && err.message.indexOf('Already finished') != -1) {
        alert('A votação está encerrada!')
        return
      }

      alert('Não foi possível finalizar a votação no contrato')
      return
    }

    alert('Votação finalizada com sucesso.')
    setIsFinished(true)
  }

  const handleClickFinishVoting = async () => {
    if(!web3 || !contract || !accounts)
      return

    const isFinished = await getIsFinished()
    if(isFinished) {
      alert('A Votação já está finalizada')
      return
    }

    await finishContractVoting()
    await getWinners()
  }

  console.log(winners)

  return (
    <div className='container'>
      <Header />

      <div className='candidate-list'>
        {candidates.map((candidate, index) => (
          <CandidateItem
            onClick={handleClickVote}
            name={candidate.name}
            index={index}
            canVote={!isFinished} />
        ))}
      </div>

      {
        !isFinished && (
          <div>
            <button onClick={handleClickFinishVoting}>Encerrar Votação</button>
          </div>
        )
      }

      {
        winners.length > 1 ? (
          <p>Deu empate</p>
        ) : winners.length == 1 ? (
          <p>O ganhador foi o {winners[0]}</p>
        ) : isFinished && (
          <p>A votação foi encerrada sem nenhum voto computado</p>
        )
      }

      {
        winners && winners.length > 1 && (
          <>
            <h4>Empate entre:</h4>
            {
              winners.map((winner) => {
                return (
                  <p>{winner}</p>
                )
              })
            }
          </>
        )
      }
    </div>
  )
}

export default CandidateList