import React, { Component, MouseEvent } from "react";
import "./Auth.scss";
import UserObj from "../types/user";
import SignupForm from "../EntryForm/SignupForm";
import LoginForm from "../EntryForm/LoginForm";

type Active = "Login" | "Signup";

type authProp = {
  setUser: (user: UserObj) => void;
};

type authState = {
  active: Active;
  user: UserObj;
};

class Auth extends Component<authProp, authState> {
  state: authState = {
    active: "Login",
    user: { name: "", password: "", id: "", phone: "" },
  };

  changeAuthMode = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    let btn: HTMLButtonElement = event.currentTarget;
    if (btn.id === "login") {
      return;
    } else {
      this.setState((curState) => {
        if (curState.active === "Login") {
          return { ...curState, active: "Signup" };
        } else {
          return { ...curState, active: "Login" };
        }
      });
    }
  };

  handleSet = (user: UserObj) => {
    this.setState(
      (curState) => {
        return {
          ...curState,
          user: user,
        };
      },
      () => this.props.setUser(this.state.user)
    );
  };

  render() {
    const state = this.state;
    return (
      <div className="Auth">
        <div className="Auth-state">
          <button
            className="Auth-btn Auth-btn-login"
            id={state.active === "Login" ? "active" : ""}
            onClick={this.changeAuthMode}
          >
            Login
          </button>
          <button
            className="Auth-btn Auth-btn-signup"
            id={state.active === "Signup" ? "active" : ""}
            onClick={this.changeAuthMode}
          >
            Signup
          </button>
        </div>
        <div className="Auth-form">
          {state.active === "Signup" ? (
            <SignupForm setUser={this.handleSet} />
          ) : (
            <LoginForm {...state.user} />
          )}
        </div>
      </div>
    );
  }
}

export default Auth;
