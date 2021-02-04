import React from 'react'
import './uploadFiles.scss'
import { connect } from 'react-redux'
import reduxState from '../../Redux/state.js'
import reduxActions from '../../Redux/actions'

const UploadFilesIcon = ({onMouse, outMouse, addFiles, setShowUploadFilesModal }) => {
 

    const hundleUpload = e => {
        const file = e.target.files[0]
        if(!file) {
            return
        } else{
            addFiles(e.target.files[0])
            setShowUploadFilesModal(true)
        } 
    }

        return(
            <div className='upload_files_wrapper'>
            <input id='upload_files'
                   type="file"
                   required multiple='multiple'
                   onChange={ hundleUpload }
                   accept='image/jpeg, image/png, video/mp4, audio/mp3'
            />

            <label htmlFor="upload_files"
                   onMouseOver={onMouse} 
                   onMouseOut={outMouse}
            ></label>
            </div>
    
        )
    }


export default connect(reduxState, reduxActions)(UploadFilesIcon)

