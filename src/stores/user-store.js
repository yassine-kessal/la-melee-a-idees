import {action, computed, observable} from "mobx";

export class UserStore {

  // proprieties
  @observable
  id = null;

  @observable
  email = null;

  @observable
  displayName = null;

  // computeds
  @computed
  get isAuthenticated() {
    return this.id !== null;
  }

  // actions
  @action
  authenticate(user) {
    this.id = user.uid;
    this.email = user.email;
    this.displayName = user.displayName;
  }

  @action
  logout() {
    this.id = null;
    this.email = null;
    this.displayName = null;
  }

}