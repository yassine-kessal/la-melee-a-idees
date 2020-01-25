import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import validate from "validate.js";
import NotAuthorized from "../../../components/not-authorized";
import {firestore} from "../../../helpers/firebase";
import Input from "../../../components/input";
import {Link} from "react-router-dom";
import routes from "../../../routes";

@inject('mainStore', 'userStore')
@observer
class AddCategory extends Component {

  // Form Rules
  constraints = {
    name: {
      presence: {allowEmpty: false},
    },
    displayName: {
      presence: {allowEmpty: false},
    }
  };

  // States
  state = {
    name: '',
    displayName: '',
    success: false,
    errors: {}
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
    e.preventDefault();

    const {name, displayName} = this.state;
    const {mainStore, userStore} = this.props;

    mainStore.enableLoading();

    try {
      await validate.async({name, displayName}, this.constraints);

      try {
        const query = await firestore.collection('categories').where('name','==', name).get();

        if(query.empty) {
          try {
            await firestore.collection('categories').add({
              name,
              displayName,
              user_id: userStore.id
            });

            this.setState({
              success: true,
              errors: {},
              name: '',
              displayName: ''
            });
          } catch (error) { // validation failed insertion failed #2
            this.setState({
              success: false,
              errors: {
                name: error.message
              }
            });
          }
        }
        else {
          this.setState({
            success: false,
            errors: {
              name: 'Le nom unique de votre catégorie n\'est pas unique.'
            }
          });
        }
      } catch (error) { // validation failed #3 error name is used (must be unique)
        this.setState({
          success: false,
          errors: {
            name: error.message
          }
        });
      }
    } catch (errors) { // validation failed form data #1
      this.setState({
        success: false,
        errors
      });
    } finally {
      mainStore.disableLoading();
    }
  }

  render() {
    const {success, errors, name, displayName} = this.state;
    const {userStore} = this.props;

    if(!userStore.isAuthenticated)
      return <NotAuthorized />;

    return (
      <>
        <h1>Ajouter une catégories d'idées</h1>

        {success &&
        <div className={"alert alert-success"}>La catégorie à bien été créer.</div>
        }

        <form onSubmit={this.handleSubmit}>
          <div className={"form-group"}>
            <Input name={"name"} onChange={e => this.handleChange(e, 'name')} errors={errors} required={true} type={"text"} placeholder={"Le nom unique de votre catégorie"} value={name} />
          </div>

          <div className={"form-group"}>
            <Input name={"displayName"} onChange={e => this.handleChange(e, 'displayName')} errors={errors} required={true} type={"text"} placeholder={"Le nom  de votre catégorie à afficher"} value={displayName} />
          </div>

          <div className="form-group">
            <button className={"btn btn-success form-control"}>Ajouter</button>
            <Link className={"btn btn-primary form-control mt-3"} to={routes.admin.categories.list.path}>Revenir a la liste des catégories</Link>
          </div>
        </form>
      </>
    );
  }
}

export default AddCategory;