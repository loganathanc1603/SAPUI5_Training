/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/ui5/SAPUI5_Session/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});