function initModel() {
	var sUrl = "/Northwind/V2/(S(m5jkh3kb4a1wfvfukzfp3s2t))/OData/OData.svc/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}