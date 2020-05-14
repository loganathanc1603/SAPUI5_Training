sap.ui.define([
	"com/ui5/SAPUI5_Session/controller/BaseController",
	"com/ui5/SAPUI5_Session/model/formatter",
	"sap/ui/core/routing/History"
], function (BaseController, formatter, History) {
	"use strict";

	return BaseController.extend("com.ui5.SAPUI5_Session.controller.SmartControls", {
		formatter: formatter,

		onInit: function () {

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
		},

		fnOnBeforeRebind: function (evt) {
			var Obj = evt;
		},

		onPrsNavBusi: function (evt) {
			var sPath = evt.getSource().getBindingContextPath();
			this.getView().byId("smartFormId").bindElement(sPath);
		}

	});

});