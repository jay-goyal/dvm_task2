import React, { Component, FormEvent } from "react";
import UserObj from "../types/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

type passwordErr = {
  err: string;
  errExists: boolean;
};

type signupProp = {
  setUser: (user: UserObj) => void;
};

type signupState = {
  user: UserObj;
  pwdErrs: passwordErr[];
  idErr: string;
  phoneErr: string;
  nameErr: string;
  userExistsErr: string;
};

class SignupForm extends Component<signupProp, signupState> {
  state: signupState = {
    user: {
      name: "",
      id: "",
      phone: "",
      password: "",
    },
    pwdErrs: [
      { err: "Password must be minimum 8 characters", errExists: true },
      {
        err: "Password must contain both upper and lowercase characters",
        errExists: true,
      },
      { err: "Password must contain numbers", errExists: true },
      { err: "Password must contain special characters", errExists: true },
    ],
    idErr: "",
    phoneErr: "",
    nameErr: "",
    userExistsErr: "",
  };

  handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (this.validateUser()) {
      const users: UserObj[] = JSON.parse(
        localStorage.getItem("users") || "[]"
      ) as UserObj[];
      users.push(this.state.user);
      localStorage.setItem("users", JSON.stringify(users));
      this.props.setUser(this.state.user);
    } else {
      alert("Invalid Data");
    }
  };

  handleChange = <P extends keyof signupState["user"]>(
    name: P,
    value: signupState["user"][P]
  ) => {
    this.setState((curState) => {
      return {
        ...curState,
        user: {
          ...curState.user,
          [name]: value,
        },
      };
    }, this.validateUser);
  };

  validatePwd = (): boolean => {
    const state = this.state;
    const password = state.user.password;
    const pwdErr = [...state.pwdErrs];
    let isInvalid: boolean;
    pwdErr[0].errExists = password.length <= 7;
    pwdErr[1].errExists =
      password.search(/[A-Z]/) === -1 || password.search(/[a-z]/) === -1;
    pwdErr[2].errExists = password.search(/[0-9]/) === -1;
    pwdErr[3].errExists = password.search(/[$&+,:;=?@#%]/) === -1;
    this.setState((curState) => {
      return {
        ...curState,
        pwdErrs: pwdErr,
      };
    });
    isInvalid =
      pwdErr[0].errExists &&
      pwdErr[1].errExists &&
      pwdErr[2].errExists &&
      pwdErr[3].errExists;
    return !isInvalid;
  };

  validateName = (): boolean => {
    const state = this.state;
    if (state.user.name.length > 20) {
      this.setState((curState) => {
        return {
          ...curState,
          nameErr: "The name must be maximum 20 character",
        };
      });
      return false;
    } else {
      this.setState((curState) => {
        return {
          ...curState,
          nameErr: "",
        };
      });
      return true;
    }
  };

  validateID = (): boolean => {
    const testExp = new RegExp(
      "^202[0-1][AB][A1-9](PS|[AB][A1-9])[0-9]{4}[PGH]"
    );

    if (testExp.test(this.state.user.id)) {
      this.setState((curState) => {
        return {
          ...curState,
          idErr: "",
        };
      });
      return true;
    } else {
      this.setState((curState) => {
        return {
          ...curState,
          idErr: "Invalid ID",
        };
      });
      return false;
    }
  };

  validatePhone = (): boolean => {
    const testExp = new RegExp("[0-9]{10}");
    if (testExp.test(this.state.user.phone)) {
      this.setState((curState) => {
        return {
          ...curState,
          phoneErr: "",
        };
      });
      return true;
    } else {
      this.setState((curState) => {
        return {
          ...curState,
          phoneErr: "Invalid phone number",
        };
      });
      return false;
    }
  };

  userExists = (): boolean => {
    const users: UserObj[] = JSON.parse(
      localStorage.getItem("users") || "[]"
    ) as UserObj[];
    for (let item of users) {
      if (item.id === this.state.user.id) {
        this.setState((curState) => {
          return {
            ...curState,
            userExistsErr: "User already exists",
          };
        });
        return false;
      }
    }
    return true;
  };

  validateUser = (): boolean => {
    return (
      this.validatePwd() &&
      this.validateName() &&
      this.validateID() &&
      this.validatePhone() &&
      this.userExists()
    );
  };

  render() {
    const state = this.state;
    return (
      <form className="AuthForm" onSubmit={this.handleSubmit}>
        <div className="AuthForm-err" style={{ fontSize: "1.5rem" }}>
          {state.userExistsErr}
        </div>
        <div>
          <div className="AuthForm-field">
            <input
              type="text"
              name="name"
              value={state.user.name}
              placeholder=" "
              onChange={(event) => {
                this.handleChange("name", event.currentTarget.value);
              }}
            />
            <label htmlFor="name">Full Name</label>
          </div>
          <div className="AuthForm-err">{state.nameErr}</div>
        </div>
        <div>
          <div className="AuthForm-field">
            <input
              type="text"
              name="id"
              value={state.user.id}
              placeholder=" "
              onChange={(event) => {
                this.handleChange("id", event.currentTarget.value);
              }}
            />
            <label htmlFor="id">BITS ID</label>
          </div>
          <div className="AuthForm-err">{state.idErr}</div>
        </div>
        <div>
          <div className="AuthForm-field">
            <input
              type="number"
              name="phone"
              value={state.user.phone}
              placeholder=" "
              onChange={(event) => {
                this.handleChange("phone", event.currentTarget.value);
              }}
            />
            <label htmlFor="phone">Phone Number</label>
          </div>
          <div className="AuthForm-err">{state.phoneErr}</div>
        </div>
        <div>
          <div className="AuthForm-field">
            <input
              type="password"
              name="password"
              value={state.user.password}
              placeholder=" "
              onChange={(event) => {
                this.handleChange("password", event.currentTarget.value);
              }}
            />
            <label htmlFor="password">Password</label>
          </div>
          <div className="AuthForm-err">
            {state.pwdErrs.map((err, idx) => {
              return (
                <div
                  key={idx}
                  className={
                    err.errExists ? "AuthForm-err" : "AuthForm-err-check"
                  }
                >
                  <FontAwesomeIcon icon={err.errExists ? faXmark : faCheck} />{" "}
                  {err.err}
                </div>
              );
            })}
          </div>
        </div>
        <div className="AuthForm-btns">
          <input
            type="submit"
            value="Signup"
            className="btn"
            style={{ width: "100%", marginTop: "20px" }}
          />
        </div>
      </form>
    );
  }
}

export default SignupForm;
