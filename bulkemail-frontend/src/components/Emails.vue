<template>
  <div class="container">
    <div class="row">
        
        <div class="col-md-12" v-if="message">
          <div class="alert alert-danger alert-dismissible fade show" role="alert">
            {{ message }}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>
        <div class="col-sm">
          <div class="input-group mb-3">
            <input type="text" class="form-control" placeholder="Search Email" aria-label="Search Email" aria-describedby="button-addon2" v-model="title">
            <button class="btn btn-outline-secondary" type="button" id="button-addon2" @click="searchEmail">Search</button>
          </div>
          <h3>List of Emails</h3>
          <span>(Please click an Email to Edit)</span>
          <ul class="list-group">
            <li class="list-group-item" v-for="(item, index) in emails" :key="index">
              <span v-if="is_edit != item.id" @click="editEmail(item.id, item.email)">{{item.email}}</span>
              <Form @submit="handleUpdateEmail" :validation-schema="schema" v-if="is_edit == item.id">
                <div class="form-group">
                  <Field name="email"  type="email" class="form-control" v-model="email" />
                  <ErrorMessage name="email" class="error-feedback" />
                </div>
                <div class="form-group">
                  <button class="btn btn-primary btn-block" :disabled="loading">
                    <span
                      v-show="loading"
                      class="spinner-border spinner-border-sm"
                    ></span>
                    <span>Update</span>
                  </button>
                </div>

                <div class="form-group">
                  <div v-if="message" class="alert alert-danger" role="alert">
                    {{ message }}
                  </div>
                </div>
              </Form>
              <a v-if="is_edit != item.id" href="#" @click="handleDelete(item.id)" alt="Delete">
                <font-awesome-icon icon="trash" />
              </a>
            </li>
          </ul>
          {{' '}}
          <button type="button" class="btn btn-danger" @click="removeAllEmails">Remove All</button>
        </div>
        <div class="col-sm">
          <div class="input-group mb-3"></div>
          <h3>Add new</h3>
          <add-email @refreshList="onRefreshList" />
        </div>
        <div class="col-sm">
          <div class="input-group mb-3"></div>
          <h3>Send Message</h3>
          <add-gmail />
          <Form @submit="handleSendMessage" :validation-schema="schema">
            <div class="form-group">
              <label for="email_message">Message</label>
              <Field as="textarea" name="email_message" class="form-control" v-model="email_message" />
              <ErrorMessage name="email_message" class="error-feedback" />
            </div>
            <div class="form-group">
              <button class="btn btn-primary btn-block">
                <span
                  v-show="loading"
                  class="spinner-border spinner-border-sm"
                ></span>
                <span>Send Message</span>
              </button>
            </div>
          </Form>
        </div>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import addEmail from "./addEmail";
import addGmail from "./addGmail";
import * as yup from "yup";
import UserService from "../services/user.service";
import SocketioService from '../services/socketio.service.js';

// static data only for demo purposes, in real world scenario, this would be already stored on client

export default {
  name: 'Emails',
  components: {
    Form,
    Field,
    ErrorMessage,
    addGmail,
    addEmail
  },
  created() {
    if(this.currentUser)
      SocketioService.setupSocketConnection(this.currentUser.accessToken);
  },
  beforeUnmount() {
    SocketioService.disconnect();
  },
  data() {
    const schema = yup.object().shape({
      email: yup
        .string()
        .required("Email is required!")
        .email("Email is invalid!")
        .max(50, "Must be maximum 50 characters!"),
      email_message: yup
        .string()
        .required("Message is required!")
    });
    return {
      loading: false,
      is_edit: 0,
      email: "",
      emails: [],
      message: "",
      schema,
      title: "",
      email_message: "",
      socket: {},
      messages: []
    };
  },
  watch: {
    email_message(newEmailMessage) {
      this.updateGmailMsg(newEmailMessage);
    },
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push('/login');
    } else {
      this.getEmails();
      this.getGmailMsg();
      SocketioService.notifyEmail((err, data) => {
        this.message = data;
      });
    }
  },
  methods: {
    incrementIndex(key) {
        return key + 1;
    },
    handleEdit(id) {
      this.$router.push("/edit-email/"+id);
    },
    handleDelete(id) {
      if(confirm("Do you really want to delete?")){
        this.loading = true;
        this.$store.dispatch("email/deleteEmail", {
            user_id: this.$store.state.auth.user.id,
            email_id: id
          }).then(
            () => {
              this.message = "Email deleted successfully";
              this.loading = false;
              this.getEmails();
            },
            (error) => {
              this.loading = false;
              this.message =
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString();
            }
          );
      }
    },
    handleUpdateEmail(user) {
      this.$store.dispatch("email/updateEmail", {
          user,
          user_id: this.$store.state.auth.user.id,
          email_id: this.is_edit
        }).then(
          () => {
            this.is_edit = 0;
            this.email = "";
            this.getEmails();
          },
          (error) => {
            this.loading = false;
            this.message =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
          }
        );
    },
    editEmail(id, email) {
      this.is_edit = id;
      this.email = email;
    },
    getEmails() {
      this.$store.dispatch("email/getEmails", { title: this.title, user_id: this.$store.state.auth.user.id}).then(response => {
          this.emails = response;
        },
        (error) => {
          this.loading = false;
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    },
    searchEmail() {
      this.getEmails();
    },
    removeAllEmails() {
      if(confirm("Do you really want to delete?")){
        this.$store.dispatch("email/removeAll", this.$store.state.auth.user.id).then(()=> {
          this.getEmails();
          },
          (error) => {
            this.loading = false;
            this.message =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
          }
        );
      }
    },
    handleSendMessage(user) {
      this.message = "Sending emails is in process...";
      // this.loading = true;
      SocketioService.sendEmail(user.email_message, this.$store.state.auth.user.id);
      /*this.$store.dispatch("email/sendMessage", { user, user_id: this.$store.state.auth.user.id}).then(
        (data) => {
          this.message = data.message;
          this.successful = true;
          this.loading = false;
          SocketioService.sendEmail(user.email_message, this.$store.state.auth.user.id);
        },
        (error) => {
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          this.successful = false;
          this.loading = false;
        }
      );*/
    },
    onRefreshList() {
      this.getEmails();
    },
    updateGmailMsg(msg) {
      UserService.updateGmailMsg(msg,this.$store.state.auth.user.id).then(
        (response) => {
          // this.content = response.data;
          console.log(response.data);
        },
        (error) => {
          this.content =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    },
    getGmailMsg() {
      UserService.getGmailMsg(this.$store.state.auth.user.id).then(
        (response) => {
          if(response.data.email_message) this.email_message = response.data.email_message;
        },
        (error) => {
          this.content =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    }
  },
};
</script>