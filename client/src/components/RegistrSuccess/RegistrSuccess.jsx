import React from 'react'
import { NavLink } from 'react-router-dom'
import './registrSucces.scss'

export default (props) => {

    return (

        <div className="auth succes">
            <div className='startBlock'>
                <div className="form">

                    {props.img}
                    <h1>{props.heading}</h1>
                    <p>{props.text}</p>
                    <NavLink to='/'><p style={{ fontSize: '24px', color: '#0496ED' }}>{props.route}</p></NavLink>
                </div>
            </div>
        </div>

    )
}