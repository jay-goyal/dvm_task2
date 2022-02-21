import React, { Component, FormEvent } from "react";
import UserObj from "../types/user";

type loginProp = {
  loginFn: (user: UserObj) => void;
};

class LoginForm extends Component<loginProp, UserObj> {
  state: UserObj = {
    name: "",
    id: "",
    phone: "",
    password: "",
  };

  handleChange = <P extends keyof UserObj>(name: P, value: UserObj[P]) => {
    this.setState((curState) => {
      return {
        ...curState,
        [name]: value,
      };
    });
  };

  loginUser = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const users: UserObj[] = JSON.parse(localStorage.getItem("users") || "[]");
    for (let user of users) {
      if (user.id === this.state.id && user.password === this.state.password) {
        this.props.loginFn(user);
        return;
      }
    }
    alert("Invalid username or password");
  };

  render() {
    const state = this.state;
    return (
      <form className="AuthForm" onSubmit={this.loginUser}>
        <div className="AuthForm-field">
          <input
            type="text"
            name="id"
            value={state.id}
            placeholder=" "
            onChange={(event) => {
              this.handleChange("id", event.currentTarget.value);
            }}
          />
          <label htmlFor="id">BITS ID</label>
        </div>
        <div className="AuthForm-field">
          <input
            type="password"
            name="password"
            value={state.password}
            placeholder=" "
            onChange={(event) => {
              this.handleChange("password", event.currentTarget.value);
            }}
          />
          <label htmlFor="password">Password</label>
        </div>
        <div className="AuthForm-btns">
          <input
            type="submit"
            value="Login"
            className="btn"
            style={{ width: "100%", marginTop: "20px" }}
          />
        </div>
      </form>
    );
  }
}

export default LoginForm;
