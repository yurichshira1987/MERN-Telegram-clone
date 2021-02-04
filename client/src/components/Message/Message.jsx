import React from 'react'
// import formatDistanceToNow from "date-fns/formatDistanceToNow"
// import ruLocale from "date-fns/locale/ru"
import { MoreOutlined, SettingOutlined } from '@ant-design/icons';
import './message.scss'
import { Typing } from '../Typing/Typing'
import { Avatar } from '../Avatar/Avatar.jsx'
import { AudioMessage } from '../AudioMessage/AudioMessage'
import read from '../../assets/img/read.svg'
import unread from '../../assets/img/unread.svg'
import { isToday, format } from 'date-fns/'
import reduxActions from '../../Redux/actions'
import reduxState from '../../Redux/state'
import { connect } from 'react-redux'
import config from '../../utils/config.json'
import axios from 'axios'
import Attachments from '../Attachments/Attachments'
// import song from '../../assets/audio/song.mp3'



class Message extends React.Component {
    constructor(props) {
        super(props)
        this.inputChange = React.createRef()

        this.state = {
            showEllipsisMessageModal: false,
            showEllipsisMessage: { display: 'none' },
            showChangeTextInput: false,
            messageTextChangeValue: this.props.text
        }
    }
    componentDidMount = () => {
        window.addEventListener('keydown', e => {
            if (e.keyCode === 27) this.setState({ showEllipsisMessageModal: false })
            if (e.keyCode === 27) this.setState({ showEllipsisMessage: { display: 'none' } })
        })
    }
    getDate = (date) => {
        if (isToday(date)) {
            return format(date, 'H:mm')
        } else {
            return format(date, 'dd.MM.yy')
        }
    }
    deleteMessage = async () => {
        await axios.delete(`${config.url}/delete_message?id=${this.props.id}`, { headers: { Authorization: this.props.token } })
        this.setState({ showChangeTextInput: false, showEllipsisMessageModal: false, showEllipsisMessage: { display: 'none' } })
    }
    changeMessage = async () => {
        await axios.put(`${config.url}/change_message?id=${this.props.id}`, { value: this.state.messageTextChangeValue }, { headers: { Authorization: this.props.token } })
        this.setState({ showChangeTextInput: false, showEllipsisMessage: { display: 'none' } })
    }
    hideEllipsisMessage = () => {
        if (this.state.showEllipsisMessageModal) return
        this.setState({ showEllipsisMessage: { display: 'none' } })
    }
    showEllipsisMessage = () => {
        this.setState({ showEllipsisMessage: { display: 'block' } })
    }
    render() {
        const { date, userName, text, audioSrc, isMe, attachments, avatar, readed, typing, colorName  } = this.props
        const { showEllipsisMessageModal, showEllipsisMessage, messageTextChangeValue  } = this.state

        return (
            <div className={'message ' + (isMe ? 'isMe' : '') + ' showEllipsisMessage'}
                onMouseOver={this.showEllipsisMessage}
                onMouseOut={this.hideEllipsisMessage} >
                <div className='messageWrapper'>
                    <div className="avatarMessage">
                        {Avatar(avatar, userName)}
                    </div>
                    <div className="messageContentWrapper">
                        <div className="messageContent">
                            {!typing &&
                                <div className="messageHeader">
                                    <div className="userName" style={{color:colorName}}>{userName}</div>
                                    <div className='date'>
                                        <span className='dateAndReaded'>
                                            {this.getDate(new Date(date))}
                                            <div className="readedItem">
                                                {isMe ?
                                                    readed ?
                                                        <img src={read} alt={1}></img>
                                                        :
                                                        <img src={unread} alt={1}></img>
                                                    : null

                                                }
                                            </div>
                                        </span>

                                    </div>
                                </div>
                            }
                            {text &&
                                <div className='messageTextWrapper'>
                                    {!this.state.showChangeTextInput ?
                                        <p className='messageText'>{text}</p>                                
                                        :
                                        <div>
                                            <input className='messageTextChangeInput'
                                                onChange={e => this.setState({ messageTextChangeValue: e.target.value })}
                                                value={messageTextChangeValue}
                                                type="text"
                                                ref={this.inputChange} />
                                            <div className='messageTextChangeItems'>
                                                <span onClick={() => {
                                                    this.changeMessage()
                                                }}
                                                >Сохранить</span>
                                                <span onClick={() => {
                                                    this.setState({ showChangeTextInput: false })
                                                }}
                                                >Отмена</span>
                                            </div>
                                        </div>
                                    }
                                </div>
                            }
                            {audioSrc &&
                                <div className="audio_message_wrapper">
                                    <AudioMessage isMe={isMe} src={`${config.url}/${audioSrc}`} />  
                                    {/* <AudioMessage isMe={isMe} src='http://localhost:5000/uploads/audio/1611346935636.mp3'/> */}
                                </div>
                            }
                            {attachments.length > 0 &&
                                <div className="attachments">
                                    <Attachments attach={attachments} />
                                </div>
                            }
                            {typing && !isMe &&
                                <div className="typing">
                                    <Typing />
                                </div>
                            }
                        </div>
                        {isMe ?
                            <div className='ellipsisMessageWrapper'>

                                <MoreOutlined className='ellipsisMessage'
                                    style={showEllipsisMessage}
                                    onClick={() => this.setState({ showEllipsisMessageModal: !showEllipsisMessageModal })} />


                                {showEllipsisMessageModal &&
                                    <ul className="ellipsisMessageModal">
                                        <li onClick={this.deleteMessage} >Удалить</li>
                                        {text &&
                                            < li onClick={() => {
                                                this.setState({
                                                    showChangeTextInput: true,
                                                    showEllipsisMessageModal: false
                                                })
                                                setTimeout(() => { this.inputChange.current.focus() }, 10)
                                            }}>Изменить</li>
                                        }
                                    </ul>
                                }

                            </div>
                            :
                            <div className='ellipsisMessageWrapper'>
                                <SettingOutlined className='ellipsisMessage'
                                    style={showEllipsisMessage}
                                    onClick={() => this.setState({ showEllipsisMessageModal: !showEllipsisMessageModal })} />
                                {showEllipsisMessageModal &&
                                    <ul className="ellipsisMessageModal ElMessPartner">
                                        <li>Пожаловаться</li>
                                    </ul>
                                }
                            </div>
                        }
                    </div>
                </div>
            </div >

        )
    }
}

export default connect(reduxState, reduxActions)(Message)





