import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/user/';

class UserService {
  
  updateGmailMsg(msg,uid) {
    return axios.put(
      API_URL + 'updateGmailMsg',
      {
        email_message: msg,
        user_id: uid,
      },
      {
        headers: authHeader()
      }
    );
  }

  getGmailMsg(uid) {
    return axios.get(
      API_URL + 'getGmailMsg?id='+uid,
      {
        headers: authHeader()
      }
    );
  }
}

export default new UserService();
