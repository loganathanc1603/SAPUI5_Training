sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.ui5.SAPUI5_Session.controller.MainView", {
		onInit: function () {
			var jmodel  = new sap.ui.model.json.JSONModel();
			var obj = {
				"FName": "Test",
				"LName": "TestName"
			};
			jmodel.setDefaultBindingMode("OneWay");
			jmodel.setData(obj);
			this.getView().setModel(jmodel);
		}
	});
});