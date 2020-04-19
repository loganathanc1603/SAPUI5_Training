sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/ui5/SAPUI5_Session/controller/BaseController",
	"sap/ui/core/routing/History",
	"com/ui5/SAPUI5_Session/model/formatter",
	"sap/ui/model/type/String",
	"sap/m/Token",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
], function (Controller, BaseController, History, formatter, typeString, Token, Filter, FilterOperator, JSONModel) {
	"use strict";

	return BaseController.extend("com.ui5.SAPUI5_Session.controller.SecondView", {
		formatter: formatter,
		onInit: function () {
			this._mDialogs = {};
			this.LocalJModel = new JSONModel({
				tableTitle: "Products"
			});
			this.getView().setModel(this.LocalJModel, "LocalModel");
			this.oDataModel = this.getOwnerComponent().getModel();
			this.fetchData();
			this.getRouter().getRoute("SecondView").attachPatternMatched(this.onObjectMatched, this);
		},

		//fetching the products record
		fetchData: function () {
			this.oDataModel.read("/Products", {
				success: function (oData) {
					var oModel = new JSONModel();
				},
				error: function (err) {
					var msg = err;
				}
			});
		},

		onObjectMatched: function (evt) {
			var oRouteObject = evt.getParameter("arguments").Obj;
		},

		onPrsNavBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = this.getRouter();
				oRouter.navTo("MainView", {}, true);
			}
		},

		//filter bar search functionality
		onSearch: function (evt) {
			var oProductId = this.byId("mMIpProductId").getTokens(),
				oTable = this.byId("mTblPrdId").getBinding("items"),
				aFilters = [];
			for (var i = 0; i < oProductId.length; i++) {
				aFilters.push(new Filter("Id", FilterOperator.EQ, oProductId[i].getKey()));
			}
			oTable.filter(aFilters);
		},

		onValReqProduct: function () {
			var oD = this.getFragment("com.ui5.SAPUI5_Session.fragments.ProductF4", this._mDialogs);
			this.getView().addDependent(oD);
			oD.open();
		},

		onCfrmProduct: function (evt) {
			var selectedItems = evt.getParameter("selectedItems");
			var oProductId = this.byId("mMIpProductId");
			var aTokens = [];

			for (var i = 0; i < selectedItems.length; i++) {
				aTokens.push(new Token({
					key: selectedItems[i].getBindingContext().getObject().Id,
					text: selectedItems[i].getBindingContext().getObject().Name
				}));
			}

			oProductId.setTokens(aTokens);
		},

		//update finishe method 
		fnUpdateFinshed: function (evt) {
			var count = evt.getParameter("total");
			var title = "Products ( " + count + " )";
			this.LocalJModel.setProperty("/tableTitle", title);
		}

	});

});