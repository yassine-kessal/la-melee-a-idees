import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {Link, Redirect} from "react-router-dom";
import {authentication} from "../../helpers/firebase";

import routes from "../../routes";

@inject('mainStore', 'userStore')
@observer
class Header extends Component {

  state = {
    logoutSucceeded: false
  };

  constructor(props) {
    super(props);

    this.handleClickLogout = this.handleClickLogout.bind(this);
  }

  componentDidMount() {
    const {mainStore, userStore} = this.props;

    mainStore.enableLoading();

    authentication.onAuthStateChanged(async user => {
      if(user){
        await userStore.authenticate(user);
      }

      mainStore.disableLoading();
    });
  }

  handleClickLogout(e) {
    e.preventDefault();
    const {userStore, history} = this.props;

    authentication.signOut();
    userStore.logout();

    this.setState({
      logoutSucceeded: true
    });
  }

  render() {
    const {mainStore, userStore} = this.props;

    // Affichage du Spinner loading
    const Spinner = (
      mainStore.isLoading
        ?
        <div className="spinner-border text-light mr-4 ml-4" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        :
        ''
    );

    // Affichage de la UserBar
    const UserBar = (
      userStore.isAuthenticated
        ?
        <>
          <li className="nav-item">
            <Link to={routes.dashboard.path} className={"nav-link"}>{userStore.displayName}</Link>
          </li>
          <li className="nav-item">
            <a href="#logout" onClick={this.handleClickLogout} className={"nav-link"}>Déconnexion</a>
          </li>
        </>
        :
        <>
          <li className="nav-item">
            <Link to={routes.login.path} className={"nav-link"}>Connexion</Link>
          </li>
          <li className="nav-item">
            <Link to={routes.register.path} className={"nav-link"}>Inscription</Link>
          </li>
        </>
    );

    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

        {/*Redirect if logout IMPORTANT: this not a page so the redirection need to be in the return*/}
        {this.state.logoutSucceeded &&
         <Redirect to={'/'} />}

        <a className="navbar-brand" href="#">La Mêlée à idées</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"/>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link to={routes.home.path} className={"nav-link"}>Accueil</Link>
            </li>
          </ul>

          <ul className="navbar-nav">
            {UserBar}
          </ul>

          {Spinner}
        </div>
      </nav>
    );
  }
}

export default Header;