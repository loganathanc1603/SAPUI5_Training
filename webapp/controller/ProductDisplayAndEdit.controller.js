sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/ui5/SAPUI5_Session/controller/BaseController",
	"sap/m/MessageBox",
	"com/ui5/SAPUI5_Session/model/formatter",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel"
], function (Controller, BaseController, MessageBox, formatter, History, JSONModel) {
	"use strict";

	return BaseController.extend("com.ui5.SAPUI5_Session.controller.ProductDisplayAndEdit", {
		formatter: formatter,
		onInit: function () {
			this.getRouter().getRoute("ProductDisplayAndEdit").attachPatternMatched(this.onObjectMatched, this);
		},

		onObjectMatched: function (evt) {
			//OData Model global variable
			this.oDataModel = this.getOwnerComponent().getModel();
			this.ProductPath = "/" + evt.getParameter("arguments").ProductPath;
			this.getView().bindElement(this.ProductPath, {
				expand: "ToSupplier"
			});
			this.setSalesData();
			//Local Json model
			this.LocalModel = new JSONModel({
				iBusy: false,
				iBusyDelay: 10,
				editable: false,
				editBtn: true,
				saveBtn: false,
				cancelBtn: false
			});
			this.getView().setModel(this.LocalModel, "LocalModel");
		},

		setSalesData: function () {
			var oTable = this.byId("mTblPrdId");
			// Making the Columnlist item template on javascript
			var oTemplate = new sap.m.ColumnListItem({
				cells: [
					new sap.m.Text({
						text: "{SalesOrderID}"
					}),
					new sap.m.Text({
						text: "{Note}"
					}),
					new sap.m.Text({
						text: "{ItemPosition}"
					}), new sap.m.Text({
						text: "{GrossAmount}"
					}),
				]
			});

			oTable.bindItems({
				path: this.ProductPath + "/ToSalesOrderLineItems",
				template: oTemplate
			});
		},

		//function for changing the selection option of BP
		onSelectChangeBP: function (evt) {
			var sPath = evt.getParameter("selectedItem").getBindingContext().getPath();
			this.byId("mIpBPName").bindProperty("text", "CompanyName");
			this.byId("mIpBPName").bindElement({
				path: sPath
			});
		},

		onPrsNavBtn: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = this.getRouter();
				oRouter.navTo("SecondView", {}, true);
			}
		},

		onPrsEditProduct: function () {
			this.LocalModel.setProperty("/editable", true);
			this.LocalModel.setProperty("/editBtn", false);
			this.LocalModel.setProperty("/saveBtn", true);
			this.LocalModel.setProperty("/cancelBtn", true);
		},

		onPrsBtnCancel: function () {
			this.LocalModel.setProperty("/editable", false);
			this.LocalModel.setProperty("/editBtn", true);
			this.LocalModel.setProperty("/saveBtn", false);
			this.LocalModel.setProperty("/cancelBtn", false);
		},

		onPrsSaveProduct: function () {
			var oModel = this.oDataModel;
			var oPayloadObj = oModel.getProperty(this.ProductPath);
			delete oPayloadObj.ToSupplier;
			delete oPayloadObj.ToSalesOrderLineItems;
			this.LocalModel.setProperty("/iBusy", true);
			oModel.update(this.ProductPath, oPayloadObj, {
				success: function (oData) {
					this.LocalModel.setProperty("/iBusy", false);
					MessageBox.show("Product Updated Successfully.", MessageBox.Icon.SUCCESS, "Success");
				}.bind(this),
				error: function (err) {
					this.LocalModel.setProperty("/iBusy", false);
					MessageBox.show("Product Update Failed.", MessageBox.Icon.ERROR, "Error");
				}.bind(this)
			});
		}

	});

});