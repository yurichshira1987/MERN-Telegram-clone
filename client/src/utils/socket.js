

import io from 'socket.io-client'
import config from './config.json'

const socket = io(config.url, {transports: ['websocket']})
export default socket
