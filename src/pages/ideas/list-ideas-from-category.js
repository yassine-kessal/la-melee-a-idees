import React, {Component} from 'react';
import {firestore, rebase} from "../../helpers/firebase";
import routes from "../../routes";
import {inject, observer} from "mobx-react";
import NotAuthorized from "../../components/not-authorized";
import {Link} from "react-router-dom";

@inject('mainStore', 'userStore')
@observer
class ListIdeasFromCategory extends Component {

  state = {
    ideas: [],
    users: [],
    fetched: false,
    category: {},
    category_id: null
  };

  refIdeas = null;
  refUsers = null;

  constructor(props) {
    super(props);

    this.handleLikeClick = this.handleLikeClick.bind(this);
  }

  async componentDidMount() {
    const {match, history} = this.props;

    try {
      const result = await firestore
        .collection('categories')
        .where('name','==',match.params.category_id)
        .limit(1).get();

      if(result.empty)
      {
        return history.replace(routes.ideas.list.path);
      }

      this.setState({
        category: result.docs[0].data(),
        category_id: result.docs[0].id,
      });

      this.refIdeas = rebase.bindCollection('categories/'+result.docs[0].id+"/ideas", {
        context: this,
        state: 'ideas',
        withIds: true,
        query: ref => ref.limit(10),
        then: () => {
          const {ideas} = this.state;

          if(ideas.length > 0)
          {
            let users_ids = ideas.map(idea => idea.user_id); // add users ideas
            let likes_users_ids = ideas.map(idea => idea.likes.map(like => like));

            // add users likes
            likes_users_ids.forEach(v => {
              users_ids = [...users_ids, ...v]
            });

            users_ids = Array.from(new Set(users_ids)); // delete duplicated ids

            this.refUsers = rebase.bindCollection("users", {
              context: this,
              state: 'users',
              withIds: true,
              query: ref => ref.where('user_id', 'in', users_ids),
              then: () => {
                this.setState({
                  fetched: true
                });
              }
            });
          }
          else {
            this.setState({
              fetched: true
            });
          }
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  componentWillUnmount() {
    if(this.refIdeas !== null)
      rebase.removeBinding(this.refIdeas);
    if(this.refUsers !== null)
      rebase.removeBinding(this.refUsers);
  }

  async handleLikeClick(e, idea) {
    e.preventDefault();

    const {userStore, mainStore} = this.props;

    try {
      let likes = idea.likes;
      if(idea.likes.includes(userStore.id)) {
        // unlike
        likes = idea.likes.filter(idea => idea !== userStore.id);
      } else {
        // like
        likes = [...idea.likes, userStore.id];

        // get user info and bind it to local variable
        if(this.state.users.filter(user => user.user_id === userStore.id).length === 0)
        {
          this.setState(prevState => ({
            users: [...prevState.users, userStore.data]
          }));
        }
      }

      await rebase.updateDoc("categories/"+this.state.category_id+"/ideas/"+idea.id, {
        ...idea,
        likes
      });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const {fetched, ideas, users} = this.state;
    const {match, userStore} = this.props;

    if(!userStore.isAuthenticated)
      return <NotAuthorized/>;

    const LikeText = (likes) => likes.includes(userStore.id)?"J'aime pas":"J'aime";

    return (
        <>
        {!fetched
          ?
        <p className={"text-center"}>Chargement...</p>
          :
        <>
          <h1>
            {this.state.category.displayName}
          </h1>

          <div>
            <Link to={routes.ideas.list.path} className={"btn btn-primary"}>Retour à la liste des catégories</Link>
            <Link className={"btn btn-success ml-2"} to={routes.ideas.add.path}>Ajouter une idée</Link>
            {ideas.map((idea, i) => (
              <div className={"card mt-2"} key={i}>
                <div className={"card-body"}>{idea.idea}</div>
                <div className={"card-footer"}>
                  <div className={"row"}>
                    <div className={"col-8"}>
                      <button className={"btn btn-secondary"} onClick={e => this.handleLikeClick(e, idea)}>
                        {LikeText(idea.likes)} ({idea.likes.length})
                      </button>

                      <ul className={"list-unstyled list-inline"}>
                        <li className={"list-inline-item"}>Likes:</li>
                        {idea.likes!==undefined && idea.likes.map((like,i) => {
                          return users
                            .filter(user => user.user_id === like)
                            .map(value => <li className={"list-inline-item"} key={i}>{value.profile.name}</li>);
                        })}
                      </ul>
                    </div>
                    <div className={"col-4"}>
                      Publié par {users.filter(user => user.user_id === idea.user_id)[0].profile.name}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
        }
        </>
    );
  }
}

export default ListIdeasFromCategory;