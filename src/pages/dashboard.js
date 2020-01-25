import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import NotAuthorized from "../components/not-authorized";
import {Link} from "react-router-dom";
import routes from "../routes";

@inject('userStore')
@observer
class Dashboard extends Component {
  render() {
    const {userStore} = this.props;

    if(!userStore.isAuthenticated)
      return <NotAuthorized />;

    return (
      <>
        <h1>
          Dashboard
        </h1>

        <ul className={"list-unstyled"}>
          <li>
            <Link to={routes.ideas.list.path}>Les idées</Link>
          </li>
          <li>
            <Link to={routes.admin.categories.list.path}>Les catégories (administration)</Link>
          </li>
        </ul>
      </>
    );
  }
}

export default Dashboard;