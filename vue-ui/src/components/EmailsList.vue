<template>
  <div class="row">
    <div class="col-md-6">
      <div class="input-group mb-3">
        <input
          type="text"
          class="form-control"
          placeholder="Search by Email"
          v-model="email"
        />
        <div class="input-group-append">
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="search"
          >
            Search
          </button>
        </div>
      </div>
      <h4>List of Emails</h4>
      <p>(Please click an Email to Edit)</p>
      <ul class="list-group">
        <li
          class="list-group-item"
          :class="{ active: index == currentIndex }"
          v-for="(email, index) in emails"
          :key="index"
          @click="setActiveEmail(email, index)"
        >
          {{ email.email }}
        </li>
      </ul>
      <div class="edit-button">
        <button class="m-3 btn btn-sm btn-danger" @click="removeAllEmails">
          Remove All
        </button>
        <div v-if="currentEmail">
          <router-link
            :to="'/emails/' + currentEmail.id"
            class="badge badge-warning"
            >Edit</router-link
          >
        </div>
      </div>
    </div>
    <div class="col-md-1"></div>
    <div class="col-md-5 message-box">
      <textarea
        style="width: 100%;"
        placeholder="Write message here..."
        id="message"
        @input="updateForm('message', $event.target.value)"
        :value="form.message"
      ></textarea>
      <input type="checkbox" id="checkbox" @click="toggle" />
      Please synchronize G-mail to send the message.
      <input
        v-if="this.isAddedGmail"
        id="gmail"
        @input="updateForm('gmail', $event.target.value)"
        :value="form.gmail"
        placeholder="G-mail"
      />
      <input
        v-if="this.isAddedGmail"
        id="password"
        @input="updateForm('password', $event.target.value)"
        :value="form.password"
        type="password"
        placeholder="password"
      />
      <button
        class="md-3 btn btn-sm btn-success send-msg"
        @click="sendMsg"
        v-if="this.isAddedGmail"
      >
        Send Message
      </button>
    </div>
  </div>
</template>

<script>
import DataService from '../services/data.service';

export default {
  name: 'emails-list',
  data() {
    return {
      emails: [],
      currentEmail: null,
      currentIndex: -1,
      email: '',
      form: {
        gmail: '',
        password: '',
        message: ''
      },
      isAddedGmail: false
    };
  },
  methods: {
    updateForm(input, value) {
      this.form[input] = value;
      let storedForm = this.openStorage();
      if (!storedForm) storedForm = {};

      storedForm[input] = value;
      this.saveStorage(storedForm);
    },
    openStorage() {
      return JSON.parse(localStorage.getItem('form'));
    },
    saveStorage(form) {
      localStorage.setItem('form', JSON.stringify(form));
    },
    retrieveEmails() {
      DataService.getAll()
        .then((response) => {
          this.emails = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    refreshList() {
      this.retrieveEmails();
      this.currentEmail = null;
      this.currentIndex = -1;
    },

    setActiveEmail(email, index) {
      this.currentEmail = email;
      this.currentIndex = email ? index : -1;
    },

    removeAllEmails() {
      DataService.deleteAll()
        .then((response) => {
          console.log(response.data);
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    search() {
      DataService.findByTitle(this.email)
        .then((response) => {
          this.emails = response.data;
          this.setActiveEmail(null);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    toggle() {
      this.isAddedGmail = !this.isAddedGmail;
      console.log(this.isAddedGmail);
      console.log(JSON.parse(localStorage.getItem('form')).message);
      console.log(JSON.parse(localStorage.getItem('form')).gmail);
      console.log(JSON.parse(localStorage.getItem('form')).password);
    },

    sendMsg() {
      var data = {
        msgBody: JSON.parse(localStorage.getItem('form')).message,
        gmail: JSON.parse(localStorage.getItem('form')).gmail,
        pwd: JSON.parse(localStorage.getItem('form')).password,
      };

      DataService.transfer(data)
        .then((response) => {
          console.log(response);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  },
  mounted() {
    this.retrieveEmails();
  },
  created() {
    const storedForm = this.openStorage();
    if (storedForm) {
      this.form = {
        ...this.form,
        ...storedForm
      };
    }
  }
};
</script>

<style>
.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}
.badge {
  padding: 10px 30px !important;
}
.edit-button {
  display: flex;
}
.edit-button div {
  margin-top: 15px;
}
.message-box {
  padding-top: 125px;
}
.send-msg {
  display: block !important;
  margin-top: 20px;
}
textarea {
  height: auto;
}
#gmail,
#password {
  width: 50%;
  display: block;
  margin-bottom: 10px;
}
</style>
