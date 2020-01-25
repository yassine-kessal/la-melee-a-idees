import React, {Component} from 'react';
import Header from "./main/header";

// bootstrap
import "bootstrap/scss/bootstrap.scss";
import "bootstrap/js/src";
import Footer from "./main/footer";

class MainContainer extends Component {
  render() {
    const {children} = this.props;

    return (
      <>
        <Header />

        <div className={"container"}>
          {children}
        </div>

        <Footer />
      </>
    );
  }
}

export default MainContainer;