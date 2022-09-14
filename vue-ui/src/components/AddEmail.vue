<template>
  <div class="submit-form col-md-4">
    <div v-if="!submitted">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="text"
          class="form-control"
          id="email"
          required
          v-model="email.email"
          name="email"
        />
      </div>

      <button @click="saveEmail" class="btn btn-success">Add New</button>
    </div>

    <div v-else>
      <button class="btn btn-success" @click="newEmail">Add More</button>
      <h4>Added successfully!</h4>
    </div>
  </div>
</template>

<script>
import DataService from '../services/data.service';

export default {
  name: 'add-email',
  data() {
    return {
      email: {
        id: null,
        email: '',
        password: ''
      },
      submitted: false
    };
  },
  methods: {
    saveEmail() {
      var data = {
        email: this.email.email
      };

      DataService.create(data)
        .then((response) => {
          this.email.id = response.data.id;
          console.log(response.data);
          this.submitted = true;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    newEmail() {
      this.submitted = false;
      this.email = {};
    }
  }
};
</script>

<style>
.submit-form {
  max-width: 300px;
  margin: auto;
}
</style>
