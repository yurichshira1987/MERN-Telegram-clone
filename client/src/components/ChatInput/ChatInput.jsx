import React, { useEffect, useState } from 'react'
import { SmileOutlined, AudioOutlined, CameraOutlined, SendOutlined } from '@ant-design/icons';
import './mainInput.scss'
import UploadFiles from '../UploadFiles/UploadFilesButton.jsx';
import { Picker } from 'emoji-mart'
import { connect } from 'react-redux';
import reduxState from '../../Redux/state.js'
import reduxActions from '../../Redux/actions'
import axios from 'axios'
import config from '../../utils/config.json'


navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia ||
    navigator.webkitGetUserMedia);

var mediaRecorder
var blob

const ChatInput = ({ setText, chatInputText, setShowEmoji, showEmoji, sendMessage, currentDialogId, token }) => {
    const [hoverUploadFiles, setHoverUploadFiles] = useState(null)
    const [isRecording, setIsRecording] = useState(false)
    const [audioMessage, setAudioMessage] = useState(null)

    var stylePicker = {
        picker: {
            position: 'absolute',
            bottom: '5px',
            left: '5px',
            borderRadius: '10px'
        }
    }
    const cancelAudioMessage = () => {
        setIsRecording(false)
        mediaRecorder.pause()
    }
    const stopAudioMessage = () => {
        setIsRecording(false)
        mediaRecorder.stop()
    }
    const sendAudioMessage = () => {
        var data = new FormData()
        data.append('file', audioMessage)
        axios.post(`${config.url}/upload_audio_message?dialogId=${currentDialogId}`, data, { headers: { Authorization: token } })
            .then(res => console.log(res))
    }
    const recordAudioMessage = () => {
        const params = { audio: true }
        const onSucces = (stream) => {
            mediaRecorder = new MediaRecorder(stream)
            mediaRecorder.start()
            mediaRecorder.ondataavailable = async (e) => {
                blob = new Blob([e.data], { 'type': 'audio/mp3' })
                setAudioMessage(blob)
            }
        }
        const onError = () => {
            console.log('audio message Error')
        }
        if (navigator.getUserMedia) {
            setIsRecording(true)
            navigator.getUserMedia(params, onSucces, onError)
        }
    }

    useEffect(() => {
        if (audioMessage) {
            sendAudioMessage()
        }
    }, [audioMessage])
    return (
        <>
            { currentDialogId ?
                <div className="chatInputWrapper" >
                    <div className="inputWrapper">
                        {!isRecording ?
                            <input
                                className='chatInput'
                                onChange={e => setText(e.target.value)}
                                placeholder='Написать сообщение...'
                                type="text"
                                value={chatInputText}
                                onMouseOver={() => showEmoji && setShowEmoji(false)}
                            />
                            :
                            <div className='audioMessageWrapper' onClick={cancelAudioMessage}>Отмена</div>
                        }
                    </div>
                    <div className="smilesIconWrapper">
                        {!isRecording ?
                            <div className="smilesIcon" onMouseOver={() => !showEmoji && setShowEmoji(true)}> <SmileOutlined /></div>
                            :
                            <>
                                <span className="recordingIcon"></span>
                                <div className="recordingTime">Идёт запись...</div>
                            </>
                        }
                    </div>
                    <div className="smilesWrapper">
                        <div className={"smiles " + (!showEmoji ? "smilesHide" : '')}>
                            <Picker
                                onSelect={emoji => setText(chatInputText + emoji.native)}
                                set='apple'
                                style={stylePicker.picker}
                                emojiSize={30}
                            />
                        </div>
                    </div>


                    <div className="sendsWrapper">
                        {!isRecording &&
                            <div className={'sendFile ' + (hoverUploadFiles && 'hoverUploadFiles')}>
                                <CameraOutlined />
                                <UploadFiles onMouse={() => setHoverUploadFiles(true)} outMouse={() => setHoverUploadFiles(false)} />
                            </div>
                        }
                        <div >
                            {!chatInputText && !isRecording ?
                                <AudioOutlined onClick={recordAudioMessage} />
                                : chatInputText && !isRecording ?
                                    <SendOutlined onClick={sendMessage} />
                                    : isRecording &&
                                    <SendOutlined className="iconSendAudioMess" onClick={stopAudioMessage} />
                            }
                        </div>

                    </div>
                </div>
                : <div style={{ height: '50px' }}></div>
            }
                           
        </>
    )
}



export default connect(reduxState, reduxActions)(ChatInput)
