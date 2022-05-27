import React from 'react'

import './style.css'
import NoImage from '../../static/images/no-image.jpg'

const CandidateItem = ({ name, onClick, index, canVote = true }) => {
  return (
    <div className='candidate-item'>
      <img src={NoImage} className='candidate-photo' />
      <span className='candidate-name'>{name || 'Não informado'}</span>

      {
        canVote && (
          <button className='btn-vote' onClick={() => onClick(index)}>Votar</button>
        )
      }
    </div>
  )
}

export default CandidateItem