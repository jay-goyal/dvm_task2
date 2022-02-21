import React, { Component } from "react";
import UserObj from "../types/user";

class LoginForm extends Component<UserObj> {
  handleChange = <P extends keyof UserObj>(name: P, value: UserObj[P]) => {
    this.setState((curState) => {
      return {
        ...curState,
        [name]: value,
      };
    });
  };

  render() {
    const props = this.props;
    return (
      <form className="AuthForm">
        <div className="AuthForm-field">
          <input type="text" name="id" value={props.id} placeholder=" " />
          <label htmlFor="id">BITS ID</label>
        </div>
        <div className="AuthForm-field">
          <input
            type="password"
            name="password"
            value={props.password}
            placeholder=" "
          />
          <label htmlFor="password">Password</label>
        </div>
      </form>
    );
  }
}

export default LoginForm;
