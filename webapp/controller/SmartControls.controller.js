sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/ui5/SAPUI5_Session/model/formatter"
], function (Controller, formatter) {
	"use strict";

	return Controller.extend("com.ui5.SAPUI5_Session.controller.SmartControls", {
		formatter: formatter,
	
		onInit: function () {

		},
		
		fnOnBeforeRebind: function(evt){
			var Obj = evt;
		}


	});

});