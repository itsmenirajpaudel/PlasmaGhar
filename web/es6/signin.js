class SignIn {
  constructor() {
    this.clicked = false;
    this.model = [
      {
        selector: "loginPhone",
        rules: {
          regex: {
            value: /^[0-9]{10}$/,
            error: "Phone Number must have 10 digits.",
          },
        },
        value: "",
      },
      {
        selector: "loginPassword",
        rules: {
          required: {
            value: true,
            error: "Password is required.",
          },
        },
        value: "",
      },
    ];
    this.onSignInConfirmClick = this.onSignInConfirmClick.bind(this);
    this.checkValidation = this.checkValidation.bind(this);
    this.setModalListeners = this.setModalListeners.bind(this);
    this.setUpListeners();
  }

  setUpListeners() {
    $(".confirm-signin").click(this.onSignInConfirmClick);
    this.setUpOnBlurListeners();
    this.setModalListeners();
  }

  setModalListeners() {
    $("#signinModal").on("hidden.bs.modal", () => {
      if (window.location.href.includes("/user/login")) {
        window.location.href = "/";
      } else this.resetForm();
    });
  }

  setUpOnBlurListeners() {
    this.model.map((v, index) => {
      const { selector, rules } = v;
      const self = this;
      $(`#${selector}`).blur(function () {
        if (self.clicked) self.showError(selector, rules, index);
      });
    });
  }

  resetForm() {
    this.model.forEach((v) => {
      const { selector } = v;
      $(`#${selector}`).val("");
      v.value = "";
    });
    $(".invalid-feedback").hide();
  }

  showError(selector, rules, index) {
    const element = $(`#${selector}`);
    const value = element.val();
    const errorElement = element.next();
    let message = "";
    let valid = true;

    if (!value && rules.required && rules.required.value) {
      valid = false;
      message = rules.required.error;
    } else if (rules.regex) {
      valid = new RegExp(rules.regex.value).test(value);
      if (rules.required && rules.required.value === false) {
        valid = !value || valid;
      }
      if (!valid) message = rules.regex.error;
    }

    if (!valid && message) {
      errorElement.text(message);
      errorElement.show();
    } else {
      errorElement.text("");
      errorElement.hide();
    }
    this.model[index].value = value;
    return valid;
  }

  checkValidation() {
    let valid = true;
    let retrunVal = true;
    for (let i = 0; i < this.model.length; i++) {
      const { selector, rules } = this.model[i];
      valid = this.showError(selector, rules, i);
      if (!valid) retrunVal = false;
    }
    return retrunVal;
  }

  onSignInConfirmClick() {
    this.clicked = true;
    const valid = this.checkValidation();
    if (valid) {
      this.loginUser();
    }
  }

  loginUser() {
    const { model } = this;
    const data = {
      phone_number: model[0].value,
      password: model[1].value,
      remember_me: $("#rememberMe:checked").val() ? 1 : 0,
    };

    axios
      .post("/user/login", data)
      .then(({ data: response }) => {
        if (response && response.success) {
          window.location.href = "/dashboard";
        } else {
          $.toaster({ settings: { timeout: 5000 } });
          $.toaster({
            priority: "danger",
            title: "Error",
            message: `Invalid phone and/or password`,
          });
        }
      })
      .catch(function (error) {
        alert("Error while saving the data");
      });
  }
}

$(document).ready(function () {
  new SignIn();
});
