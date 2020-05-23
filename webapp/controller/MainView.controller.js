sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/ui5/SAPUI5_Session/controller/BaseController",
	"sap/m/MessageBox",
	"com/ui5/SAPUI5_Session/model/formatter"
], function (Controller, BaseController, MessageBox, formatter) {
	return BaseController.extend("com.ui5.SAPUI5_Session.controller.MainView", {
		formatter: formatter,
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
						text: name
					};
				},
				MainCategory: function (oContext) {
					var name = oContext.getProperty("MainCategory");
					return {
						key: name,
						text: name
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
		},

		// function for messagebox
		onPrsBtnMsgBox: function () {
			var msg = this.formatter.setCapitalValue("Test message box");
			//simple message box
			sap.m.MessageBox.show(msg, MessageBox.Icon.SUCCESS, "Title");

			//message box with functions
			if (!msg) {
				MessageBox.show(
					"This message should appear in the message box.", {
						icon: MessageBox.Icon.SUCCESS,
						title: "My message box title",
						actions: [MessageBox.Action.YES, MessageBox.Action.NO],
						emphasizedAction: MessageBox.Action.YES,
						onClose: function (oAction) {
							//do somthing
							if (oAction === "NO") {
								sap.m.MessageToast.show("MessageBox Close event triggered.");
							}
						}
					}
				);
			}
		},

		//function for moving next page [SecondView]
		onPrsBtnNavTo: function () {
			this.getRouter().navTo("SecondView", {
				Obj: "Test"
			}, true);
		},

		//function for nav to smart control page
		onPrsBtnSmartCtrl: function () {
			this.getRouter().navTo("SmartControls", {}, true);
		},

		onPrsBtnVizChart: function () {
			this.getRouter().navTo("VizFrameChart", {}, true);
		},

		onPrsBtnTreeTable: function () {
			this.getRouter().navTo("TreeTable", {}, true);
		},

		onRatingChange: function (oEvent) {
			var fValue = oEvent.getParameter("value");
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			sap.m.MessageToast.show(oResourceBundle.getText("ratingConfirmation", [fValue]));
		},

		Ondblclick: function (evt) {
			sap.m.MessageBox.alert("Double click event triggered");
		}

	});
});