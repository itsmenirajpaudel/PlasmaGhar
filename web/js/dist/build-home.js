"use strict";$(document).ready(function(){$(".btn-help").on("click",function(){axios.get("/user/who-am-i").then(function(n){n.data.id?window.location.href="/dashboard":$("#signinModal").modal("show")}).catch(function(n){})})});