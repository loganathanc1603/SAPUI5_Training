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
				expand: "ToSupplier,ToSalesOrderLineItems"
			});

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
			var oModel = this.getOwnerComponent().getModel("NWDB");
			var obj = {
				"ID": 1,
				"Name": "Tokyo Traders",
				"Address": {
					"Street": "NE 40th",
					"City": "Redmond",
					"State": "WA",
					"ZipCode": "98052",
					"Country": "USA"
				}
			};

			obj.Products = [{
				"ID": 9,
				"Name": "Bread",
				"Description": "Whole grain bread",
				"ReleaseDate": new Date(),
				"DiscontinuedDate": null,
				"Rating": 4,
				"Price": "2.5"
			}];

			oModel.create("/Suppliers", obj, {
				success: function (oData) {
					var d = oData;
				},
				error: function (err) {
					var e = err;
				}
			});
		},

		onPrsSaveProduct1: function () {
			var oModel = this.oDataModel;
			if (this.oDataModel.hasPendingChanges()) {
				this.LocalModel.setProperty("/iBusy", true);
				var mSettings = {
					groupId: "changes",
					success: function () {
						this.LocalModel.setProperty("/iBusy", false);
						MessageBox.show("Product Update Successfully.", MessageBox.Icon.SUCCESS, "Success");
						this.onPrsBtnCancel();
					}.bind(this),
					error: function () {
						this.LocalModel.setProperty("/iBusy", false);
					}.bind(this)
				};
				oModel.submitChanges(mSettings);
			} else {
				MessageBox.show("No change found for update.", MessageBox.Icon.ERROR, "Error");
			}
		}

	});

});