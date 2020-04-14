sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/ui5/SAPUI5_Session/controller/BaseController",
	"sap/ui/core/routing/History"
], function (Controller, BaseController, History) {
	"use strict";

	return BaseController.extend("com.ui5.SAPUI5_Session.controller.SecondView", {

		onInit: function () {
			this.getRouter().getRoute("SecondView").attachPatternMatched(this.onObjectMatched, this);
		},

		onObjectMatched: function (evt) {
			var oRouteObject = evt.getParameter("arguments").Obj;
		},

		onPrsNavBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = this.getRouter();
				oRouter.navTo("MainView", {}, true);
			}
		}

	});

});