<template>
  <p v-if="!gmail"><input type="checkbox" @change="handleSyncGmail($event)" v-model="gSyncChecked" /> Please synchroinze G-Mail to send the message.</p>
  <div class="gsync-info" v-else>
    <p>
      <span>Syncronized G-Mail account: {{gmail}}<br />Click</span>{{' '}}
      <a class="#" @click="changeGSyncAccount">Here</a> <span>to change your account.</span>
    </p>
  </div>
  <Form v-if="openGsyncBox" @submit="handleAddEmail" :validation-schema="schema">
    <div class="form-group">
      <label for="gmail">Gmail Account</label>
      <Field name="gmail"  type="email" class="form-control" v-model="gmail" />
      <ErrorMessage name="gmail" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="gmail_pass">Gmail Password</label>
      <Field name="gmail_pass"  type="password" class="form-control" v-model="gmail_pass" />
      <ErrorMessage name="gmail_pass" class="error-feedback" />
    </div>
    <div class="form-group">
      <button class="btn btn-primary btn-block" :disabled="loading">
        <span
          v-show="loading"
          class="spinner-border spinner-border-sm"
        ></span>
        <span>Sync G-Mail</span>
      </button>
    </div>
    <div class="form-group">
      <div v-if="message" class="alert alert-danger" role="alert">
        {{ message }}
      </div>
    </div>
  </Form>
</template>

<script>
/* eslint-disable no-useless-escape */
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default {
  name: "addGmail",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      gmail: yup
        .string()
        .required("Email is required!")
        .matches(/^[\w.+\-]+@gmail\.com$/, "Only gmail accounts are allowed for this field")
        .email("Email is invalid!")
        .max(50, "Must be maximum 50 characters!"),
      gmail_pass: yup.string().required("Password is required!"),
    });

    return {
      loading: false,
      message: "",
      successful: "",
      gmail: "",
      gmail_pass: "",
      schema,
      openGsyncBox: false,
      gSyncChecked: false,
      gSyncStatus: false,
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  mounted() {
    if (!this.loggedIn) {
      this.$router.push("/login");
    } else {
        this.$store.dispatch("email/getGmail", this.$store.state.auth.user.id).then(response => {
          console.log(response);
          this.gmail = response.gmail;
          this.gmail_pass = '';
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
  methods: {
    handleAddEmail(user) {
      this.message = "";
      this.successful = false;
      this.loading = true;

      this.$store.dispatch("email/syncGmail", { user, user_id: this.$store.state.auth.user.id}).then(
        (data) => {
          this.message = data.message;
          this.successful = true;
          this.loading = false;
          this.openGsyncBox = false;
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
      );
      
    },
    handleSyncGmail(e) {
      // console.log(e.target.checked, this.GsyncChecked);
      if(e.target.checked) {
        this.openGsyncBox = true;
      } else {
        this.openGsyncBox = false;
      }
    },
    changeGSyncAccount() {
      this.openGsyncBox = true;
    }
  },
};
</script>

<style scoped>
label {
  display: block;
  margin-top: 10px;
}

.card-container.card {
  max-width: 350px !important;
  padding: 40px 40px;
}

.card {
  background-color: #f7f7f7;
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  margin-top: 50px;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}

.profile-img-card {
  width: 96px;
  height: 96px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}

.error-feedback {
  color: red;
}
</style>
