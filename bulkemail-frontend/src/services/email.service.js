import axios from 'axios';
import authHeader from './auth-header';


const API_URL = 'http://localhost:8080/api/email/';

class EmailService {
  
  addEmail(user,user_id) {
    return axios.post(
      API_URL + 'addEmail',
      {
        email: user.email,
        user_id: user_id
      },
      {
        headers: authHeader()
      }
    );
  }

  getEmails(title, user_id) {
    return axios.get(
      API_URL + "?email="+title+ "&user_id=" +user_id,
      {
        headers: authHeader()
      }
    ).then(response => {
      return response.data;
    });
  }
  
  getEmail(user_id, email_id) {
    return axios.get(
      API_URL + user_id + '/' + email_id,
      {
        headers: authHeader()
      }
    );
  }

  updateEmail(user, user_id, email_id) {
    return axios.put(
      API_URL + 'update',
      {
        email: user.email,
        user_id: user_id,
        email_id: email_id
      },
      {
        headers: authHeader()
      }
    );
  }

  deleteEmail(user_id, email_id) {
    return axios.post(
      API_URL + 'deleteEmail',
      {
        user_id: user_id,
        email_id: email_id
      },
      {
        headers: authHeader()
      }
    );
  }

  syncGmail(user,user_id) {
    return axios.post(
      API_URL + 'syncGmail',
      {
        gmail: user.gmail,
        gmail_pass: user.gmail_pass,
        user_id: user_id
      },
      {
        headers: authHeader()
      }
    );
  }

  getGmail(user_id) {
    return axios.get(
      API_URL + "getGmail/"+user_id,
      {
        headers: authHeader()
      }
    );
  }

  removeAll(id) {
    return axios.post(
      API_URL + "removeAll",
      {
        user_id: id
      },
      {
        headers: authHeader()
      }
    );
  }

  sendMessage(user, user_id) {

    return axios.post(
      API_URL + "sendMessage",
      {
        message: user.email_message,
        user_id: user_id,
      },
      {
        headers: authHeader()
      }
    );
  }

}

export default new EmailService();
