var XLSX, saveAs;
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/Device",
	"sap/ui/core/format/DateFormat",
	"com/ui5/SAPUI5_Session/utilities/FileSaver",
	"com/ui5/SAPUI5_Session/utilities/xlsx.full.min"
], function (Controller, Device, DateFormat) {
	"use strict";

	return Controller.extend("com.ui5.SAPUI5_Session.controller.BaseController", {

		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		getFragment: function (sFrgNam, obj) {
			var oDialog = obj[sFrgNam];

			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(sFrgNam, this);
				obj[sFrgNam] = oDialog;
				if (Device.system.desktop) {
					oDialog.addStyleClass("sapUiSizeCompact");
				}
			}
			return oDialog;
		},

		//Common excel download function
		downloadAsExcel: function (sheetName, dwnLdTitle, Ti, Sub, Authr, oModel, bType) {
			var wb, array, ws_data, propName, ws, wbout, oDateFormat;
			wb = XLSX.utils.book_new();

			wb.Props = {
				Title: Ti,
				Subject: Sub,
				Author: Authr,
				CreatedDate: new Date()
			};

			for (var m = 0; m < sheetName.length; m++) {
				wb.SheetNames.push(sheetName[m]);
			}

			for (var c = 0; c < oModel.length; c++) {
				array = Object.keys(oModel[c][0]);
				ws_data = [];
				ws_data.push(array);
				jQuery.each(oModel[c], function (propertyName, valueOfProperty) {
					array = [];
					for (propName in valueOfProperty) {
						if (propName !== "__metadata") {
							array.push(valueOfProperty[propName]);
						}
					}
					ws_data.push(array);
				});
				ws = XLSX.utils.aoa_to_sheet(ws_data);
				wb.Sheets[sheetName[c]] = ws;
				wbout = XLSX.write(wb, {
					bookType: bType,
					type: 'binary'
				});
			}

			function s2ab(s) {
				var buf = new ArrayBuffer(s.length);
				var view = new Uint8Array(buf);
				for (var i = 0; i < s.length; i++) {
					view[i] = s.charCodeAt(i) & 0xFF;
				}
				return buf;
			}

			oDateFormat = this.dateFormatLogic(new Date(), "dd.MM.yyyy HH:mm:ss");

			var fileName = dwnLdTitle + " " + oDateFormat + ".xlsx";
			saveAs(new Blob([s2ab(wbout)], {
				type: "application/octet-stream"
			}), fileName);
		},

		dateFormatLogic: function (Dt, pattern) {
			var oDtFmt = DateFormat.getDateTimeInstance({
					pattern: pattern
				}),
				fDt = oDtFmt.format(Dt);
			return fDt;
		}

	});
});