import React, { useEffect } from 'react'
import pause from '../../assets/img/pause.svg'
import play from '../../assets/img/play.svg'
import './uploadFiles.scss'
import { useRef } from 'react'
import { useState } from 'react'
import { connect } from 'react-redux'
import reduxState from '../../Redux/state'
import reduxActions from '../../Redux/actions'


const VideoInModal = ({item, removeFileOnClient, files}) => {
    const refVideo = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)

    const videoPlay = () => {
        refVideo.current.play()
        refVideo.current.volume = '0.1'
    }
    const videoPause = () => {
        refVideo.current.pause()
    }

    useEffect(() => {
        refVideo.current.addEventListener('playing', () => {
            setIsPlaying(true)
        })
        refVideo.current.addEventListener('pause', () => {
            setIsPlaying(false)
        })
        
    }, [])


    return (
        <>
            <video className="file" alt={item.name} ref={refVideo} onClick={() => removeFileOnClient(files.filter(file => file.name !== item.name))}> 
                <source src={URL.createObjectURL(item)} />
            </video>
            {isPlaying ?
                <img src={pause} alt={1} className="videoButton" onClick={videoPause} /> :
                <img src={play} alt={1} className="videoButton" onClick={videoPlay} />
            }
        </>
    )
}

export default connect(reduxState, reduxActions)(VideoInModal)