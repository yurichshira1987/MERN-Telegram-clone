import React, { useEffect, useRef, useState } from 'react'
import './audioMessage.scss'
// import wave from '../../assets/img/wave.svg'
import pause from '../../assets/img/pause.svg'
import play from '../../assets/img/play.svg'


export const AudioMessage = ({ src, isMe }) => {
    const [isPlaying, setIsPlyaing] = useState(false)
    const [progress, setProgress] = useState(0)
    const [current, setCurrent] = useState(0)
    const [duration, setDuration] = useState(0)
    const audioMessage = useRef(null)

    const getTime = number => {
        let mins = Math.floor(number / 60)
        let secs = (number % 60).toFixed()
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`
    }
    const audioPause = () => {
        audioMessage.current.pause()
    }
    const audioPlay = () => {
        audioMessage.current.play()
        audioMessage.current.volume = '0.1'

    }
    const audioGeneral = () => {
        audioMessage.current.onplaying = () => {
            setIsPlyaing(true)
        }
        audioMessage.current.onpause = () => {
            setIsPlyaing(false)
        }
        audioMessage.current.onended = () => {
            setIsPlyaing(false)
            setProgress(0)
            setCurrent(0)
        }
        audioMessage.current.ontimeupdate = () => {
            setCurrent(audioMessage.current.currentTime)
            setProgress((audioMessage.current.currentTime / audioMessage.current.duration) * 100)
            // console.log(audioMessage.current.duration)
        }
    }

    useEffect(() => {
        
        // audioMessage.current.ondurationchange = () => {
        //     if(audioMessage.current.duration !== Infinity)
        //         setDuration(audioMessage.current.duration)
        // }

        audioGeneral()

    }, [])


    return (
        <div className={"audio_message" + (isMe ? " me" : '')}>
            <audio preload="metadata" ref={audioMessage} src={src}  preload='auto'></audio>
            <div className="audio_progress" style={{ width: progress + '%' }}></div>
            <div className='audio_right'>
                {isPlaying ?
                    <div className="audio_button">
                        <img onClick={audioPause} src={pause} alt="pause" />
                    </div>
                    :
                    <div className="audio_button">
                        <img onClick={audioPlay} style={{ marginLeft: '3px' }} src={play} alt="play" />
                    </div>
                }
            </div>
            <div className="audio_left">
                <AudioWave />
                <div className="audio_time">{getTime(current) + (duration > 0 ? ' / ' + getTime(duration) : '')}</div>
            </div>
        </div>
    )
}

const AudioWave = () => {
    const [waveArray, setWaveArray] = useState([])

    const renderWave = () => {
        const preArray = []
        for (let i = 0; i < 35; i++) {
            let randomNumber = Math.floor(Math.random() * 25)
            preArray.push(randomNumber)
        }
        setWaveArray(preArray)
    }

    useEffect(() => {
        renderWave()
    }, [])

    return (
        <ul className='audioWave'>
            {waveArray.length && waveArray.map((item, i) => (
                <li key={i} style={{ height: `${item}px` }}></li>
            ))}
        </ul>
    )
}