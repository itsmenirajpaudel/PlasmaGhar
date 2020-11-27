"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var i=0;i<t.length;i++){var r=t[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function _createClass(e,t,i){return t&&_defineProperties(e.prototype,t),i&&_defineProperties(e,i),e}var SignUp=function(){function e(){_classCallCheck(this,e),this.clicked=!1,this.states=[],this.model=this.getModel(),this.onSignUpConfirmClick=this.onSignUpConfirmClick.bind(this),this.checkValidation=this.checkValidation.bind(this),this.setModalListeners=this.setModalListeners.bind(this),this.setUpListeners()}return _createClass(e,[{key:"getModel",value:function(){return[{selector:"phoneNumber",rules:{regex:{value:/^[0-9]{10}$/,error:"Phone Number must have 10 digits."}},value:""},{selector:"bloodGroup",rules:{required:{value:!0,conditions:[{selector:"input#gridRadios2:checked",value:!0}],error:"Blood Group is required."}},value:""},{selector:"state",rules:{required:{value:!0,error:"State is required."}},value:""},{selector:"district",rules:{required:{value:!0,error:"District is required."}},value:""},{selector:"password",rules:{regex:{value:/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,error:"Password must be minimum eight characters, at least one letter and one number"}},value:""},{selector:"confirm-password",rules:{match:{value:"password",error:"Confirm Password does not match."}},value:""}]}}]),_createClass(e,[{key:"setUpListeners",value:function(){$(".confirm-signup").click(this.onSignUpConfirmClick),$(".signin-register").click(function(){$("#signupModal").modal("hide"),window.location.href.includes("/user/register")?window.location.href="/user/login":$("#signinModal").modal("show")}),this.setUpOnBlurListeners(),this.setUpOnChangeListeners(),this.setModalListeners()}},{key:"setModalListeners",value:function(){var e=this;$("#signupModal").on("shown.bs.modal",function(){0===e.states.length&&e.requestStates(),$("body").addClass("modal-open")}),$("#signupModal").on("hidden.bs.modal",function(){window.location.href.includes("/user/register")?window.location.href="/":e.resetForm()})}},{key:"setUpOnBlurListeners",value:function(){var o=this;this.model.map(function(e,t){var i=e.selector,r=e.rules,n=o;$("#".concat(i)).blur(function(){n.clicked&&n.showError(i,r,t)})})}},{key:"setUpOnChangeListeners",value:function(){var t=this;$("#state").on("change",function(){var e;this.value?(e=$("option:selected",this).data("code"),console.log(e),t.requestDistricts(e)):$(".district-wrapper").hide()}),$("input#gridRadios2").on("click",function(){$("input#gridRadios1").prop("checked",!1),$(".plasma-warning").hide(),$(".confirm-health").hide();var e=$("#bloodGroup").next();e.text(""),e.hide()}),$("input#gridRadios1").on("click",function(){$("input#gridRadios2").prop("checked",!1),$(".plasma-warning").show(),$(".confirm-health").show()})}},{key:"showError",value:function(e,t,i){var r=$("#".concat(e)),e=r.val(),r=r.next(),n="",o=!0;return!e&&t.required&&t.required.value?t.required.conditions?t.required.conditions.forEach(function(e){e=e.selector;$(e).val()||(o=!1,n=t.required.error)}):(o=!1,n=t.required.error):t.regex?(o=new RegExp(t.regex.value).test(e),t.required&&!1===t.required.value&&(o=!e||o),o||(n=t.regex.error)):t.match&&e!==$("#".concat(t.match.value)).val()&&(o=!1,n=t.match.error),!o&&n?(r.text(n),r.show()):(r.text(""),r.hide()),this.model[i].value=e,o}},{key:"checkValidation",value:function(){for(var e=!0,t=0;t<this.model.length;t++){var i=this.model[t],r=i.selector,i=i.rules;this.showError(r,i,t)||(e=!1)}return e}},{key:"resetForm",value:function(){this.model.forEach(function(e){var t=e.selector;$("#".concat(t)).val(""),e.value=""}),$(".invalid-feedback").hide()}},{key:"checkIfHealthConditionsFine",value:function(){var e=!1;return 1==($("input#gridRadios1:checked").val()?0:1)||$("#confirmHealth:checked").val()?e=!0:(e=!1,$.toaster({settings:{timeout:5e3}}),$.toaster({priority:"danger",title:"Confirm Health",message:"You must confirm that you do not have listed health conditions before signup."})),e}},{key:"checkIfTermsAndConditionsAgreed",value:function(){var e=!0;return $("#terms:checked").val()||($.toaster({settings:{timeout:5e3}}),$.toaster({priority:"danger",title:"Terms and Conditions",message:"You must agree to our terms and conditions to proceed further."}),e=!1),e}},{key:"onSignUpConfirmClick",value:function(){this.clicked=!0,this.checkValidation()&&this.checkIfHealthConditionsFine()&&this.checkIfTermsAndConditionsAgreed()&&this.registerUser()}},{key:"requestStates",value:function(){var t=this;axios.get("/address/get-states").then(function(e){e=e.data;e&&0<e.length&&(t.states=e,t.populateStates())}).catch(function(e){})}},{key:"requestDistricts",value:function(e){var t=this;axios.get("/address/get-districts?code=".concat(e)).then(function(e){e=e.data;e&&0<e.length&&t.populateDistricts(e)}).catch(function(e){})}},{key:"populateStates",value:function(){var e=this.states;$("#state").html("");for(var t="<option selected value>SELECT STATE</option>",i=0;i<e.length;i++)t+="<option data-code=".concat(e[i].code," value=").concat(e[i].name,">").concat(e[i].name,"</option>");$("#state").append(t)}},{key:"populateDistricts",value:function(e){$("#district").html("");for(var t="<option selected value>SELECT DISTRICT</option>",i=0;i<e.length;i++)t+="<option data-code=".concat(e[i].code," value=").concat(e[i].name,">").concat(e[i].name,"</option>");$(".district-wrapper").show(),$("#district").append(t)}},{key:"registerUser",value:function(){var t=this,e=this.model,e={phone_number:e[0].value,blood_group:e[1].value,state:e[2].value,district:e[3].value,password:e[4].value,user_role:$("input#gridRadios1:checked").val()?0:1};axios.post("/user/save",e).then(function(e){e=e.data;e&&e.success?(t.resetForm(),$("#signupModal").modal("hide"),$.toaster({settings:{timeout:15e3}}),$.toaster({priority:"success",title:"Success",message:'You are successfully registered, we have sent a confirmation link on your phone. \n          Please click on that link to verify your phone.\n          <a href="'.concat(e.link,'"> CLICK THIS LINK </a>\n          ')})):e&&e.error&&"exist already"===e.error&&((e=$("#phoneNumber").next()).text("User already exists with this phone number"),e.show())}).catch(function(e){console.log(e),$.toaster({settings:{timeout:5e3}}),$.toaster({priority:"danger",title:"Error",message:"Something is wrong. Please try later"})})}}]),e}();function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var i=0;i<t.length;i++){var r=t[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function _createClass(e,t,i){return t&&_defineProperties(e.prototype,t),i&&_defineProperties(e,i),e}$(document).ready(function(){axios.defaults.headers.post["X-CSRF-Token"]=$('meta[name="csrf-token"]').attr("content"),axios.defaults.headers.common["X-Requested-With"]="XMLHttpRequest",new SignUp});var SignIn=function(){function e(){_classCallCheck(this,e),this.clicked=!1,this.model=[{selector:"loginPhone",rules:{regex:{value:/^[0-9]{10}$/,error:"Phone Number must have 10 digits."}},value:""},{selector:"loginPassword",rules:{required:{value:!0,error:"Password is required."}},value:""}],this.onSignInConfirmClick=this.onSignInConfirmClick.bind(this),this.checkValidation=this.checkValidation.bind(this),this.setModalListeners=this.setModalListeners.bind(this),this.setUpListeners()}return _createClass(e,[{key:"setUpListeners",value:function(){$(".confirm-signin").click(this.onSignInConfirmClick),$(".register-signin").click(function(){$("#signinModal").modal("hide"),window.location.href.includes("/user/login")?window.location.href="/user/register":$("#signupModal").modal("show")}),this.setUpOnBlurListeners(),this.setModalListeners()}},{key:"setModalListeners",value:function(){var e=this;$("#signinModal").on("hidden.bs.modal",function(){window.location.href.includes("/user/confirm")||window.location.href.includes("/user/login")?window.location.href="/":e.resetForm()}),$("#signinModal").on("shown.bs.modal",function(){$("body").addClass("modal-open")})}},{key:"setUpOnBlurListeners",value:function(){var o=this;this.model.map(function(e,t){var i=e.selector,r=e.rules,n=o;$("#".concat(i)).blur(function(){n.clicked&&n.showError(i,r,t)})})}},{key:"resetForm",value:function(){this.model.forEach(function(e){var t=e.selector;$("#".concat(t)).val(""),e.value=""}),$(".invalid-feedback").hide()}},{key:"showError",value:function(e,t,i){var r=$("#".concat(e)),n=r.val(),o=r.next(),e="",r=!0;return!n&&t.required&&t.required.value?(r=!1,e=t.required.error):t.regex&&(r=new RegExp(t.regex.value).test(n),t.required&&!1===t.required.value&&(r=!n||r),r||(e=t.regex.error)),!r&&e?(o.text(e),o.show()):(o.text(""),o.hide()),this.model[i].value=n,r}},{key:"checkValidation",value:function(){for(var e=!0,t=0;t<this.model.length;t++){var i=this.model[t],r=i.selector,i=i.rules;this.showError(r,i,t)||(e=!1)}return e}},{key:"onSignInConfirmClick",value:function(){this.clicked=!0,this.checkValidation()&&this.loginUser()}},{key:"loginUser",value:function(){var e=this.model,e={phone_number:e[0].value,password:e[1].value,remember_me:$("#rememberMe:checked").val()?1:0};axios.post("/user/login",e).then(function(e){e=e.data;e&&e.success?void 0!==$(".confirm-signin").data("nexturl")?(e=$(".confirm-signin").attr("data-nexturl"),window.location.href=e):$("#searchModal").hasClass("show")?$("#signinModal").modal("hide"):window.location.href="/dashboard":($.toaster({settings:{timeout:5e3}}),$.toaster({priority:"danger",title:"Error",message:"Invalid phone and/or password"}))}).catch(function(e){console.log(e),console.log("Error while saving the data")})}}]),e}();$(document).ready(function(){new SignIn});