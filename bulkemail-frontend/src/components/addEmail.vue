<template>
  <div class="col-md-12">
    <div class="container">
      <Form @submit="handleAddEmail" :validation-schema="schema">
        <div class="form-group">
          <label for="email">Email</label>
          <Field name="email"  type="email" class="form-control" v-model="email" />
          <ErrorMessage name="email" class="error-feedback" />
        </div>
        <div class="form-group">
          <button class="btn btn-primary btn-block" :disabled="loading">
            <span
              v-show="loading"
              class="spinner-border spinner-border-sm"
            ></span>
            <span v-if="email_id">Update</span>
            <span v-else>Add</span>
          </button>
        </div>

        <div class="form-group">
          <div v-if="message" class="alert alert-danger" role="alert">
            {{ message }}
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default {
  name: "addEmail",
  emits: ["refreshList"],
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      email: yup
        .string()
        .required("Email is required!")
        .email("Email is invalid!")
        .max(50, "Must be maximum 50 characters!")
    });

    return {
      loading: false,
      message: "",
      email: "",
      email_id: 0,
      schema,
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
      if(this.$route.params.id)
      {
        this.$store.dispatch("email/getEmail", { user_id: this.$store.state.auth.user.id, email_id: this.$route.params.id }).then(response => {
          this.email = response.data.email;
          this.email_id = response.data.id;
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
    }
  },
  methods: {
    handleAddEmail(user) {
      this.loading = true;
      if(this.email_id) {
        this.$store.dispatch("email/updateEmail", {
          user,
          user_id: this.$store.state.auth.user.id,
          email_id: this.email_id
        }).then(
          () => {
            this.$router.push("/emails");
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
      } else {
        this.$store.dispatch("email/addEmail", { user, user_id: this.$store.state.auth.user.id}).then(
          (res) => {
            this.loading = false;
            this.message = res.message;
            this.$emit("refreshList", "someValue");
            // this.$router.push("/emails");
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
