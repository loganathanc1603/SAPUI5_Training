sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.ui5.SAPUI5_Session.controller.MainView", {
		onInit: function () {
			//Creating a jsonmodel
			var jmodel = new sap.ui.model.json.JSONModel();
			//creating a object with default values
			var obj = {
				"FName": "Test",
				"LName": "TestName"
			};
			//setting default binding mode "ONeWay"
			jmodel.setDefaultBindingMode("OneWay");
			//Setting the data to jsonmodel using setData() method
			jmodel.setData(obj);
			//Setting the model to current view using setModel() method
			this.getView().setModel(jmodel);
		}
	});
});