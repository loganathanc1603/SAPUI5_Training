sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/ui5/SAPUI5_Session/controller/BaseController",
	"sap/ui/core/routing/History"
], function (Controller, BaseController, History) {
	"use strict";

	return BaseController.extend("com.ui5.SAPUI5_Session.controller.TreeTable", {

		onInit: function () {

		},
		
		//this function will fire when toggle is clicked by the user
		onExpand: function(evt){
			var oContext = evt;	
		},

		onPrsNavBtn: function () {
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