import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import NotAuthorized from "../../../components/not-authorized";
import {rebase} from "../../../helpers/firebase";
import {Link} from "react-router-dom";
import routes from "../../../routes";

@inject('mainStore', 'userStore')
@observer
class ListCategories extends Component {

  state = {
    categories: [],
    fetched: false,
  };

  ref = null;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.ref = rebase.bindCollection('categories', {
      withIds: true,
      context: this,
      state: 'categories',
      then: () => this.setState({fetched: true})
    });
  }

  componentWillUnmount() {
    rebase.removeBinding(this.ref);
  }

  render() {
    const {fetched,categories} = this.state;
    const {userStore} = this.props;

    if(!userStore.isAuthenticated)
      return <NotAuthorized/>;

    return (
      <>
        <h1>
          List Categories
        </h1>
        <table className={"table"}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Display Name</th>
              <th>User ID</th>
            </tr>
          </thead>
          <tbody>
          {fetched
            ?
            (
              categories.map((category, key) => (
                <tr key={key}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>{category.displayName}</td>
                  <td>{category.user_id}</td>
                </tr>
              ))
            )
            :
            (<tr>
              <td colSpan={"4"} className={"text-center"}>Chargement...</td>
            </tr>)
          }
          </tbody>
        </table>

        <Link className={"btn btn-success"} to={routes.admin.categories.add.path}>Ajouter une Catégorie</Link>
      </>
    );
  }
}

export default ListCategories;