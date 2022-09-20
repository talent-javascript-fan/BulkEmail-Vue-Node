import EmailService from '../services/email.service';

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export const email = {
  namespaced: true,
  state: initialState,
  actions: {
    addEmail({ commit }, {user, user_id}) {
      return EmailService.addEmail(user, user_id).then(
        response => {
          commit('addEmailSuccess');
          return Promise.resolve(response.data);
        },
        error => {
          commit('addEmailFailure');
          return Promise.reject(error);
        }
      );
    },
    getEmails({ commit }, { title, user_id}) {
      return EmailService.getEmails(title, user_id).then(
        response => {
          commit('getEmailSuccess');
          return Promise.resolve(response);
        },
        error => {
          commit('getEmailFailure');
          return Promise.reject(error);
        }
      );
    },
    getEmail({ commit }, { user_id, email_id }) {
      return EmailService.getEmail(user_id, email_id).then(
        response => {
          commit('getEmailSuccess');
          return Promise.resolve(response);
        },
        error => {
          commit('getEmailFailure');
          return Promise.reject(error);
        }
      );
    },
    updateEmail({ commit }, { user, user_id, email_id }) {
      return EmailService.updateEmail(user, user_id, email_id).then(
        response => {
          commit('updateEmailSuccess');
          return Promise.resolve(response);
        },
        error => {
          commit('updateEmailFailure');
          return Promise.reject(error);
        }
      );
    },
    deleteEmail({ commit }, { user_id, email_id }) {
      return EmailService.deleteEmail(user_id, email_id).then(
        response => {
          commit('deleteEmailSuccess');
          return Promise.resolve(response);
        },
        error => {
          commit('deleteEmailFailure');
          return Promise.reject(error);
        }
      );
    },
    getEmailByTitle({ commit }, title) {
      return EmailService.getEmailBytitle(title).then(
        response => {
          commit('getEmailSuccess');
          return Promise.resolve(response);
        },
        error => {
          commit('getEmailFailure');
          return Promise.reject(error);
        }
      );
    },
    syncGmail({ commit }, {user, user_id}) {
      return EmailService.syncGmail(user, user_id).then(
        response => {
          commit('syncGmailSuccess');
          return Promise.resolve(response.data);
        },
        error => {
          commit('syncGmailFailure');
          return Promise.reject(error);
        }
      );
    },
    getGmail({ commit }, user_id) {
      return EmailService.getGmail(user_id).then(
        response => {
          commit('getGmailSuccess');
          return Promise.resolve(response.data);
        },
        error => {
          commit('getGmailFailure');
          return Promise.reject(error);
        }
      );
    },
    removeAll({ commit }, user_id) {
      return EmailService.removeAll(user_id).then(
        response => {
          commit('removeAllSuccess');
          return Promise.resolve(response.data);
        },
        error => {
          commit('removeAllFailure');
          return Promise.reject(error);
        }
      );
    },
    sendMessage({ commit }, {user, user_id}) {
      return EmailService.sendMessage(user, user_id).then(
        response => {
          commit('sendMessageSuccess');
          return Promise.resolve(response.data);
        },
        error => {
          commit('sendMessageFailure');
          return Promise.reject(error);
        }
      );
    },
  },
  mutations: {
    addEmailSuccess(state) {
      state.status.addEmail = true;
    },
    addEmailFailure(state) {
      state.status.addEmail = false;
    },
    getEmailSuccess(state) {
      state.status.getEmail = true;
    },
    getEmailFailure(state) {
      state.status.getEmail = false;
    },
    updateEmailSuccess(state) {
      state.status.updateEmail = true;
    },
    updateEmailFailure(state) {
      state.status.updateEmail = false;
    },
    deleteEmailSuccess(state) {
      state.status.deleteEmail = true;
    },
    deleteEmailFailure(state) {
      state.status.deleteEmail = false;
    },
    syncGmailSuccess(state) {
      state.status.syncGmail = true;
    },
    syncGmailFailure(state) {
      state.status.syncGmail = false;
    },
    getGmailSuccess(state) {
      state.status.getGmail = true;
    },
    getGmailFailure(state) {
      state.status.getGmail = false;
    },
    removeAllSuccess(state) {
      state.status.removeAll = true;
    },
    removeAllFailure(state) {
      state.status.removeAll = false;
    },
    sendMessageSuccess(state) {
      state.status.sendMessage = true;
    },
    sendMessageFailure(state) {
      state.status.sendMessage = false;
    }
  }
};
