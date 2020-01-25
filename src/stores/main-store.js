import {action, computed, observable} from "mobx";

export class MainStore {

  // proprieties
  @observable
  loading = false;

  // computeds
  @computed
  get isLoading(){
    return this.loading;
  }

  // actions
  @action
  enableLoading(){
    this.loading = true;
  }

  @action
  disableLoading(){
    this.loading = false;
  }

}