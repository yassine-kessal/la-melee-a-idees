import {action, computed, observable} from "mobx";
import {rebase} from "../helpers/firebase";

export class UserStore {

  // proprieties
  @observable
  id = null;

  @observable
  email = null;

  @observable
  displayName = null;

  @observable
  data = {};

  // computeds
  @computed
  get isAuthenticated() {
    return this.id !== null;
  }

  // actions
  @action
  async authenticate(user) {
    try {
      const data = await rebase.get('users', {
        context: this,
        query: (ref) => ref.where('user_id', '==', user.uid),
      });

      this.id = user.uid;
      this.email = user.email;
      this.displayName = user.displayName;
      this.data = data[0];

    } catch(error) {
      console.log('authentication database failed', error);
    }
  }

  @action
  logout() {
    this.id = null;
    this.email = null;
    this.displayName = null;
  }

}