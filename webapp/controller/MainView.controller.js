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
		},

		// function for search products
		onSearchProducts: function (evt) {
			var oValue = evt.getSource().getValue();
			var aFilters = [];
			if (oValue && oValue.length > 0) {
				var f1 = new sap.ui.model.Filter("ProductId", sap.ui.model.FilterOperator.Contains, oValue);
				var f2 = new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, oValue);
				aFilters.push(new sap.ui.model.Filter([f1, f2], false));
			}

			// update list binding
			var oList = this.byId("mTblPrdId");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilters, "Application");
		},

		//function for sorting the products
		onPrsSortProducts: function (evt) {
			var oList = this.getView().byId("mTblPrdId");
			var oBinding = oList.getBinding("items");
			var oSorter = new sap.ui.model.Sorter("Name", true);
			oBinding.sort(oSorter);
		},

		//function for navigation
		onPrsNavProduct: function (evt) {
			var Obj = evt.getSource().getBindingContext("Product").getObject();
		}
	});
});