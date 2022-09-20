import { createStore } from "vuex";
import { auth } from "./auth.module";
import { email } from "./email.module";
const store = createStore({
  modules: {
    auth,
    email,
  },
});

export default store;
