import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import './attachments.scss'
import reduxState from '../../Redux/state'
import reduxActions from '../../Redux/actions'
import play from '../../assets/img/play.svg'
import config from '../../utils/config.json'
import { useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons';


class UploadFiles extends React.Component {

    render() {
        const { attach, currentDialogId } = this.props
        return (

            <div className='attachmentsChat'>

                <div className="files">
                    {attach.map((item, i) => (
                        <div className={"filesContainer"
                            + (attach.length === 1 ? " filesContainerOne" : '')
                            + (attach.length === 2 ? " filesContainerTwo" : '')
                            + (attach.length === 3 ? " filesContainerThree" : '')
                            + (attach.length === 4 ? " filesContainerFour" : '')} key={i}>
                            {item.format !== "video/mp4" ?
                                <NavLink className="navLink" to={`/dialog/${currentDialogId}?file=${item._id}`}>
                                    <ImageInChat item={item} />
                                </NavLink>
                                :
                                <NavLink className="navLink" to={`/dialog/${currentDialogId}?file=${item._id}`}>
                                    <VideoInChat item={item} />
                                </NavLink>
                            }
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}


const ImageInChat = ({ item }) => {
    const refImage = useRef(null)
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        refImage.current.onload = () => {
            setIsLoading(true)
        }
    }, [])
    return (
        <>
                <img  style={{display: !isLoading? 'none': 'block'}} className="file" ref={refImage} src={`${config.url}/${item.src}`} alt={'Load..'} />
                {!isLoading && <div className="fileIsLoading"> < LoadingOutlined/> </div>}
        </>
    )
}


const VideoInChat = ({ item }) => {
    const refVideo = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        
        refVideo.current.oncanplaythrough = () => {
            setIsLoading(true)
        }
    

        // refVideo.current.play()
        // refVideo.current.volume = '0'

        // refVideo.current.addEventListener('ended', () => {
        //     setIsPlaying(false)
        // })
        // refVideo.current.addEventListener('playing', () => {
        //     setIsPlaying(true)
        // })

    }, [])
    return (
        <>           
                    <video preload='auto' className="file" ref={refVideo} alt={1} src={`${config.url}/${item.src}`}></video>
                    { !isLoading && <div className="fileIsLoading"> < LoadingOutlined/> </div>}
                    { !isPlaying && <img src={play} /> }
        </>
    )
}



export default connect(reduxState, reduxActions)(UploadFiles)