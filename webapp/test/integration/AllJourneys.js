/* global QUnit*/

sap.ui.define([
	"sap/ui/test/Opa5",
	"com/ui5/SAPUI5_Session/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"com/ui5/SAPUI5_Session/test/integration/pages/MainView",
	"com/ui5/SAPUI5_Session/test/integration/navigationJourney"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "com.ui5.SAPUI5_Session.view.",
		autoWait: true
	});
});