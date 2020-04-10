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

		//function for opening the dialog
		onPrsSortDialog: function () {
			//checking already dialog has assigned for this variable if yes just open the dialog
			if (!this._oSortDialog) {
				//defining the fragment dialog to the variable
				this._oSortDialog = sap.ui.xmlfragment("com.ui5.SAPUI5_Session.fragments.SortDialog", this);
			}
			//adding the dependent of the view for dialog
			this.getView().addDependent(this._oSortDialog);
			//open() method to open the desired dialog
			this._oSortDialog.open();
		},

		//function for sorting with view setting dialog
		onConfirmSorting: function (oEvent) {
			var oTable = this.byId("mTblPrdId"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				sPath,
				bDescending,
				aSorters = [];
			//Getting a defined key
			sPath = mParams.sortItem.getKey();
			//Getting the desc or asc from the control
			bDescending = mParams.sortDescending;
			//Push the values to array
			aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
			// apply the selected sort settings
			oBinding.sort(aSorters);
		},

		//function for navigation
		onPrsNavProduct: function (oEvent) {
			//getting the current object using getBindingContext method
			var Obj = oEvent.getSource().getBindingContext("Product").getObject();
			var oSelectedItem = oEvent.getSource();
			var oContext = oSelectedItem.getBindingContext("Product");
			var sPath = oContext.getPath();

			if (!this._oProductDialog) {
				this._oProductDialog = sap.ui.xmlfragment("com.ui5.SAPUI5_Session.fragments.ProductDetailDialog", this);
			}
			this.getView().addDependent(this._oProductDialog);
			//Setting the value by means of control function
			sap.ui.getCore().byId("txtProductId").setText(Obj.ProductId);
			//Element binding to set the values to dialog
			sap.ui.getCore().byId("sFmPrdtId").bindElement({
				path: sPath,
				model: "Product"
			});
			this._oProductDialog.open();
		},

		//function for closeing the dialog
		fnOnClsePrdDia: function () {
			if (this._oProductDialog) {
				this._oProductDialog.close();
			}
		}
	});
});