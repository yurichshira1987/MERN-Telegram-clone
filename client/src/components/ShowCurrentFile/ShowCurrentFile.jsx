import React from 'react'
import './showCurrentFile.scss'
import { connect } from 'react-redux'
import reduxActions from '../../Redux/actions'
import reduxState from '../../Redux/state'
import { NavLink } from 'react-router-dom'
import { RightOutlined, LeftOutlined, CloseOutlined } from '@ant-design/icons'
import config from '../../utils/config.json'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'

const ShowCurrentFile = (props) => {
    const { setShowFileModal, currentDialogId, setCurrentFileId, currentFileId, token, setCurrentFileInit,
        currentFileInit } = props

    const [filesArrayForSlider, setFilesArrayForSlider] = useState([])

    var indexInRight = filesArrayForSlider.findIndex(item => item._id === currentFileId) + 1
    var indexInLeft = filesArrayForSlider.findIndex(item => item._id === currentFileId) - 1

    const getIdForRightSlider = () => {
        if (filesArrayForSlider.length) {
            if (indexInRight < filesArrayForSlider.length) {
                return filesArrayForSlider[indexInRight]._id
            }
        }
    }
    const getIdForLeftSlider = () => {
        if (filesArrayForSlider.length) {
            if (indexInLeft >= (filesArrayForSlider.length - filesArrayForSlider.length)) {
                return filesArrayForSlider[indexInLeft]._id
            }
        }
    }

    const closeCurrentFile = () => {
        setShowFileModal(false)
        setCurrentFileId(null)
        setCurrentFileInit(null)
    }


    const getFileByFileId = async () => {
        await axios.get(`${config.url}/get_file_url?currentFileId=${currentFileId}`, { headers: { Authorization: token } })
            .then(res => setCurrentFileInit(res.data))
    }
    const getFilesByMessageId = async () => {
        await axios.get(`${config.url}/get_files_by_message_id?id=${currentFileInit.messageId}`, { headers: { Authorization: token } })
            .then(res => { setFilesArrayForSlider(res.data) })
    }

    useEffect(() => {
        getFileByFileId()
    }, [currentFileId])

    useEffect(() => {
        if (currentFileInit)
            getFilesByMessageId()
    }, [currentFileInit])
    return (
        <>
            <NavLink to={`/dialog/${currentDialogId}`}>
                <div className='current-file__shadow' onClick={closeCurrentFile}></div>
            </NavLink>
            <div className='current-file__wrapper'>

                <NavLink to={`/dialog/${currentDialogId}`}>
                    <div className="current-file__close" onClick={closeCurrentFile}>
                        <CloseOutlined />
                    </div>
                </NavLink>

                {indexInRight < filesArrayForSlider.length &&
                    <NavLink to={`/dialog/${currentDialogId}?file=${getIdForRightSlider()}`}>
                        <div className="current-file__right">
                            <RightOutlined />
                        </div>
                    </NavLink>
                }
                {indexInLeft >= (filesArrayForSlider.length - filesArrayForSlider.length) &&
                    <NavLink to={`/dialog/${currentDialogId}?file=${getIdForLeftSlider()}`}>
                        <div className="current-file__left">
                            <LeftOutlined className="current-file__left1" />
                        </div>
                    </NavLink>
                }

                <div className="current-file__file-wrapper">
                    {currentFileInit &&
                        <>
                            { currentFileInit.format !== "video/mp4" ?
                                    <img className='current-file' src={`${config.url}/${currentFileInit.src}`} alt="1" />
                                    :
                                    <CurrentVideo currentFileInit={currentFileInit} />
                            }
                        </>
                    }
                </div>
            </div>
        </>
    )
}

const CurrentVideo = ({ currentFileInit }) => {

    const refVideo = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(() => {
        if (currentFileInit) {
            refVideo.current.play()
            refVideo.current.volume = '0.2'

            refVideo.current.addEventListener('ended', () => {
                setIsPlaying(false)
            })
            refVideo.current.addEventListener('playing', () => {
                setIsPlaying(true)
            })
        }
    }, [currentFileInit])

    return (
        <video className='current-file' controls="controls" ref={refVideo} src={`${config.url}/${currentFileInit.src}`}></video>
    )
}

export default connect(reduxState, reduxActions)(ShowCurrentFile)