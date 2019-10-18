Ext.define('JobOpenings.view.jobapplications.JobAppliedFormController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.jobappliedformcontroller',

    /* on back button click*/
    onBackClick: function(item) {
        var tagPanel = Ext.ComponentQuery.query("jobapplicationsappliedfilterview"),
            tagPanelItm = tagPanel[0].items.items;
        tagPanelItm[3].hide();
        tagPanelItm[4].hide();
        tagPanelItm[5].hide();

        var getDataStore = Ext.ComponentQuery.query('jobapplicationsappliedlistview')[0].down('dataview').getStore();
        getDataStore.removeFilter("filterByLocation");
        getDataStore.removeFilter("filterByExperience");
        getDataStore.removeFilter("filterByDate");

        Ext.ComponentQuery.query('[reference = jobapplicationreference]')[0].getLayout().setActiveItem("mainList");

        Ext.Ajax.request({
            url:Api.URL.jobopenings.READ,
            method: "GET",
            scope: this,
            success: function (resp, b, data, f, g, h) {
                var res = Ext.decode(resp.responseText);
                var msg = res.message;
                Ext.ComponentQuery.query('jobapplicationrequest')[0].items.items[2].store.loadRawData(JSON.parse(resp.responseText))
            },
            failure: function (resp, b) {
                var data = Ext.decode(resp.responseText);
                Ext.toast(data.message, false, 't');
            }
        });
    },
    /* on job openings panel click*/
    onJobOpeningClick: function(vw, record, item, index, e, eOpts) {
        
        x = vw.all.elements;
        for (var i = 0; i < x.length; i++) {
            z = x[i].lastChild.lastChild.lastChild.children[1];
            if (z.className == "act-showcls") {
                z.classList.remove('act-showcls');
                z.classList.add('act-removecls');
            }
        }
        if (e.target.className == "title-cls") {
            var mainView = Ext.ComponentQuery.query('[reference = jobapplicationreference]')[0],
                form = Ext.ComponentQuery.query("jobapplicationformviewmode")[0],
                jobportalField = Ext.ComponentQuery.query('[reference = portalref]')[0];
            mainView.getLayout().setActiveItem(4);
            var myObj = {
                fnameView: record.data.appfirstname,
                lnameView: record.data.applastname,
                jobtitlenameView: record.data.currentjobtitle ? record.data.currentjobtitle.split('&apos;').join('\''):null,
                yearsnameView: record.data.workexpyears,
                monthsnameView: record.data.workexpmonths,
                skillsnameView: record.data.skillnames ? record.data.skillnames.join(', '):null,
                locationnameView: record.data.currentlocation,
                educationnameView: record.data.education,
                univnameView: record.data.collegename,
                mobilenameView: record.data.mobile,
                emailnameView: record.data.emailid,
                hiringnameView: record.data.name,
                portalnameView: record.data.jobportalname,
                appResumeView: record.data.resumename,                
                identificationType: record.data.ddo_jobidentificationtype_id,
                identificationNumber:record.data.identification_num
            };
            form.getForm().setValues(myObj);
            if(myObj.portalnameView == null){
                jobportalField.hide();
            }
            Ext.ComponentQuery.query('[reference = title_applicationCreatRef]')[0].setHtml(window.sessionStorage.newApplicationHead + '/' + 'View Application');
            
        }

        if (e.target.lastChild != null && e.target.className == "act-cls") {//edit delete option hide/show
            if (e.target.lastChild.classList.value !== "act-showcls") {
                item.children[1].children[1].children[2].children[1].className = 'act-showcls';
            } else {
                item.children[1].children[1].children[2].children[1].className = 'act-removecls';
            }
        }

        if (e.target.innerText == "Delete") {/*on delete selected*/
            Ext.Msg.confirm("Confirm", "Are you sure you want to delete this job application?", function (btnText) {
                if (btnText === "no") {
                    //do nothing
                } else if (btnText === "yes") {
                    var params = {
                        ddo_jobapplication_id: record.data.ddo_jobapplication
                    };
                    var url = Api.URL.jobapplication.READ;
                    var method = "DELETE";

                    Ext.Ajax.request({
                        url: url,
                        method: method,
                        scope: this,
                        params: params,
                        success: function (resp, b) {
                            var res = Ext.decode(resp.responseText),
                                msg = res.message;

                            this.getViewModel().getStore('jobApplicationsDataViewStore').load();

                            var params = {
                                ddo_jobopening_id: parseInt(record.data.ddo_jobopening_id)
                            };
                            var url = Api.URL.jobapplication.READ;
                            var method = 'GET';

                            Ext.Ajax.request({
                                url: url,
                                method: method,
                                scope: this,
                                params: params,
                                success: function (resp, b, data, f, g, h) {
                                    this.getViewModel().getStore('jobapplicationsappliedstore').loadRawData(JSON.parse(resp.responseText));
                                },
                                failure: function (resp, b) {}
                            });

                            Ext.Msg.alert('success', msg);
                        },
                        failure: function (resp, b) {
                            var data = Ext.decode(resp.responseText);
                            Ext.toast(data.message, false, 't');

                        }
                    });
                }
            }, this);
        } else if (e.target.innerText == "Edit") { /* on edit selected*/
            var form = Ext.ComponentQuery.query('[reference = jobapplicationreference]')[0];
            form.getLayout().setActiveItem(2);
            var applicationData = record.data;

            var ddo_jobopening_id = record.data.ddo_jobopening_id;
            if (record.data.currentjobtitle != undefined && record.data.currentjobtitle != null) {
                record.data.currentJobTitle = record.data.currentjobtitle.split('&apos;').join('\'');
            } 
            var fields = Ext.ComponentQuery.query('newjobapplyform')[0].getForm().getFields();

            var viewModel = this.getViewModel(),
                filefieldref=Ext.ComponentQuery.query('[reference = fileuploadref]')[0],
                uploadHiddenBtn = Ext.ComponentQuery.query('[reference = uploadhiddenbtnref]')[0],
                uploadHiddenLabel = Ext.ComponentQuery.query('[reference = uploadlabelref]')[0];

                viewModel.set('resumePath', record.data.resumepath);
                filefieldref.value = record.data.resumepath;
                filefieldref.setRawValue(record.data.resumepath);
                filefieldref.setValue(record.data.resumepath);
                
                //viewModel.set('uploadBtnForEditShow', true);
                filefieldref.hide();
                uploadHiddenBtn.show();
                uploadHiddenLabel.show();
                uploadHiddenBtn.setText(record.data.resumename);

            this.loadRecord(record);

            var dataview = this.getReferences().jobapplicationdataview;

            dataview.getStore().reload();
            dataview.refresh();
           
            setTimeout(function () {
                Ext.each(fields.items, function (field) {
                    field.dirty = false;
                    field.wasDirty = false;
                });
            }, 1000);

            Ext.ComponentQuery.query('[reference = title_applicationCreationRef]')[0].setHtml(window.sessionStorage.newApplicationHead + '/' + 'Edit Application');
            window.sessionStorage.ddo_jobapplication = record.data.ddo_jobapplication;
            window.sessionStorage.job_app_form = '0';
        }
        var intervwPerm = true;
        if (e.target.innerText == "Interview") { /* if inteview disabled or not*/
            if (record.data.currentjobtitle==undefined || record.data.currentjobtitle==null) {
                intervwPerm = false;
            }
        }
        if (e.target.innerText == "Interview" && intervwPerm==true) { /*for interview selected*/
            window.sessionStorage.renderingData = JSON.stringify(record.data);
            window.sessionStorage.ddo_jobapplication_id_forApplStatus = record.data.ddo_jobapplication;

            var tagPanel = Ext.ComponentQuery.query("jobapplicationsappliedfilterview"),
                tagPanelItm = tagPanel[0].items.items;
            tagPanelItm[3].hide();
            tagPanelItm[4].hide();
            tagPanelItm[5].hide();

            var getDataStore = Ext.ComponentQuery.query('jobapplicationsappliedlistview')[0].down('dataview').getStore();
            getDataStore.removeFilter("filterByLocation");
            getDataStore.removeFilter("filterByExperience");
            getDataStore.removeFilter("filterByDate");

            var recTitle = record.data.title,
                recAppFirstName = record.data.appfirstname;
            if (recTitle.length > 25) {
                recTitle = recTitle.substring(0, 22) + "...";
            }
            if (recAppFirstName.length > 25) {
                recAppFirstName = recAppFirstName.substring(0, 22) + "...";
            }

            Ext.ComponentQuery.query('[reference = jobapplications_interviewScreenTitle]')[0].setHtml(recTitle + '/' + recAppFirstName + '/' + 'Interview');
            Ext.ComponentQuery.query('[reference = jobapplicationreference]')[0].getLayout().setActiveItem("interviewschd");
            var mainViewModel = Ext.ComponentQuery.query('mainviewport')[0].getViewModel();
            if (mainViewModel.data.addInterviewShow == true) {           
                Ext.ComponentQuery.query('[reference = oninterviewscheduledref]')[0].items.items[0].show();
            }else{
                Ext.ComponentQuery.query('[reference = oninterviewscheduledref]')[0].items.items[0].hide();
            }
            
            
            Ext.ComponentQuery.query('scheduleinterview')[0].items.items[1].items.items[0].store.loadRawData(record);

            Ext.ComponentQuery.query('[reference = interviewerref]')[0].setValue(record.data.ddo_jobapplicationstatus_id);

            Ext.Ajax.request({
                url: Api.URL.jobappinterview.READ,
                method: "GET",
                scope: this,
                success: function (resp, b, data, f, g, h) { 
                    Ext.ComponentQuery.query("oninterviewscheduled")[0].items.items[2].items.items[0].store.loadRawData(JSON.parse(resp.responseText));

                    Ext.ComponentQuery.query("oninterviewscheduled")[0].items.items[2].items.items[0].store.sort('updated','DESC');

                    Ext.ComponentQuery.query("oninterviewscheduled")[0].items.items[2].items.items[0].store.filter({
                        property: 'ddo_jobapplication_id',
                        id: 'filterBy_ddo_jobapplication_id',
                        anyMatch: true,
                        caseSensitie: false,
                        value: record.data.ddo_jobapplication
                    }, record.data.ddo_jobapplication, false);

                    if (Ext.ComponentQuery.query("oninterviewscheduled")[0].items.items[2].items.items[0].store.data.items.length > 0) {
                        var mainViewModel = Ext.ComponentQuery.query('mainviewport')[0].getViewModel();
                        if (mainViewModel.data.addInterviewShow == true) {
                            Ext.ComponentQuery.query("oninterviewscheduled")[0].items.items[0].setHidden(false);
                            Ext.ComponentQuery.query("oninterviewscheduled")[0].items.items[1].setHidden(true);
                            Ext.ComponentQuery.query("oninterviewscheduled")[0].items.items[2].setHidden(false)
                        }else{
                        Ext.ComponentQuery.query("oninterviewscheduled")[0].items.items[0].setHidden(true);
                        Ext.ComponentQuery.query("oninterviewscheduled")[0].items.items[1].setHidden(true);
                        Ext.ComponentQuery.query("oninterviewscheduled")[0].items.items[2].setHidden(false);
                        Ext.ComponentQuery.query("addInterviewPlusIconRef")[0].addCls('requestdetails-cls');
                            
                    }

                       
                    } else {
                        Ext.ComponentQuery.query("oninterviewscheduled")[0].items.items[0].setHidden(true);
                        Ext.ComponentQuery.query("oninterviewscheduled")[0].items.items[1].setHidden(false);
                        Ext.ComponentQuery.query("oninterviewscheduled")[0].items.items[2].setHidden(true);
                    }

                    var interviewSchview = Ext.ComponentQuery.query('[reference = interviewschdref]')[0],
                        jobappViewModel = interviewSchview.getViewModel(),
                        interviewersComboStore = jobappViewModel.getStore('interviewrsStore'),
                        ddo_jobopening_id = record.data.ddo_jobopening_id;

                    interviewersComboStore.getProxy().extraParams = {
                        "ddo_jobopening_id": ddo_jobopening_id
                    };
                    interviewersComboStore.load();
                },
                failure: function (resp, b) {
                    var data = Ext.decode(resp.responseText);
                    Ext.toast(data.message, false, 't');

                }
            });
        }
    },

    /*For getting form dirty fields*/
    loadRecord: function(record) {
        this._record = record;
        return this.setValues(record.getData());
    },
    /*set field values*/
    setValues: function(values) {
        var me = Ext.ComponentQuery.query('newjobapplyform')[0],
            v, vLen, val;

        Ext.suspendLayouts();

        var filename = "";
        if (values.resumepath != "" && values.resumepath != undefined && values.resumepath != null) {
           // filename = values.resumepath.split("/")[values.resumepath.split("/").length - 1];
           filename = values.resumepath;
        }
        

        if (values) {
            var fieldObj = {
                fname: values.appfirstname,
                lname: values.applastname,
                jobtitlename: values.currentjobtitle,
                yearsname: values.workexpyears,
                monthsname: values.workexpmonths,
                skillsname: (values.app_skills != null)?values.app_skills.split(","):null,
                locationname: values.currentlocation,
                educationname: values.ddo_jobeducation_id,
                univname: values.collegename,
                mobilename: values.mobile,
                emailname: values.emailid,
                hiringname: values.ddo_jobhiringsource_id,
                portalname: values.jobportalname,
                appResume:values.resumepath,
                identificationType: values.ddo_jobidentificationtype_id,
                identificationNumber:values.identification_num
            };

            fieldObj.uploadResumeHiddenBtn = values.resumepath;
            me.getForm().setValues(fieldObj);
            var v = values.resumepath,
            btnRef = Ext.ComponentQuery.query('[reference = uploadbuttonref]')[0],
            filefieldref=Ext.ComponentQuery.query('[reference = fileuploadref]')[0];

				btnRef.setText(values.resumename);
                btnRef.setIconCls('x-fa fa-times');
                filefieldref.value = values.resumepath;
                filefieldref.setValue(values.resumepath);
                filefieldref.setRawValue(values.resumepath);
           
            window.sessionStorage.ddo_jobapplication = values.ddo_jobapplication;
            window.sessionStorage.resumepath = values.resumepath;
        }
        Ext.resumeLayouts(true);
        return this;
    },
    /* for view application button clicked*/
    onViewApplicationClick: function(vw, record, item, index, e, eOpts) {
        //for loading applications based on job id
        var jobDataView = Ext.ComponentQuery.query('[reference = jobapplicationdataview]')[0];
        var store = this.getViewModel().getStore('jobapplicationsappliedstore');
       // store.load();
        jobDataView.getStore().clearFilter();
        jobDataView.refresh();
        Ext.ComponentQuery.query('[reference = jobsearchref_job_applied]')[0].setValue("");

        var params = {
            ddo_jobopening_id: parseInt(record.data.ddo_jobopening_id)
        };
        var url = Api.URL.jobapplication.READ;
        var method = 'GET';

        Ext.Ajax.request({
            url: url,
            method: method,
            scope: this,
            params: params,
            success: function (resp, b, data, f, g, h) {
               // store.load();
                Ext.ComponentQuery.query('jobapplicationsappliedlistview')[0].items.items[1].store.loadRawData(JSON.parse(resp.responseText))
                // Ext.ComponentQuery.query('jobapplicationsappliedlistview')[0].getViewModel().getStore('jobapplicationsappliedstore').loadRawData(JSON.parse(resp.responseText))
            },
            failure: function (resp, b) {
                var data = Ext.decode(resp.responseText);
                Ext.toast(data.message, false, 't');

            }
        });

        //for loading applications based on job id

        var tagPanel = Ext.ComponentQuery.query("jobapplicationfilterview"),
            tagPanelItm = tagPanel[0].items.items;
        tagPanelItm[3].hide();
        tagPanelItm[4].hide();
        tagPanelItm[5].hide();
        
        var getDataStore = Ext.ComponentQuery.query('jobapplicationrequest')[0].getViewModel().getStore('jobApplicationsDataViewStore');
        getDataStore.load();
        getDataStore.removeFilter("filterByLocation");
        getDataStore.removeFilter("filterByExperience");
        getDataStore.removeFilter("filterByDate");

        var filterWindow = Ext.ComponentQuery.query('[reference = filterapplicationwinref]')[0];
        if (filterWindow != undefined) {
            var winForm = filterWindow.down('form');
            winForm.getForm().findField('filterlocation').setValue('All');
            winForm.getForm().findField('minworkexperience').setValue('0');
            winForm.getForm().findField('maxworkexperience').setValue('0');
            winForm.getForm().findField('filterDateName').setValue('All');
        }
        
        var jobStatusCombo = Ext.ComponentQuery.query('[reference = jobappliedstatuscomboref]')[0];
        jobStatusCombo.setValue(null);
        jobStatusCombo.getStore().clearFilter();

        window.sessionStorage.ddo_jobopening_id = record.data.ddo_jobopening_id;
        window.sessionStorage.newApplicationHead = record.data.title + "-" + record.data.department_name;
        var recTitle = record.data.title;
        if (recTitle.length > 52) {
            recTitle = recTitle.substring(0, 49) + "...";
        }
        Ext.ComponentQuery.query('[reference = title_applicationViewRef]')[0].setHtml(recTitle + '/' + 'Applications');
        Ext.ComponentQuery.query('[reference = jobapplicationreference]')[0].getLayout().setActiveItem("appliedList");
    },
    /* on container click*/
    onContainerClick: function(vw, record, item) {
        x = vw.all.elements;
        for (var i = 0; i < x.length; i++) {
            z = x[i].lastChild.lastChild.lastChild.children[1];
            if (z.className == "act-showcls") {
                z.classList.remove('act-showcls');
                z.classList.add('act-removecls');
            }
        }
    },
    /* for filters combos hide or show*/
    hideCombobox: function(com, e, eOpts) {
        if (Ext.ComponentQuery.query('[reference = filterapplicationwinref]')[0] == undefined) {
            Ext.create('JobOpenings.view.jobapplications.filtertoolbar.JobApplicationsAppliedAddfilterWindow').show();
        } else {
            var filterWindow = Ext.ComponentQuery.query('[reference = filterapplicationwinref]')[0];
            filterWindow.show();
            var winForm = filterWindow.down('form'),
                formValues = winForm.getValues(),
                viewmodel = this.getViewModel();
            if (viewmodel.data.filtervalue == "filterByLocation") {
                winForm.getForm().findField('filterlocation').setValue('All');
            } else if (viewmodel.data.filtervalue == "filterByExperience") {
                winForm.getForm().findField('minworkexperience').setValue(null);
                winForm.getForm().findField('maxworkexperience').setValue(null);
            } else if (viewmodel.data.filtervalue == "filterByDate") {
                winForm.getForm().findField('filterDateName').setValue('All');
            }
        }
        if(Ext.ComponentQuery.query('[reference = jobapplicationreference]')[0].getLayout().getActiveItem().id == "mainList"){
            Ext.ComponentQuery.query('jobapplicationsappliedfiltercomboboxes')[0].items.items[0].items.items[0].items.items[1].show();
            Ext.ComponentQuery.query('jobapplicationsappliedfiltercomboboxes')[0].items.items[1].items.items[0].items.items[1].show();
        } else {
            Ext.ComponentQuery.query('jobapplicationsappliedfiltercomboboxes')[0].items.items[0].items.items[0].items.items[1].hide();
            Ext.ComponentQuery.query('jobapplicationsappliedfiltercomboboxes')[0].items.items[1].items.items[0].items.items[1].hide();
        }
    },
    /* for close filter click*/
    onCloseFilterClk: function(btn) {
        var parentBtnRef = btn.reference.split('Cancel')[0],
            viewModel = this.getViewModel();

        var parentClassViewItms = Ext.ComponentQuery.query("jobapplicationfilterview")[0].items.items;
        parentClassViewItms.forEach(function (item, index) {
            if (index == 3 || index == 4 || index == 5) {
                if (item.items.items[0].reference == parentBtnRef) {
                    item.hide();
                    var removeFilterValue = (index == 4) ? 'filterByLocation' : (index == 5) ? 'filterByExperience' : 'filterByDate';
                    var dataview = Ext.ComponentQuery.query('jobapplicationrequest')[0].down('dataview');                    
                    var openingsView = Ext.ComponentQuery.query('jobapplicationrequest')[0];
                    var store = openingsView.getViewModel().getStore('jobApplicationsDataViewStore');
                    store.removeFilter(removeFilterValue);
                    viewModel.set("filtervalue",removeFilterValue);
                }
            }
        });
    },
    /* on close filter clicked*/
    onCloseFilterClkapplied: function(btn) {
        var parentBtnRef = btn.reference.split('Cancel')[0],
            viewModel = this.getViewModel();

        var parentClassViewItms = Ext.ComponentQuery.query("jobapplicationsappliedfilterview")[0].items.items;
        parentClassViewItms.forEach(function (item, index) {
            if (index == 3 || index == 4 || index == 5) {
                if (item.items.items[0].reference == parentBtnRef) {
                    item.hide();
                    var removeFilterValue = (index == 4) ? 'filterByLocation' : (index == 5) ? 'filterByExperience' : 'filterByDate';
                    var dataview = Ext.ComponentQuery.query('jobapplicationsappliedlistview')[0].down('dataview');                    
                    var openingsView = Ext.ComponentQuery.query('jobapplicationsappliedlistview')[0];
                    var store = openingsView.getViewModel().getStore('jobapplicationsappliedstore');
                    store.removeFilter(removeFilterValue);
                    viewModel.set("filtervalue",removeFilterValue);
                }
            }
        });

    },
    /* for search field entry*/
    onKeyUpJobSearch: function(searchfield, e, eOpts) {
        var checkView = (Ext.ComponentQuery.query('jobapplications')[0].getLayout().getActiveItem().reference == 'jobapplicationrequestlistview') ? true : false;
        var toGetReferenceView = (checkView) ? this.getReferences().applicationfilterview : this.getReferences().appliedfilterview;
        this.searchJob(toGetReferenceView.down('textfield'), toGetReferenceView.down('combobox'), checkView);
    },
    /* for filter on status slection*/
    onStatusSelectionFilter: function(statuscombo, record, eOpts) {
        var checkView = (Ext.ComponentQuery.query('jobapplications')[0].getLayout().getActiveItem().reference == 'jobapplicationrequestlistview') ? true : false;
        var toGetReferenceView = (checkView) ? this.getReferences().applicationfilterview : this.getReferences().appliedfilterview;
        this.searchJob(toGetReferenceView.down('textfield'), toGetReferenceView.down('combobox'), checkView);

    },
    /* on job search*/
    searchJob: function(searchfield, statuscombo, checkView) { 
        var searchString = searchfield.value,
            dataview = (checkView) ? this.getReferences().jobapplieddataview : this.getReferences().jobapplicationdataview,
            dataviewStore = (checkView)? this.getViewModel().getStore('jobApplicationsDataViewStore'):this.getViewModel().getStore('jobapplicationsappliedstore');

        if (statuscombo.value != null && statuscombo.value != "All" && statuscombo.rawValue != 'All') {
            var statusVal = statuscombo.getSelectedRecord().data.ddo_jobapplicationstatus_id;
        } else if (statuscombo.value == "All" || statuscombo.rawValue == 'All') {
            var statusVal = null;
        } else {
            var statusVal = statuscombo.getValue();
        }

        if (dataviewStore) {
            if (!checkView) {
                if (!Ext.isEmpty(statusVal)) {
                    dataviewStore.filter({
                        property: 'ddo_jobapplicationstatus_id',
                        id: 'ddo_jobapplicationstatus_id',
                        anyMatch: true,
                        caseSensitie: false,
                        value: statusVal
                    }, statusVal, false);
                }else {
                    dataviewStore.removeFilter('ddo_jobapplicationstatus_id');
                }
            }

            if(checkView){
                    if (!Ext.isEmpty(searchString)) {
                    dataviewStore.filter({
                        property: 'title',
                        id: 'title',
                        anyMatch: true,
                        caseSensitie: false,
                        value: searchString
                    }, searchString, false);
                
                }else {
                    dataviewStore.removeFilter('title');
                }

                var obj = {'property':'ddo_jobopeningstatus_id','value':1};
                dataviewStore.addFilter(obj);
            } else {
                 if (!Ext.isEmpty(searchString)) {
                    dataviewStore.filter({
                        property: 'appfirstname',
                        id: 'appfirstname',
                        anyMatch: true,
                        caseSensitie: false,
                        value: searchString
                    }, searchString, false);
                
                }else {
                    dataviewStore.removeFilter('appfirstname');
                }
            }
        }
    }
    
}); 