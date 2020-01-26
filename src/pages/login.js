import React, {Component} from 'react';
import Input from "../components/input";
import {inject, observer} from "mobx-react";
import validate from "validate.js";
import {authentication, firestore, firebase, rebase} from "../helpers/firebase";
import NotAuthorized from "../components/not-authorized";
import routes from "../routes";
import {Redirect} from "react-router-dom";

@inject('mainStore', 'userStore')
@observer
class Login extends Component {

  // Form Rules
  constraints = {
    email: {
      presence: {allowEmpty: false},
      email: true
    },
    password: {
      presence: {allowEmpty: false},
      length: {
        minimum: 6,
      }
    }
  };

  // States
  state = {
    email: '',
    password: '',
    errors: {},
  };

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick  = this.handleClick.bind(this);
  }

  handleChange(e, key) {
    this.setState({
      [key]: e.target.value
    });
  }

  // Connexion Email / Mot de passe
  async handleSubmit(e) {
    e.preventDefault();

    const {email, password}      = this.state;
    const {mainStore, userStore} = this.props;

    mainStore.enableLoading();

    try {
      await validate.async({email, password}, this.constraints);

      try {
        const {user} = await authentication.signInWithEmailAndPassword(email, password);

        await userStore.authenticate(user);
      } catch (error) {
        this.setState({
          errors: {
            email: error.message
          }
        });
      }
    } catch (errors) {
      this.setState({
        errors
      });
    } finally {
      mainStore.disableLoading();
    }
  }

  // Connexion Facebook ou Google (default: Google)
  async handleClick(e, provider = 'google') {
    const {userStore, mainStore, history} = this.props;

    const providerInstance = provider === 'facebook' ? new firebase.auth.FacebookAuthProvider() : new firebase.auth.GoogleAuthProvider();

    mainStore.enableLoading();

    try {
      const result = await authentication.signInWithPopup(providerInstance);

      if(result.additionalUserInfo.isNewUser)
      {
        await firestore.collection('users').add({
          user_id: result.user.uid,
          profile: result.additionalUserInfo.profile,
          role: 'user'
        });
      }

      await userStore.authenticate(result.user);
    } catch(error) {
      this.setState({
        errors: {
          email: error.message
        }
      });
    } finally {
      mainStore.disableLoading();
    }
  }

  render() {
    const {email, password, errors} = this.state;
    const {userStore} = this.props;

    if(userStore.isAuthenticated)
      return <Redirect to={routes.dashboard.path} />;

    return (
      <>
        <h1>Connexion</h1>
        <form onSubmit={this.handleSubmit}>
          <div className={"form-group"}>
            <Input name={"email"} onChange={e => this.handleChange(e, 'email')} value={email} errors={errors} required={true} type={"email"} placeholder={"Adresse Email"} />
          </div>
          <div className={"form-group"}>
            <Input name={"password"} onChange={e => this.handleChange(e, 'password')} value={password}  errors={errors} required={true} type={"password"} placeholder={"Mot de passe"} />
          </div>
          <div className={"form-group"}>
            <input className={"btn btn-success form-control"} value={"Connexion"} type={"submit"} />
          </div>
        </form>

        <div className={"row mt-2"}>
          <div className="col-6">
            <button onClick={e => this.handleClick(e, 'facebook')} className={"btn btn-primary form-control"}>Facebook</button>
          </div>
          <div className="col-6">
            <button onClick={e => this.handleClick(e, 'google')} className={"btn btn-primary form-control"}>Google</button>
          </div>
        </div>
      </>
    );
  }
}

export default Login;