import React, {Component} from 'react';

class NotAuthorized extends Component {
  render() {
    return (
      <h1>
        Vous n'avez pas les droits pour acceder à cette page.
      </h1>
    );
  }
}

export default NotAuthorized;