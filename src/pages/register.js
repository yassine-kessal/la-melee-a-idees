import React, {Component} from 'react';
import Input from "../components/input";
import validate from "validate.js";
import {authentication, firestore, rebase} from "../helpers/firebase";
import routes from "../routes";
import {inject, observer} from "mobx-react";
import NotAuthorized from "../components/not-authorized";
import {Redirect} from "react-router-dom";

@inject('userStore', 'mainStore')
@observer
class Register extends Component {

  // form rules
  constraints = {
    nom: {
      presence: {allowEmpty: false},
      length: {
        minimum: 2,
        maximum: 25
      }
    },
    prenom: {
      presence: {allowEmpty: false},
      length: {
        minimum: 2,
        maximum: 25
      }
    },
    email: {
      presence: {allowEmpty: false},
      email: true,
    },
    password: {
      presence: {allowEmpty: false},
      length: {
        minimum: 6,
        maximum: 25
      }
    },
    confirmPassword: {
      presence: {allowEmpty: false},
      equality: "password"
    }
  };

  // States
  state = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
    errors: {},
  };

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e, key) {
    e.preventDefault();

    this.setState({
      [key]: e.target.value
    });
  }

  async handleSubmit(e) {
    const {nom, prenom, email, password, confirmPassword, errors, constraints} = this.state;
    const {mainStore, userStore, history} = this.props;

    e.preventDefault();

    // register user
    mainStore.enableLoading();

    try {
      await validate.async({nom, prenom, email, password, confirmPassword}, constraints);

      try {
        const {user} = await authentication.createUserWithEmailAndPassword(email, password);

        await user.updateProfile({
          displayName: prenom + " " + nom,
        });

        const data = {
          user_id: user.uid,
          profile: {
            last_name: nom,
            first_name: prenom,
            name: prenom + " " + nom
          },
          role: 'user'
        };

        await firestore.collection('users').add(data);

        await userStore.authenticate(user);
      } catch(error) { // user creation failed #2
        this.setState({
          errors: {
            email: error.message
          }
        });
      }
    } catch(error) { // validation failed #1
      this.setState({
        errors
      });
    } finally {
      mainStore.disableLoading();
    }
  }

  render() {
    const {nom, prenom, email, password, confirmPassword, errors} = this.state;
    const {userStore} = this.props;

    if(userStore.isAuthenticated)
      return <Redirect to={routes.dashboard.path} />;

    return (
      <>
        <h1>Register</h1>

        <form onSubmit={this.handleSubmit}>

          <div className={"form-group"}>
            <Input type={"text"} value={nom} name={"nom"} placeholder={"Votre nom"} onChange={e => this.handleChange(e, 'nom')} errors={errors} />
          </div>

          <div className={"form-group"}>
            <Input type={"text"} value={prenom} name={"prenom"} placeholder={"Votre prenom"} onChange={e => this.handleChange(e, 'prenom')} errors={errors} />
          </div>

          <div className={"form-group"}>
            <Input type={"email"} value={email} name={"email"} placeholder={"Votre adresse email"} onChange={e => this.handleChange(e, 'email')} errors={errors} />
          </div>

          <div className={"form-group"}>
            <Input type={"password"} value={password} name={"password"} placeholder={"Votre mot de passe"} onChange={e => this.handleChange(e, 'password')} errors={errors} />
          </div>

          <div className={"form-group"}>
            <Input type={"password"} value={confirmPassword} name={"confirmPassword"} placeholder={"Confirmez votre mot de passe"} onChange={e => this.handleChange(e, 'confirmPassword')} errors={errors} />
          </div>

          <div className="form-group">
            <input type="submit"  className={"btn btn-success form-control"} value={"Inscription"} />
          </div>

        </form>
      </>
    );
  }
}

export default Register;