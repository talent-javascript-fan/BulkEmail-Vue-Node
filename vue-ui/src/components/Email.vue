<template>
  <div v-if="currentEmail" class="edit-form col-md-4">
    <form>
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="text"
          class="form-control"
          id="email"
          v-model="currentEmail.email"
        />
      </div>
    </form>

    <button class="badge badge-danger mr-2" @click="deleteEmail">
      Delete
    </button>

    <button type="submit" class="badge badge-success" @click="updateEmail">
      Update
    </button>
    <p>{{ message }}</p>
  </div>
</template>

<script>
import DataService from '../services/data.service';

export default {
  name: 'email',
  data() {
    return {
      currentEmail: null,
      message: ''
    };
  },
  methods: {
    getEmail(id) {
      DataService.get(id)
        .then((response) => {
          this.currentEmail = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    updateEmail() {
      DataService.update(this.currentEmail.id, this.currentEmail)
        .then((response) => {
          console.log(response.data);
          this.message = 'Updated successfully!';
        })
        .catch((e) => {
          console.log(e);
        });
    },

    deleteEmail() {
      DataService.delete(this.currentEmail.id)
        .then((response) => {
          console.log(response.data);
          this.$router.push({ name: 'emails' });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  },
  mounted() {
    this.message = '';
    this.getEmail(this.$route.params.id);
  }
};
</script>

<style>
.edit-form {
  max-width: 300px;
  margin: auto;
}

</style>
