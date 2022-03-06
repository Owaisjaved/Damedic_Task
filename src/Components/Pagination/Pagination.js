import React from 'react'
import './Pagination.css'
 const Pagination = ({repoPerPage,totalRepo,paginate}) => {
     const repoNumbers = [];
     for(let i =1; i<=Math.ceil(totalRepo/repoPerPage); i++){
         repoNumbers.push(i)
     }
  return (
    <nav>
        <ul className='pagination bg-dark'>
    {repoNumbers.map(number=>(
        <li key={number} className="page-item">
            <a onClick={()=>paginate(number)} href='#!' className='page-link'>
                {number}    
            </a>
        </li>
    ))}
        </ul>
    </nav>
  )
}

export default Pagination;