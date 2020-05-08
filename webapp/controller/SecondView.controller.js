var jsPDF;
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/ui5/SAPUI5_Session/controller/BaseController",
	"sap/ui/core/routing/History",
	"com/ui5/SAPUI5_Session/model/formatter",
	"sap/ui/model/type/String",
	"sap/m/Token",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"com/ui5/SAPUI5_Session/utilities/jspdf.debug",
	"com/ui5/SAPUI5_Session/utilities/jspdf",
	"com/ui5/SAPUI5_Session/utilities/jspdf.plugin.autotable"
], function (Controller, BaseController, History, formatter, typeString, Token, Filter, FilterOperator, JSONModel, MessageBox) {
	"use strict";

	return BaseController.extend("com.ui5.SAPUI5_Session.controller.SecondView", {
		formatter: formatter,
		onInit: function () {
			this._mDialogs = {};
			this.LocalJModel = new JSONModel({
				tableTitle: "Products",
				deleteBtnEnable: false
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

		//on press title product id
		onTitPrsPId: function (evt) {
			var sPath = evt.getSource().getParent().getBindingContextPath();
			var oD = this.getFragment("com.ui5.SAPUI5_Session.fragments.ProductDesc", this._mDialogs);
			this.getView().addDependent(oD);
			oD.bindElement({
				path: sPath
			});
			oD.openBy(evt.getSource());
		},

		//on press titile supplier
		onTitPrsSupplier: function (evt) {
			var oKey = evt.getSource().getParent().getBindingContextPath();
			var oD = this.getFragment("com.ui5.SAPUI5_Session.fragments.SupplierQuickView", this._mDialogs);
			this.getView().addDependent(oD);
			oD.bindElement(oKey, {
				expand: "ToSupplier"
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
			this.getRouter().navTo("AddProducts", {}, true);
		},

		onPrsNavPrdEdit: function (evt) {
			var ObjectId = evt.getSource().getBindingContext().getPath().substr(1);
			var fValue = window.encodeURIComponent(ObjectId);
			this.getRouter().navTo("ProductDisplayAndEdit", {
				ProductPath: fValue
			}, true);
		},

		//function for table selection change
		onSelectionChange: function (evt) {
			this.LocalJModel.setProperty("/deleteBtnEnable", true);
		},

		onPrsBtnDeleteProducts: function () {
			var selectedContext = this.byId("mTblPrdId").getSelectedItem().getBindingContextPath();
			this.byId("mTblPrdId").setBusy(true);
			var mSettings = {
				success: function () {
					this.byId("mTblPrdId").setBusy(false);
					this.byId("mTblPrdId").getBinding("items").filter([]);
					MessageBox.show("Product Deleted Successfully.", MessageBox.Icon.SUCCESS, "Success");
					this.LocalModel.setProperty("/deleteBtnEnable", false);
				}.bind(this),
				error: function (err) {
					this.byId("mTblPrdId").setBusy(false);
					var errMsg = JSON.parse(err.responseText).error.message.value;
					MessageBox.show(errMsg, MessageBox.Icon.ERROR, "Error");
				}.bind(this)
			};
			this.oDataModel.remove(selectedContext, mSettings);
		},

		//OData sorting
		onPrsSortDialog: function () {
			var oD = this.getFragment("com.ui5.SAPUI5_Session.fragments.SortDialog", this._mDialogs);
			this.getView().addDependent(oD);
			oD.open();
		},

		//function for sorting with view setting dialog
		onConfirmSorting: function (oEvent) {
			var oTable = this.byId("mTblPrdId"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				sPath,
				bDescending,
				aSorters = [],
				aGroups = [];

			//Getting a defined key
			sPath = mParams.sortItem.getKey();
			//Getting the desc or asc from the control
			bDescending = mParams.sortDescending;
			//Push the values to array
			aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
			//apply the selected sort settings
			oBinding.sort(aSorters);

			//Grouping
			var oGroup = {
				SupplierName: function (oContext) {
					var name = oContext.getProperty("SupplierName");
					return {
						key: name,
						text: name.toUpperCase()
					};
				},
				Category: function (oContext) {
					var name = oContext.getProperty("Category");
					return {
						key: name,
						text: name.toUpperCase()
					};
				}
			};

			//checking the grouping field
			if (mParams.groupItem) {
				sPath = mParams.groupItem.getKey();
				bDescending = mParams.groupDescending;
				aGroups.push(new sap.ui.model.Sorter(sPath, bDescending, oGroup[sPath]));
				// apply the selected group settings
				oBinding.sort(aGroups);
			}
		},

		createColumnConfig: function () {
			var aCols = [];

			aCols.push({
				label: "Product Id",
				property: ["ProductID"],
				type: "string"
			});

			aCols.push({
				label: 'Name',
				type: 'string',
				property: 'Name',
				scale: 0
			});

			return aCols;
		},

		//downloading the products data on excel spreadsheet
		onExportExcel: function () {
			var ProductData = [],
				oKeys = this.byId("mTblPrdId").getBinding("items").aKeys,
				sN = [],
				Ti = "Products",
				Sub = "Products",
				Authr = "Test",
				fData = [],
				dwnLdTitle = "ProductsData";

			//getting items data
			for (var i = 0; i < oKeys.length; i++) {
				var value = this.oDataModel.getProperty("/" + oKeys[i]);
				ProductData.push(value);
			}

			var bType = "xlsx";
			sN.push("Products Data");
			fData.push(ProductData);
			this.downloadAsExcel(sN, dwnLdTitle, Ti, Sub, Authr, fData, bType);
		},

		//downloading the PDF Documents for products
		onExportPDF: function () {
			var ProductData = [],
				oKeys = this.byId("mTblPrdId").getBinding("items").aKeys,
				aColumns = ["ProductID", "ProductName", "Category", "SupplierName", "Price"],
				rawData = [];

			//getting items data
			for (var i = 0; i < oKeys.length; i++) {
				var value = this.oDataModel.getProperty("/" + oKeys[i]);
				ProductData.push(value);
			}

			//pdf format data 
			for (var j = 0; j < ProductData.length; j++) {
				rawData[j] = [ProductData[j].ProductID,
					ProductData[j].Name,
					ProductData[j].Category,
					ProductData[j].SupplierName,
					ProductData[j].Price
				];
			}

			var getImageFromUrl = function (url, callback) {
				var img = new Image();
				img.onError = function () {
					sap.m.MessageToast('Cannot load image: "' + url + '"');
				};
				img.onload = function () {
					callback(img);
				};
				img.src = url;
			};

			var createPDF = function (imgData) {
				var doc = new jsPDF("l", "pt", "a4");
				doc.addImage(imgData, 'PNG', 90, 5, 1024, 65, 'SAPUI5');
				doc.text("Product Information", 45, 100, {
					contentWidth: 9
				});
				doc.autoTable(aColumns, rawData, {
					margin: {
						top: 120
					}
				});
				doc.save("Products");
			};
			var RootPath = jQuery.sap.getModulePath("com.ui5.SAPUI5_Session");
			getImageFromUrl(RootPath + "/media/SliderImage.png", createPDF);
		}

	});

});