Ext.define('JobOpenings.view.alljobapplications.AllJobApplicationsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.alljobapplicationscontroller',
    requires: ['JobOpenings.view.alljobapplications.AllJobApplicationsUtil'],
    onGridRowClick: function (ele, record, item, index, e, eOpts) {
        var mainView = Ext.ComponentQuery.query('[reference = alljobapplicationreference]')[0],
            form = Ext.ComponentQuery.query("alljobapplicationsformviewmode")[0],
            jobportalField = Ext.ComponentQuery.query('[reference = portalref]')[0];
        mainView.getLayout().setActiveItem(1);
        var myObj = {
            fnameView: record.data.appfirstname,
            lnameView: record.data.applastname,
            jobtitlenameView: record.data.currentjobtitle ? record.data.currentjobtitle.split('&apos;').join('\'') : null,
            yearsnameView: record.data.workexpyears,
            monthsnameView: record.data.workexpmonths,
            skillsnameView: record.data.skillnames ? record.data.skillnames.join(', ') : null,
            locationnameView: record.data.currentlocation,
            educationnameView: record.data.education,
            univnameView: record.data.collegename,
            mobilenameView: record.data.mobile,
            emailnameView: record.data.emailid,
            hiringnameView: record.data.name,
            portalnameView: record.data.jobportalname,
            appResumeView: record.data.resumename,
            identificationType: record.data.ddo_jobidentificationtype_id,
            identificationNumber: record.data.identification_num
        };
        form.reset();
        form.getForm().setValues(myObj);
        if (myObj.portalnameView == null) {
            jobportalField.hide();
        }
        Ext.ComponentQuery.query('[reference = title_applicationCreatRef]')[0].setHtml(window.sessionStorage.newApplicationHead + '/' + 'View Application');

    },
    //For Search Functiinality In Grid View
    onKeyUpAllJobSearch: function (searchfield, record, eOpts) {
        var me = this.getView();
        var checkView = (Ext.ComponentQuery.query('alljobapplications')[0].getLayout().getActiveItem().reference == 'alljobapplicationsgridviewref') ? true : false;
        var toGetReferenceView = Ext.ComponentQuery.query("alljobapplicationstoolbar")[0];
        if (searchfield.value.length >= 3) {
            this.searchJob(searchfield, checkView);
        } else if (searchfield.value.length == 0) {
            var store = this.getViewModel().getStore('allJobAllicationsGridViewStore');
            store.clearFilter(true);
            store.load();
        }
    },
    /* for job search*/
    searchJob: function (searchfield, checkView) {
        var searchString = searchfield.value,
            dataview = Ext.ComponentQuery.query('[reference = alljobapplicationsgridviewref]')[0],
            datviewStore = this.getViewModel().getStore('allJobAllicationsGridViewStore');

        if (datviewStore) {
            datviewStore.clearFilter(true);
            if (checkView) {
                var obj = {
                    'property': 'ddo_jobopeningstatus_id',
                    'value': 1
                };
                datviewStore.addFilter(obj);
            }

            if (searchString.length >= 3) {
                datviewStore.filterBy(function (record) {
                    var status = false,
                        recruiter = false,
                        appfirstname = false;
                    if (appfirstname || record.data.recruiter) {
                        //console.log("hhhhhh");
                        var result = record.data.recruiter.search(new RegExp(searchString, 'gi'));
                        if (result == 0) {
                            recruiter = true;
                        }
                    }
                    if (recruiter == false) {
                        if (record.data.appfirstname) {
                            appfirstname = true;
                           // console.log(record.data.appfirstname);
                            var result = record.data.appfirstname.search(new RegExp(searchString, 'gi'));
                        }
                    }
                    return result >= 0 && true;
                }, this);
            } else if (searchString.length == 0) {
                datviewStore.clearFilter(true);
                datviewStore.load();
            }
        }
    },

    // Back From View Mode to Grid
    onAllJobApplicationBackButtonClick: function () {
        Ext.ComponentQuery.query('[reference = alljobapplicationreference]')[0].getLayout().setActiveItem(0);
    },
    exceluploadClick: function (ele, e, eOpts) {
        var me = this.getView();
        Ext.create('JobOpenings.view.alljobapplications.AllJobApplicationExcelFileUploadWindow', {
            vmStore: me.getViewModel().getStore('allJobAllicationsGridViewStore')
        }).show();
    },
    buttonOnlyChange: function (field, value, eval, e, eOpts) {
        var me = this,
            viewModel = me.getViewModel(),
            fileValue = field.value;
        rec = value.replace("C:\\fakepath\\", "");
        viewModel.set('resumePath2', rec);
        var uploadBtn = Ext.ComponentQuery.query('[reference = excelfileuploadbtn]')[0];
        uploadBtn.setText(rec);
    },
    uploadExcelfile: function (btn, e, options) {
        var formRef = btn.up('form');
        var store = btn.up('window').vmStore;
        var win = btn.up('window');
        var combox = formRef.down('combobox');
        ddo_jobopening_id = combox.value;

        if (formRef.isValid()) {
            var formField = formRef.down('filefield');
            formField.ddo_jobopening_id = combox.value;
            JobOpenings.view.alljobapplications.AllJobApplicationsUtil.convertFileToJson(formField, function (data) {
                var formatedArray = data.map(function (el) {
                    var o = Object.assign({}, el);
                    o.ddo_jobopening_id = combox.value;
                    return o;
                });
                if (formatedArray) {
                    params = {
                        applications: formatedArray
                    };
                    Ext.Ajax.request({
                        url: Api.URL.jobapplication.jobapplications,
                        method: 'POST',
                        scope: this,
                        jsonData: params,
                        success: function (resp) {
                            var res = Ext.decode(resp.responseText),
                                msg = res.message;
                            store.load();
                            win.close();
                            console.log(data);
                            Ext.Msg.alert('success', msg);
                        }
                    });

                } else {
                    Ext.toast('Invalid File Format',
                        'Message',
                        't');
                }
            });
        } else {
            Ext.toast('Please upload the file', 'Message', 't');
        }
    }
});