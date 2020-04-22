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
				View = this.getView();
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

			//calling create method to POST the data to backend
			this.oDataModel.create(oEntitySet, PayloadObj, {
				success: function (oData) {
					MessageBox.show("Product Created Successfully.", MessageBox.Icon.SUCCESS, "Success");
				},
				error: function (err) {
					var errMsg = JSON.parse(err.responseText).error.message.value;
					MessageBox.show(errMsg, MessageBox.Icon.ERROR, "Error");
				}
			});
		}

	});

});