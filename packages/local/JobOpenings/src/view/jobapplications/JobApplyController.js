Ext.define('JobOpenings.view.jobapplications.JobApplyController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.jobapplycontroller',
	requires: ['JobOpenings.view.jobapplications.NewJobApplyForm'],

	init: function (application) {
		/* for form back condition*/
		this.control({
			'[xtype="newjobapplyform"] field': {
				change: function () {
					window.sessionStorage.job_app_form = '1';
				}
			}
		});
	},
	/* on cancel button clicked*/
	onCancelBtnClick: function () {
		var btnRef = Ext.ComponentQuery.query('[reference = uploadbuttonref]')[0],
 		    uploadField = Ext.ComponentQuery.query('[reference = fileuploadref]')[0];
	 		uploadField.show();
	 		btnRef.setText('Choose File');
	 		btnRef.setIconCls('x-fa fa-upload');
	 		uploadField.fileInputEl.dom.value = "";
 		 Ext.ComponentQuery.query('[reference = uploadlabelref]')[0].hide();
         Ext.ComponentQuery.query('[reference = uploadhiddenbtnref]')[0].hide();
 
 	// window.sessionStorage.ddo_jobapplication = undefined;
  		 this.lookupReference('applyForm').getForm().reset();
	},
	/* for upload file*/
	buttonOnlyChange: function (field, value, e) {
		var me = this,
			viewModel = me.getViewModel(),
			file = field.fileInputEl.dom.files[0],
			fileValue = field.value,
			reader = new FileReader(),
			format = file.type;
			fileExtension = file.name.split('.')[1];
			console.log("format check:",format);

		reader.onload = function () {
			if (format == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || format == "text/plain" ||format == "application/msword" || format == "application/pdf" || format == "application/doc" || format == "application/docx" || format == "application/txt" || format == "application/wps" || format == "application/odt" || format == "application/vnd.oasis.opendocument.text" || format == "application/wpd" || format == "application/rtf" || fileExtension == "docx" || fileExtension == "doc" ) {

				var appl = value.replace("C:\\fakepath\\", "");
				viewModel.set('resumePath2', appl);

				viewModel.set('uploadBtnForEditShow', false);

				var filefieldref = Ext.ComponentQuery.query('[reference = fileuploadref]')[0],
					uploadBtnLabel = Ext.ComponentQuery.query('[reference = uploadlabelref]')[0],
					uploadHiddenBtn = Ext.ComponentQuery.query('[reference = uploadhiddenbtnref]')[0],
					uploadButton = Ext.ComponentQuery.query('[reference = uploadbuttonref]')[0];

				uploadHiddenBtn.show();
				uploadHiddenBtn.setText(appl);
				uploadBtnLabel.show();
				filefieldref.hide();
				Ext.toast({
					html: 'Your file uploaded successfully..!!',
					width: 150,
					align: 't'
				});

			} else {
				Ext.toast({
					html: 'Invalid Format',
					width: 150,
					align: 't'
				});
			}
		};
		reader.readAsDataURL(file);
	},
	/* on interview back button clicked*/
	onInterviewBackButtonClick: function (item) {
		if (this.getReferences().applyForm != undefined) {
			this.getReferences().applyForm.getForm().getFields().items[12].hide();
		}
		if (window.sessionStorage.job_app_form == '1') {
			Ext.Msg.confirm("Confirm", "Would you like to go back?", function (btnText) {
				if (btnText === "no") {
					//do nothing
				} else if (btnText === "yes") {
					this.onInterviewBackButtonClickFunc(item);
				}
			}, this);
		} else {
			this.onInterviewBackButtonClickFunc(item);
		}
	},
	/* on interview back button clicked*/
	onInterviewBackButtonClickFunc: function (item) {
		window.sessionStorage.ddo_jobapplication = undefined;
		var params = {
			ddo_jobopening_id: parseInt(window.sessionStorage.ddo_jobopening_id),
			isjobApp: true
		};
		var url = Api.URL.jobapplication.READ;
		var method = 'GET';
		Ext.Ajax.request({
			url: url,
			method: method,
			scope: this,
			params: params,
			success: function (resp, b, data, f, g, h) {
				var res = Ext.decode(resp.responseText);
				var msg = res.message;
				Ext.ComponentQuery.query('jobapplicationsappliedlistview')[0].items.items[1].store.loadRawData(JSON.parse(resp.responseText))
			},
			failure: function (resp, b) {
				var data = Ext.decode(resp.responseText);
				Ext.toast(data.message, false, 't');
			}
		});

		var tagPanel = Ext.ComponentQuery.query("jobapplicationsappliedfilterview"),
			tagPanelItm = tagPanel[0].items.items;
		tagPanelItm[3].hide();
		tagPanelItm[4].hide();
		tagPanelItm[5].hide();

		var getDataStore = Ext.ComponentQuery.query('jobapplicationsappliedlistview')[0].down('dataview').getStore();
		getDataStore.removeFilter("filterByLocation");
		getDataStore.removeFilter("filterByDepartment");
		getDataStore.removeFilter("filterByDate");

		Ext.ComponentQuery.query('[reference = jobapplicationreference]')[0].getLayout().setActiveItem("appliedList");
	},
	/* save function*/
	onSaveFunc: function (btn, e, opts) {
		var view = this.getView(),
			me = this,
			form = view.down('form').getForm(),
			values = form.getValues(),
			viewModel = view.getViewModel(),
			uploadHiddenBtn = Ext.ComponentQuery.query('[reference = uploadhiddenbtnref]')[0],
			fileUpload = Ext.ComponentQuery.query('[reference = fileuploadref]')[0],
			resumePath = window.sessionStorage.resumepath;

		var params = {
			ddo_jobapplicationstatus_id: 1,
			ddo_jobeducation_id: values.educationname,
			ddo_jobhiringsource_id: values.hiringname,
			ddo_jobidentificationtype_id: values.identificationType,
			firstName: values.fname,
			lastName: values.lname,
			currentJobTitle: values.jobtitlename,
			workExpYears: parseInt(values.yearsname),
			workExpMonths: parseInt(values.monthsname),
			currentLocation: values.locationname,
			collegeName: values.univname,
			mobile: parseInt(values.mobilename),
			emailId: values.emailname,
			jobPortalName: values.portalname,
			identification_num:values.identificationNumber,
			resumePath: viewModel.get('resumePath') || fileUpload.value,
			app_skills: values.skillsname.toString()
		};
		params.resumename = viewModel.get('resumePath2');

		var method = "";
		if (isNaN(window.sessionStorage.ddo_jobapplication)) {
			method = 'POST';
			window.sessionStorage.ddo_jobapplication = undefined;
			params.ddo_jobopening_id = parseInt(window.sessionStorage.ddo_jobopening_id);
		} else {
			params.ddo_jobapplication_id = parseInt(window.sessionStorage.ddo_jobapplication);
			method = 'PUT';
		}

		if(fileUpload.value != ""){
			if (viewModel.get('uploadBtnForEditShow') == false) {
				btn.up('form').submit({
					url: Api.URL.jobapplication.uploadResume,
					clientValidation: false,
					waitMsg: 'Uploading your file...',
					success: function () {
						var text = Ext.JSON.decode(arguments[1].response.responseText),
							resumePathApp = text.data,
							fakePath = viewModel.data.resumePath;
						var appl = fakePath.replace("C:\\fakepath\\", "");
						viewModel.set('resumePath', '../' + resumePathApp);
						viewModel.set('resumePath2', appl);
						params.resumePath = resumePathApp;
						viewModel.set('uploadBtnForEditShow', true);				
						var url = Api.URL.jobapplication.READ;
						Ext.Ajax.request({
							url: url,
							method: method,
							scope: this,
							params: params,
							success: function (resp, b) {
								//this.getReferences().applyForm.getForm().getFields().items[12].hide();
								if (isNaN(window.sessionStorage.ddo_jobapplication)) {
									Ext.ComponentQuery.query('jobapplicationsappliedlistview')[0].items.items[1].store.add(params);
								}
								var res = Ext.decode(resp.responseText),
									msg = res.message,
									filefieldref = Ext.ComponentQuery.query('[reference = fileuploadref]')[0],
									uploadBtnLabel = Ext.ComponentQuery.query('[reference = uploadlabelref]')[0],
									uploadHiddenBtn = Ext.ComponentQuery.query('[reference = uploadhiddenbtnref]')[0],
									uploadButton = Ext.ComponentQuery.query('[reference = uploadbuttonref]')[0];
	
								filefieldref.show();
								uploadButton.setIconCls('x-fa fa-upload');
								uploadButton.setText('Choose File');
								uploadHiddenBtn.hide();
								uploadBtnLabel.hide();
								Ext.ComponentQuery.query('[reference = applyForm]')[0].getForm().reset();
								window.sessionStorage.ddo_jobapplication = undefined;
								window.sessionStorage.job_app_form = '0';
								Ext.Msg.alert('success', msg);
								me.onInterviewBackButtonClick();
							},
							failure: function (resp, b) {
								var data = Ext.decode(resp.responseText);
								Ext.toast(data.message, false, 't');
							}
						});
					},
					failure: function () {
						Ext.toast({
							html: 'Please fill all the required fields before uploading the file',
							width: 150,
							align: 't'
						});
					}
				});
			} else {
				var url = Api.URL.jobapplication.READ;
				Ext.Ajax.request({
					url: url,
					method: method,
					scope: this,
					params: params,
					success: function (resp, b) {
						//this.getReferences().applyForm.getForm().getFields().items[12].hide();
						if (isNaN(window.sessionStorage.ddo_jobapplication)) {
							Ext.ComponentQuery.query('jobapplicationsappliedlistview')[0].items.items[1].store.add(params);
						}
						var res = Ext.decode(resp.responseText),
							msg = res.message,
							filefieldref = Ext.ComponentQuery.query('[reference = fileuploadref]')[0],
							uploadBtnLabel = Ext.ComponentQuery.query('[reference = uploadlabelref]')[0],
							uploadHiddenBtn = Ext.ComponentQuery.query('[reference = uploadhiddenbtnref]')[0],
							uploadButton = Ext.ComponentQuery.query('[reference = uploadbuttonref]')[0];
	
						filefieldref.show();
						uploadButton.setIconCls('x-fa fa-upload');
						uploadButton.setText('Choose File');
						uploadHiddenBtn.hide();
						uploadBtnLabel.hide();
						Ext.ComponentQuery.query('[reference = applyForm]')[0].getForm().reset();
						window.sessionStorage.ddo_jobapplication = undefined;
						window.sessionStorage.job_app_form = '0';
						Ext.Msg.alert('success', msg);
						me.onInterviewBackButtonClick();
					},
					failure: function (resp, b) {
						var data = Ext.decode(resp.responseText);
						Ext.toast(data.message, false, 't');
					}
				});
			}
		}else{
			Ext.toast("Please Upload the file",false,'t');
		}	


	},
	/* for form reset*/
	resetForm: function () {
		Ext.suspendLayouts();
		var form = this.getReferences().newjobapplyform;
		var fields = form.getForm().getFields().items;

		Ext.each(fields, function (f) {
			f.value = "";
			f.originalValue = "";
			var desc_field = fields[3],
				department_field = fields[2].rawValue;

			if (desc_field.isDirty() == true || department_field == "Not Found") {
				desc_field.setValue("");
				department_field.replace(department_field, "");

			}
			f.resetToInitialValue();
		});
		Ext.resumeLayouts(true);

	},
	/* for skills render*/
	onSkillRender: function (combo, eOpts) {
		var comboStore = combo.getStore('JobOpenings.store.filtertoolbar.JobSkillsTypeStore');
		comboStore.load();
	},

	/* for hiring source selected*/
	onHiringSourceSelection: function (combo, eOpts) {
		if (combo.value == 3) {
			this.getReferences().applyForm.getForm().getFields().items[12].show();
		} else {
			this.getReferences().applyForm.getForm().getFields().items[12].hide();
		}
	},
	onMobileNumEnter:function(mobile, e, eOpts){
		if(mobile.value.length < 10){
			var msg ="Please enter 10 digit mobile number";
			Ext.Msg.alert('Warning', msg);
		}
	}

});
