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
			// this.fetchData();
			this.getRouter().getRoute("SecondView").attachPatternMatched(this.onObjectMatched, this);
		},

		//fetching the products record using javascript odata read method
		fetchData: function () {
			this.oDataModel.read("/ProductSet", {
				success: function (oData) {
					// var oModel = new JSONModel();
				},
				error: function (err) {
					// var msg = err;
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
				aFilters.push(new Filter("ProductID", FilterOperator.EQ, oProductId[i].getKey()));
			}
			oTable.filter(aFilters);
		},

		onValReqProduct: function () {
			var oD = this.getFragment("com.ui5.SAPUI5_Session.fragments.ProductF4", this._mDialogs);
			this.getView().addDependent(oD);
			oD.open();
		},

		onTitPrsPId: function (evt) {
			var sPath = evt.getSource().getParent().getBindingContextPath();
			var oD = this.getFragment("com.ui5.SAPUI5_Session.fragments.ProductDesc", this._mDialogs);
			this.getView().addDependent(oD);
			oD.bindElement({
				path: sPath
			});
			oD.openBy(evt.getSource());
		},

		onCfrmProduct: function (evt) {
			var selectedItems = evt.getParameter("selectedItems");
			var oProductId = this.byId("mMIpProductId");
			var aTokens = [];

			for (var i = 0; i < selectedItems.length; i++) {
				aTokens.push(new Token({
					key: selectedItems[i].getBindingContext().getObject().ProductID,
					text: selectedItems[i].getBindingContext().getObject().Name
				}));
			}

			oProductId.setTokens(aTokens);
		},

		//searching the value help products
		onSearchProduct: function (evt) {
			var oBinding = evt.getParameter("itemsBinding"),
				Query = evt.getParameter("value"),
				aFilters = [];
			var f1 = new Filter({
				path: "ProductID",
				operator: FilterOperator.Contains,
				value1: Query
			});
			aFilters.push(f1);
			oBinding.filter(aFilters, "Application");
		},

		//update finishe method 
		fnUpdateFinshed: function (evt) {
			var count = evt.getParameter("total");
			var title = "Products ( " + count + " )";
			this.LocalJModel.setProperty("/tableTitle", title);
		},

		onPrsBtnAddProducts: function () {
			this.getRouter().navTo("AddProducts", {}.true);
		}
	

		//Adding the product to database
		// onPrsBtnAddProducts: function () {
		// 	var oModel = this.getOwnerComponent().getModel();
		// 	var sPath = "/ProductSet",
		// 		Obj = {
		// 			"ProductID": "MB-13890",
		// 			"TypeCode": "PR",
		// 			"Category": "Notebooks",
		// 			"Name": "Apple Macbook Pro 32Inch",
		// 			"NameLanguage": "EN",
		// 			"Description": "Apple Monitor 32 inch, 1 TB SDD, 32 GB RAM",
		// 			"DescriptionLanguage": "EN",
		// 			"SupplierID": "0100000000",
		// 			"SupplierName": "SAP",
		// 			"TaxTarifCode": 1,
		// 			"MeasureUnit": "EA",
		// 			"WeightMeasure": "4.200",
		// 			"WeightUnit": "KG",
		// 			"CurrencyCode": "INR",
		// 			"Price": "15000.00",
		// 			"Width": "30.000",
		// 			"Depth": "18.000",
		// 			"Height": "3.000",
		// 			"DimUnit": "CM"
		// 		};
		// 	oModel.create(sPath, Obj, {
		// 		success: function (oData) {
		// 			sap.m.MessageBox.show("Product Created Successfully.", sap.m.MessageBox.Icon.SUCCESS, "Success");
		// 		},
		// 		error: function (error) {
		// 			sap.m.MessageBox.show("Product Creation failed.", sap.m.MessageBox.Icon.ERROR, "Error");
		// 		}
		// 	});
		// }

	});

});