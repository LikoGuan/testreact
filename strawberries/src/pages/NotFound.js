import React, { Component } from 'react';

class NotFound extends Component {
  render() {
    return (
      <div>
        <h2>
          404 - Not Found
        </h2>
        <img src="http://thecatapi.com/api/images/get?format=src&type=gif" alt="kitten" />

      </div>
    );
  }
}

export default NotFound;
