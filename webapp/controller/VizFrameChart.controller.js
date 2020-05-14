sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/ui5/SAPUI5_Session/controller/BaseController",
	"sap/ui/core/routing/History"
], function (Controller, BaseController, History) {
	"use strict";

	return BaseController.extend("com.ui5.SAPUI5_Session.controller.VizFrameChart", {

		onInit: function () {
			this.oVizFrame = this.getView().byId("idVizFrame");
			var oPopOver = this.getView().byId("idPopOver");
			oPopOver.connect(this.oVizFrame.getVizUid());
		},

		onChangeSwitch: function (evt) {
			// var oSelected = evt.getParameter("value");
			var feedValueAxis = this.getView().byId('valueAxisFeed');
			this.oVizFrame.removeFeed(feedValueAxis);
			feedValueAxis.setValues(["TotalRecovered", "TotalConfirmed"]);
			this.oVizFrame.addFeed(feedValueAxis);
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