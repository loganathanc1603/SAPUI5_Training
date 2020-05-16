sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/ui5/SAPUI5_Session/controller/BaseController",
	"sap/ui/core/routing/History",
	"sap/viz/ui5/api/env/Format",
	"sap/viz/ui5/format/ChartFormatter"
], function (Controller, BaseController, History, Format, ChartFormatter) {
	"use strict";

	return BaseController.extend("com.ui5.SAPUI5_Session.controller.VizFrameChart", {

		onInit: function () {
			this.LocalModel = new sap.ui.model.json.JSONModel({
				VizData: [],
				ChartType: []
			});
			this.getView().setModel(this.LocalModel, "LocalModel");
			this.fetchData();
			this.setChartType();
			this.setPropertiesChart();
		},
		
		//inital setting for viz chart
		setPropertiesChart: function () {
			Format.numericFormatter(ChartFormatter.getInstance());
			var formatPattern = ChartFormatter.DefaultPattern;

			this.oVizFrame = this.getView().byId("idVizFrame");
			this.oVizFrame.setVizProperties({
				plotArea: {
					dataLabel: {
						formatString: formatPattern.SHORTFLOAT_MFD2,
						visible: true
					}
				},
			});

			var oPopOver = this.getView().byId("idPopOver");
			oPopOver.connect(this.oVizFrame.getVizUid());
			oPopOver.setFormatString(formatPattern.STANDARDFLOAT);
		},

		//fetching the data from api
		fetchData: function () {
			var url = "https://api.covid19api.com/summary";
			var settings = {
				url: url,
				type: "GET",
				dataType: "json"
			};

			$.ajax(settings).done(function (response) {
				this.LocalModel.setProperty("/VizData", response.Countries);
			}.bind(this)).fail(function (err) {});
		},

		// setting the chart type in json model
		setChartType: function () {
			var chartTy = [{
				"Text": "Column",
				"Key": "column"
			}, {
				"Text": "Bar",
				"Key": "bar"
			}, {
				"Text": "Line",
				"Key": "line"
			}, {
				"Text": "Pie",
				"Key": "pie"
			},{
				"Text": "Stacked Column",
				"Key": "stacked_column"
			},{
				"Text": "Donut",
				"Key": "donut"
			}];
			this.LocalModel.setProperty("/ChartType", chartTy);
		},

		onChangeSwitch: function (evt) {
			var oSelected = evt.getParameter("state");
			if (oSelected) {
				var feedValueAxis = this.getView().byId('valueAxisFeed');
				this.oVizFrame.removeFeed(feedValueAxis);
				feedValueAxis.setValues(["TotalRecovered", "TotalConfirmed"]);
				this.oVizFrame.addFeed(feedValueAxis);
			} else {
				var feedValueAxis = this.getView().byId('valueAxisFeed');
				this.oVizFrame.removeFeed(feedValueAxis);
				feedValueAxis.setValues(["TotalConfirmed"]);
				this.oVizFrame.addFeed(feedValueAxis);
			}
		},

		onDataLabelChanged: function (oEvent) {
			if (this.oVizFrame) {
				this.oVizFrame.setVizProperties({
					plotArea: {
						dataLabel: {
							visible: oEvent.getParameter('state')
						}
					}
				});
			}
		},

		//on selection change 
		onSelectionChange: function (evt) {
			var oSelectedKey = evt.getParameter("selectedItem").getKey();
			this.oVizFrame.setVizType(oSelectedKey);
		},

		onPrsNavBtn: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = this.getRouter();
				oRouter.navTo("MainView", {}, true);
			}
		}

	});

});