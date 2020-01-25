import React, {Component} from 'react';
import routes from "../../routes";
import {Link} from "react-router-dom";
import {rebase} from "../../helpers/firebase";
import NotAuthorized from "../../components/not-authorized";
import {inject, observer} from "mobx-react";

@inject('mainStore', 'userStore')
@observer
class ListCategoriesIdeas extends Component {

  state = {
    categories: [],
    fetched: false
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
      then: () => {
        this.setState({
          fetched: true,
        });
      }
    });
  }

  componentWillUnmount() {
    rebase.removeBinding(this.ref);
  }

  render() {
    const {fetched, categories} = this.state;
    const {userStore} = this.props;

    if(!userStore.isAuthenticated)
      return <NotAuthorized/>;


    return (
      <>
        <h1>
          List ideas
        </h1>

        {
          !fetched
            ?
          <p className={"text-center"}>Chargement...</p>
            :
          <ul className={"list-unstyled"}>
            {categories.map((category, key) => (
              <li key={key}>
                <Link to={"/ideas/"+category.name}>{category.displayName}</Link>
              </li>
            ))}
          </ul>
        }

        <Link className={"btn btn-success"} to={routes.ideas.add.path}>Ajouter une idée</Link>
      </>
    );
  }
}

export default ListCategoriesIdeas;