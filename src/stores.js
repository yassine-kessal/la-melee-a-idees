import {MainStore} from './stores/main-store'
import {UserStore} from './stores/user-store'

export default {
  mainStore: new MainStore(),
  userStore: new UserStore(),
}