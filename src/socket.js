import io from 'socket.io-client';

const port = window.location.port === "3000" ? 8080: window.location.port;
const socket = io(`ws://${window.location.hostname}:${port}`, {
    transports:  ['websocket'],
    upgrade: false
});

export default socket;
