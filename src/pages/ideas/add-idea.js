import React, {Component} from 'react';
import {firestore, rebase} from "../../helpers/firebase";
import InputTextarea from "../../components/input-textarea";
import {inject, observer} from "mobx-react";
import validate from "validate.js";
import routes from "../../routes";
import {Link} from "react-router-dom";
import NotAuthorized from "../../components/not-authorized";

@inject('mainStore', 'userStore')
@observer
class AddIdea extends Component {

  // Form Rules
  constraints = {
    idea: {
      presence: {allowEmpty: false},
      length: {
        minimum: 6,
        maximum: 255,
      }
    },
  };

  // States
  state = {
    success: false,
    idea: null,
    category_id: null,
    errors: {},
    categories: [],
    fetched: false,
  };

  ref = null;

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.ref = rebase.bindCollection('categories', {
      withIds: true,
      context: this,
      state: 'categories',
      then: () => this.setState({fetched: true, category_id: this.state.categories[0].id})
    });
  }

  componentWillUnmount() {
    rebase.removeBinding(this.ref);
  }

  handleChange(e, key) {
    e.preventDefault();

    this.setState({
      [key]: e.target.value,
    });
  }

  handleSelect(e) {
    e.preventDefault();

    this.setState({
      category_id: e.target.value,
    });
  }

  async handleSubmit(e) {
    e.preventDefault();

    const {idea, category_id} = this.state;
    const {mainStore, userStore} = this.props;

    mainStore.enableLoading();

    try {
      await validate.async({idea, category_id}, this.constraints);

      try {
        const result = await firestore.collection('categories/'+category_id+'/ideas').add({
          idea,
          category_id,
          user_id: userStore.id,
          likes: []
        });

        this.setState({
          success: true,
          idea: '',
        });
      } catch (error) {
        this.setState({
          errors: {
            idea: error.message
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

  render() {
    const {success, errors, idea, fetched, categories} = this.state;
    const {userStore} = this.props;

    if(!userStore.isAuthenticated)
      return <NotAuthorized/>;

    return (
      <>
        <h1>Ajouter une idée</h1>

        {success &&
        <div className={"alert alert-success"}>Votre idée à bien été ajotuer.</div>
        }

        <form onSubmit={this.handleSubmit}>
          <div className={"form-group"}>
            <InputTextarea name={'idea'} errors={errors} placeholder={"Votre idée..."} onChange={(e) => this.handleChange(e, 'idea')} required={true} value={idea} />
          </div>
          <div className={"form-group"}>
            <select className={"form-control"} onChange={this.handleSelect}>
              {
                !fetched
                ?
                  <option value={"loading"}>Chargement...</option>
                :
                  (
                    categories.map((category,key)=>(
                      <option key={key} value={category.id}>{category.displayName}</option>
                    ))
                  )
              }
            </select>
          </div>
          <div className={"form-group"}>
            <input className={"btn btn-success form-control"} type={"submit"} value={"Ajouter une idée"}/>
            <Link className={"btn btn-primary form-control mt-3"} to={routes.ideas.list.path}>Revenir à la liste des idées</Link>
          </div>
        </form>
      </>
    );
  }
}

export default AddIdea;