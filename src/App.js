import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import routes from "./routes";
import MainContainer from "./containers/main-container";
import {Provider} from "mobx-react";
import stores from "./stores";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Provider {...stores}>
          <MainContainer>
            <Switch>
              {/*Administration Routes*/}
              <Route {...routes.admin.categories.add} />
              <Route {...routes.admin.categories.list} />

              {/*Public Routes*/}
              <Route {...routes.ideas.add} />
              <Route {...routes.ideas.listIdeas} />
              <Route {...routes.ideas.list} />
              <Route {...routes.dashboard} />
              <Route {...routes.register} />
              <Route {...routes.login} />
              <Route {...routes.home} />
            </Switch>
          </MainContainer>
        </Provider>
      </BrowserRouter>
    );
  }
}

export default App;