sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function (JSONModel) {
	"use strict";
	return {
		getStatusOfQnty: function (sValue) {
			var output;
			if (sValue) {
				if (parseInt(sValue) < 10) {
					output = "Success";
				} else if (parseInt(sValue) > 25) {
					output = "Warning";
				} else {
					output = "Error";
				}
			}
			return output;
		},

		setCapitalValue: function (Val) {
			if (Val) {
				return Val.toUpperCase();
			}
		},

		getStatusOfMain: function (Val) {
			if (Val) {
				if (Val === "Computer Systems") {
					return "Success";
				} else {
					return "Warning";
				}
			}
		}
	};
});