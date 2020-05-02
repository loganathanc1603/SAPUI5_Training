sap.ui.define([
	"com/ui5/SAPUI5_Session/controller/BaseController",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function (BaseController, History, MessageBox, JSONModel) {
	"use strict";

	return BaseController.extend("com.ui5.SAPUI5_Session.controller.AddProducts", {

		onInit: function () {
			//creating global variable for odata model instance
			this.oDataModel = this.getOwnerComponent().getModel();
			//Local Jsonmodel
			this.LocalModel = new JSONModel({
				iBusy: false,
				iBusyDelay: 10,
				Title: ""
			});
			this.getView().setModel(this.LocalModel, "LocalModel");

			//Router match handler function to read the parameter
			this.getRouter().getRoute("AddProducts").attachPatternMatched(this.onObjectMatched, this);
		},

		onObjectMatched: function (evt) {
			this.ObjId = evt.getParameter("arguments").ObjId;
		},

		onPrsNavBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = this.getRouter();
				oRouter.navTo("SecondView", {}, true);
			}
		},

		//function for changing the selection option of BP
		onSelectChangeBP: function (evt) {
			var sPath = evt.getParameter("selectedItem").getBindingContext().getPath();

			this.byId("mIpBPName").bindElement({
				path: sPath
			});
		},

		//function for creation of products to data base
		onPrsBtnSave: function () {
			var oEntitySet = "/ProductSet",
				PayloadObj = {},
				View = this.getView(),
				RegExp = /^\d+$/;

			PayloadObj.ProductID = View.byId("mIpPrdId").getValue();
			PayloadObj.Name = View.byId("mIpPrdName").getValue();
			PayloadObj.Description = View.byId("mIpPrdDesc").getValue();
			PayloadObj.Category = View.byId("mSelPrdCat").getSelectedKey();
			PayloadObj.SupplierID = View.byId("mSelBPId").getSelectedKey();
			PayloadObj.SupplierName = View.byId("mIpBPName").getValue();
			PayloadObj.TypeCode = View.byId("mSelTypId").getSelectedKey();
			PayloadObj.TaxTarifCode = parseInt(View.byId("mIpTaxCode").getValue());
			PayloadObj.MeasureUnit = View.byId("mIpMesUnit").getValue();
			PayloadObj.WeightMeasure = View.byId("mIpWgtMes").getValue();
			PayloadObj.WeightUnit = View.byId("mIpWgtUnit").getValue();
			PayloadObj.Price = View.byId("mIpPrice").getValue();
			PayloadObj.CurrencyCode = View.byId("mSelCurrCode").getSelectedKey();
			PayloadObj.Width = View.byId("mIpWidth").getValue();
			PayloadObj.Depth = View.byId("mIpDepth").getValue();
			PayloadObj.Height = View.byId("mIpHeight").getValue();
			PayloadObj.DimUnit = View.byId("mSelDimUnit").getSelectedKey();

			if (PayloadObj.ProductID === "") {
				MessageBox.show("Please provide the Product ID.", MessageBox.Icon.ERROR, "Error");
				View.byId("mIpPrdId").setValueState("Error");
				View.byId("mIpPrdId").setValueStateText("Please enter valid product id.");
				return;
			} else {
				View.byId("mIpPrdId").setValueState("None");
				View.byId("mIpPrdId").setValueStateText(null);
			}

			if (RegExp.test(PayloadObj.TaxTarifCode)) {
				MessageBox.show("Please provide the valid TaxTarifCode.", MessageBox.Icon.ERROR, "Error");
				return;
			}

			View.setBusy(true);
			//calling create method to POST the data to backend
			this.oDataModel.create(oEntitySet, PayloadObj, {
				success: function (oData) {
					View.setBusy(false);
					MessageBox.show("Product Created Successfully.", MessageBox.Icon.SUCCESS, "Success");
				},
				error: function (err) {
					View.setBusy(false);
					var errMsg = JSON.parse(err.responseText).error.message.value;
					MessageBox.show(errMsg, MessageBox.Icon.ERROR, "Error");
				}
			});
		},

		//update function
		onPrsBtnUpdate: function () {
			//Two ways to update the values method 1: update method
			//var obj = this.oDataModel.getProperty("/" + this.ObjId);
			// this.oDataModel.update("/ProductSet('HT-1000')", obj, {
			// 	success: function (oData) {
			// 		var d = oData;
			// 	},
			// 	error: function (err) {
			// 		var e = err;
			// 	}
			// });

			//Method 2: submitChanges()
			var oView = this.getView();
			var oModel = this.oDataModel;
			if (this.oDataModel.hasPendingChanges()) {
				//	oView.setBusy(true);
				oModel.submitChanges({
					success: function () {
						oView.setBusy(false);
					},
					error: function () {
						oView.setBusy(false);
					}
				});
			} else {
				MessageBox.show("No change found for update.", MessageBox.Icon.ERROR, "Error");
			}
		}

	});

});