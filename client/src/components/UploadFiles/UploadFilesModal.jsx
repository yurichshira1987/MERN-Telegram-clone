import React from 'react'
import { connect } from 'react-redux'
import './uploadFiles.scss'
import { CloseOutlined } from '@ant-design/icons';
import reduxState from '../../Redux/state'
import reduxActions from '../../Redux/actions'
import VideoInModal from './VideoInModal'

class UploadFiles extends React.Component {


    render() {
        const { files, setShowUploadFilesModal, removeFiles, removeFileOnClient } = this.props
        
        return (
            <>
                {files.length > 0 &&
                    <div className='uploadFilesModalWrapper'>
                        <div className='uploadFilesModal'>
                            <div className='uploadFilesModalTop' >
                                <div>Отправить файлы</div>
                                <CloseOutlined className="uploadFilesModalClose" onClick={() => {
                                    setShowUploadFilesModal(false)
                                    removeFiles([])
                                }} />
                            </div>

                            <div className="files">
                                {files.map((item, i) => (
                                    <div className={"filesContainer"
                                        + (files.length === 1 ? " filesContainerOne" : '')
                                        + (files.length === 2 ? " filesContainerTwo" : '')
                                        + (files.length === 3 ? " filesContainerThree" : '')
                                        + (files.length === 4 ? " filesContainerFour" : '')} key={i}>

                                        {item.type !== 'video/mp4' ?
                                            <img className="file" src={URL.createObjectURL(item)} alt={item.name} onClick={() => removeFileOnClient(files.filter(file => file.name !== item.name))} />
                                            :
                                            <VideoInModal item={item} />
                                        }
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                }
            </>
        )
    }
}



export default connect(reduxState, reduxActions)(UploadFiles)