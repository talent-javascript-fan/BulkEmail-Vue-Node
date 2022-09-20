import { io } from 'socket.io-client';

class SocketioService {
  socket;
  constructor() {}

  setupSocketConnection(token) {
    this.socket = io('http://localhost:8080', {
      auth: {
        token,
      },
    });
    console.log(`socket connected...`);
  }

  notifyEmail(cb) {
    if (!this.socket) return(true);
    this.socket.on('mail_event', msg => {
      return cb(null, msg);
    });
  }
  
  sendEmail(msg, id) {
    if (this.socket) {
      this.socket.emit("mail_event", {
        msg: msg,
        uid: id
      });
    }
  }
  
  disconnect() {
    if(this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new SocketioService();