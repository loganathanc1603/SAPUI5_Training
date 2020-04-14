sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/ui5/SAPUI5_Session/controller/BaseController"
], function (Controller, BaseController) {
	"use strict";

	return BaseController.extend("com.ui5.SAPUI5_Session.controller.ThirdView", {

		onInit: function () {

		},

		onPrsBtnBack: function () {
			this.getRouter().navTo("MainView", {}, true);
		}
	});

});