import React from 'react'
import './avatar.scss'

export const Avatar = (avatar, username) =>{
    let char
    if(username) char = username.charAt(0).toUpperCase();

    let color = ''
    let charsEng = 'qwertyuiopasdfghjklzxcvbnm'
    let charsRus = 'йцукенгшщзхъфывапролджэячсмитьбю'
    let colors = ['#DDF5CB', '#FAA774', '#30A3E6', '#3AE2CE', '#FFDD00', '#B34EE9', '#4CCA40', '#3AE2CE', '#E25459' ]
    for(let i = 0; i < 9; i++){
        if(char === charsEng.substr(0, 7).charAt(i).toUpperCase()) color = colors[0]
        else if(char === charsEng.substr(7, 14).charAt(i).toUpperCase()) color = colors[1]
        else if(char === charsEng.substr(15, 22).charAt(i).toUpperCase()) color = colors[2]
        else if(char === charsEng.substr(23, charsEng.length ).charAt(i).toUpperCase()) color = colors[3]
        else if(char === charsRus.substr(0, 15).charAt(i).toUpperCase()) color = colors[4]
        else if(char === charsRus.substr(16, 30).charAt(i).toUpperCase()) color = colors[5]
        else if(char === charsRus.substr(31, 40).charAt(i).toUpperCase()) color = colors[6]
        else if(char === charsRus.substr(41, charsRus.length).charAt(i).toUpperCase()) color = colors[7]
        else if(!color) color = colors[8]
    }
    if(avatar){
        return(
            <div className='avatar'>
                <img src={avatar} alt="user"/>
            </div>
        )
    }else{      
        return(
            <div style={{background:color}} className='avatar'>
                <div>{char}</div>
            </div>
        )
    
    }
}
