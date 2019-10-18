Ext.define('JobOpenings.view.referrals.JobReferralsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.jobreferralscontroller',
    init: function (application) {
        /* for backspace condition*/
        this.control({
            '[xtype="referralsmain"] field': {
                change: function () {
                    window.sessionStorage.referrals_form_change = '1';
                }
            }
        });
    },
    /* on back click*/
    onBackClick: function (item) {
        var jobSearchField = Ext.ComponentQuery.query('[reference = jobsearchref_job_referrals]')[0];
        jobSearchField.setValue("");
        var jobDataView = Ext.ComponentQuery.query('[reference = jobmyreferralsdata]')[0];
        jobDataView.getStore().clearFilter();

        var tagPanel = Ext.ComponentQuery.query("jobreferralsfilterview"),
            tagPanelItm = tagPanel[0].items.items;
        tagPanelItm[3].hide();
        tagPanelItm[4].hide();
        tagPanelItm[5].hide();

        var getDataStore = Ext.ComponentQuery.query('jobopeningsreferralslistview')[0].down('dataview').getStore();
        getDataStore.removeFilter("filterByLocation");
        getDataStore.removeFilter("filterByDepartment");
        getDataStore.removeFilter("filterByDate");
        Ext.ComponentQuery.query('[reference = jobreferralsreference]')[0].getLayout().setActiveItem("referralsList");
    },
    /* for textfield search*/
    onKeyUpJobSearch: function (searchfield, record, eOpts) {
        var checkView = (Ext.ComponentQuery.query('jobopeningsreferralsview')[0].getLayout().getActiveItem().reference == 'referralslistview') ? true : false;
        var toGetReferenceView = (checkView) ? Ext.ComponentQuery.query("jobreferralsfilterview")[0] : Ext.ComponentQuery.query("jobopenigsmyreferralsfilterview")[0];
        this.searchJob(toGetReferenceView.down('textfield'), checkView);
    },
    /* for job search*/
    searchJob: function (searchfield, checkView) {
        var searchString = searchfield.value,
            dataview = (checkView) ? Ext.ComponentQuery.query('[reference = jobdataviewreferrals]')[0] : Ext.ComponentQuery.query('[reference = jobmyreferralsdata]')[0],
            datviewStore = dataview.getStore();

        if (datviewStore) {
            datviewStore.clearFilter(true);
            if (checkView) {
                var obj = { 'property': 'ddo_jobopeningstatus_id', 'value': 1 };
                datviewStore.addFilter(obj);
            }
            datviewStore.filterBy(function (record) {
                var status = false;
                if (checkView) {
                    var result = record.data.title.search(new RegExp(searchString, 'gi'));
                } else if (record.data.appfirstname) {
                    var result = record.data.appfirstname.search(new RegExp(searchString, 'gi'));
                } else if (record.data.firstname) {
                    var result = record.data.firstname.search(new RegExp(searchString, 'gi'));
                }
                return result >= 0 && true;
            }, this);
        }
    },
    /* for referraL panel click*/
    onJobOpeningClick: function (vw, record, item, index, e, eOpts) {
        
        /* for view mode*/
        if (vw.up('jobopeningsreferralslistview')) {
            var mainView = Ext.ComponentQuery.query('[reference = jobreferralsreference]')[0],
             form = Ext.ComponentQuery.query('jobOpeningsFormDataViewMode')[0];
            mainView.getLayout().setActiveItem(4);
            var recTitle = record.data.title;
            var myObj = {
                titleView: record.data.title.split('&apos;').join('\''),
                ddo_department_idView: record.data.department_name,
                job_descView: Ext.util.Format.stripTags(record.data.description.replace(/<div>/g, '\n<div>')), //record.data.description,
                noofpositionsView: record.data.noofpositions.toString(),
                minsalary: record.data.minsalary,
                maxsalary: record.data.maxsalary,
                closuredateView: record.data.closuredate,
                work_on_priorityView: record.data.work_on_priority,
                ddo_projects_clients_id: record.data.ddo_projects_clients_id,
                minworkexperienceView: record.data.minworkexperience.toString(),
                maxworkexperienceView: record.data.maxworkexperience.toString(),
                skill_idsView: record.data.skillnames.join(", "),
                ddo_joblocation_idView: record.data.location_name,
                interviewers_idsView: record.data.interviewersnames.join(", ")
            }
            form.getForm().setValues(myObj);
        } else{
            if(e.target.className == "title-cls") {
            var mainView = Ext.ComponentQuery.query('[reference = jobreferralsreference]')[0],
                form = Ext.ComponentQuery.query("referralsformview")[0];
            mainView.getLayout().setActiveItem(3);

            var myObj = {
                firstnameView: record.data.appfirstname,
                lastnameView: record.data.applastname,
                emailView: record.data.emailid,
                phoneView: record.data.mobile,
                comboView: record.data.recommendation,
                recommendationView: record.data.relationship,
                appResumeView: record.data.resumename
            };
            var recTitle = record.data.title;


            Ext.ComponentQuery.query('[reference = referralTitleRef]')[0].setHtml(recTitle + '/ ' + 'Refer a Friend');
            form.getForm().setValues(myObj);
            //Ext.ComponentQuery.query('View Referral');
        }
    }
        if (e.target.innerText == "Refer a Friend") {
            var view = Ext.ComponentQuery.query('[reference = jobreferralsreference]')[0],
                viewModel = view.getViewModel(),
                referralFileUpload = Ext.ComponentQuery.query('[reference = referralfileuploadref]')[0],
                referralUploadBtn = Ext.ComponentQuery.query('[reference = referraluploadbtn]')[0];

            uploadBtn = Ext.ComponentQuery.query('[reference = referraluploadbtn]')[0];
            viewModel.set("ddo_jobopening_id", record.data.ddo_jobopening_id);

            var recTitle = record.data.title;
            if (recTitle.length > 52) {
                recTitle = recTitle.substring(0, 49) + "...";
            }

            referralFileUpload.show();
            referralUploadBtn.setText("Choose File");
            referralFileUpload.fileInputEl.dom.value = "";
            Ext.ComponentQuery.query('[reference = referraluploadlabelref]')[0].hide();
            Ext.ComponentQuery.query('[reference = referraluploadhiddenbtnref]')[0].hide();
            Ext.ComponentQuery.query('[reference = title_myreferralsCreationRef]')[0].setHtml(recTitle + '/ ' + 'Refer a Friend');
            Ext.ComponentQuery.query('[reference = jobreferralsreference]')[0].getLayout().setActiveItem("referralMain");

            Ext.ComponentQuery.query('referralsadd')[0].getForm().reset();
            window.sessionStorage.referrals_form_change = '0';

        }
        if (e.target.lastChild != null && e.target.className == "act-cls") {
            if (e.target.lastChild.classList.value !== "act-showcls") {
                item.children[1].children[2].children[1].className = 'act-showcls';
            } else {
                item.children[1].children[2].children[1].className = 'act-removecls';
            }
        }
        else if (e.target.innerText == "Edit") {
            var form = Ext.ComponentQuery.query('[reference = jobreferralsreference]')[0].getLayout().setActiveItem("referralMain");
            var ddo_referral_id = 2;
            var ddo_referral_id = record.data.ddo_referral_id;
            record.data.title = record.data.title.split('&apos;').join('\'');


            // var filefieldref = Ext.ComponentQuery.query('[reference = referralfileuploadref]')[0],
            //     uploadHiddenBtn = Ext.ComponentQuery.query('[reference = referraluploadhiddenbtnref]')[0],
            //     uploadHiddenLabel = Ext.ComponentQuery.query('[reference = referraluploadlabelref]')[0];

            // viewModel.set('resumePath', record.data.resumepath);
            // filefieldref.value = record.data.resumepath;
            // filefieldref.setRawValue(record.data.resumepath);
            // filefieldref.setValue(record.data.resumepath);

            // // viewModel.set('uploadBtnForEditShow', false);
            // filefieldref.hide();
            // uploadHiddenBtn.show();
            // uploadHiddenLabel.show();
            // uploadHiddenBtn.setText(record.data.resumepath);

            this.loadRecord(record);

            var dataview = this.getReferences().jobmyreferralsdata;

            dataview.getStore().reload();
            dataview.refresh();
            var fields = form.getForm().getFields();
            setTimeout(function () {

                Ext.each(fields.items, function (field) {
                    field.dirty = false;
                    field.wasDirty = false;
                });
            }, 1000);
        }
        else if (e.target.innerText == "Delete") {

            Ext.Msg.confirm("Confirm", "Are you sure you want to delete this Job?", function (btnText) {
                if (btnText === "no") {
                    //do nothing
                } else if (btnText === "yes") {

                    var ddo_employeereferral_id = record.data.ddo_employeereferral_id;
                    params = {
                        ddo_employeereferral_id: ddo_employeereferral_id
                    };
                    var url = Api.URL.jobapplication.READ,
                        method = 'DELETE';
                    Ext.Ajax.request({
                        url: url,
                        method: method,
                        scope: this,
                        params: params,
                        success: function (response) {
                            var data = Ext.decode(response.responseText);
                            var dataview = this.getReferences().jobmyreferralsdata;
                            dataview.getStore().reload();
                            dataview.refresh();
                        }
                    });
                }
            }, this);
        }
    },
    /* on container click*/
    onContainerClick: function (vw, record, item) {
        x = vw.all.elements;
        for (var i = 0; i < x.length; i++) {
            z = x[i].lastChild.lastChild.lastChild;
            if (z.className == "act-showcls") {
                z.classList.remove('act-showcls');
                z.classList.add('act-removecls');
            }
        }
    },
    /* to hide combos*/
    hideCombobox: function (com, e, eOpts) {
        if (Ext.ComponentQuery.query('[reference = filterreferwinref]')[0] == undefined) {
            Ext.create('JobOpenings.view.referrals.filtertoolbar.JobReferralsAddfilterWindow').show();
        } else {
            var filterWindow = Ext.ComponentQuery.query('[reference = filterreferwinref]')[0];
            filterWindow.show();
            var winForm = filterWindow.down('form'),
                formValues = winForm.getValues(),
                viewmodel = this.getViewModel();
            if (viewmodel.data.filtervalue == "filterByLocation") {
                winForm.getForm().findField('filterlocation').setValue('All');
            } else if (viewmodel.data.filtervalue == "filterByDepartment") {
                winForm.getForm().findField('filterdepartment').setValue('All');
            } else if (viewmodel.data.filtervalue == "filterByDate") {
                winForm.getForm().findField('filterDateName').setValue('All');
            }
        }
    },
    /* to hide combo*/
    hideComboboxMyReferrals: function (com, e, eOpts) {
        if (Ext.ComponentQuery.query('[reference = filtermyreferwinref]')[0] == undefined) {
            Ext.create('JobOpenings.view.referrals.filtertoolbar.JobMyReferralsAddfilterWindow').show();
        } else {
            var filterWindow = Ext.ComponentQuery.query('[reference = filtermyreferwinref]')[0];
            filterWindow.show();
            var winForm = filterWindow.down('form'),
                formValues = winForm.getValues(),
                viewmodel = this.getViewModel();
            if (viewmodel.data.filtervalue == "filterByLocation") {
                winForm.getForm().findField('filterlocation').setValue('All');
            } else if (viewmodel.data.filtervalue == "filterByDepartment") {
                winForm.getForm().findField('filterdepartment').setValue('All');
            } else if (viewmodel.data.filtervalue == "filterByDate") {
                winForm.getForm().findField('filterDateName').setValue('All');
            }
        }
    },
    /* on referral filter close*/
    onreferralCloseFilterClk: function (btn) {
        var parentBtnRef = btn.reference.split('Cancel')[0],
            viewModel = this.getViewModel();

        var parentClassViewItms = Ext.ComponentQuery.query("jobreferralsfilterview")[0].items.items;
        parentClassViewItms.forEach(function (item, index) {
            if (index == 3 || index == 4 || index == 5) {
                if (item.items.items[0].reference == parentBtnRef) {
                    item.hide();
                    var removeFilterValue = (index == 4) ? 'filterByLocation' : (index == 5) ? 'filterByDepartment' : 'filterByDate';
                    var dataview = Ext.ComponentQuery.query('jobopeningsreferralslistview')[0].down('dataview');
                    var openingsView = Ext.ComponentQuery.query('jobopeningsreferralslistview')[0];
                    var store = openingsView.getViewModel().getStore('jobReferralsDataViewStore');
                    store.removeFilter(removeFilterValue);
                    viewModel.set("filtervalue", removeFilterValue);
                }
            }
        });
    },
    /* on my referral filter close*/
    onCloseFilterClkMyReferrals: function (btn) {
        var parentBtnRef = btn.reference.split('Cancel')[0],
            viewModel = this.getViewModel();

        var parentClassViewItms = Ext.ComponentQuery.query("jobopenigsmyreferralsfilterview")[0].items.items;
        parentClassViewItms.forEach(function (item, index) {
            if (index == 3 || index == 4 || index == 5) {
                if (item.items.items[0].reference == parentBtnRef) {
                    item.hide();
                    var removeFilterValue = (index == 4) ? 'filterByLocation' : (index == 5) ? 'filterByDepartment' : 'filterByDate';
                    var getDataStore = Ext.ComponentQuery.query('jobopenigsmyreferralsview')[0].down('dataview');
                    var openingsView = Ext.ComponentQuery.query('jobopenigsmyreferralsview')[0];
                    var store = openingsView.getViewModel().getStore('jobapplicationsappliedstore');
                    store.removeFilter(removeFilterValue);
                    viewModel.set("filtervalue", removeFilterValue);
                }
            }
        });
    },
    /* on cancel button clicked*/
    onCancelBtnClick: function () {
        var uploadBtn = Ext.ComponentQuery.query('[reference = referraluploadbtn]')[0],
            uploadField = Ext.ComponentQuery.query('[reference = referralfileuploadref]')[0];

        uploadField.show();
        uploadBtn.setText('Choose File');
        uploadBtn.setIconCls('x-fa fa-upload');
        uploadField.fileInputEl.dom.value = "";
        Ext.ComponentQuery.query('[reference = referraluploadlabelref]')[0].hide();
        Ext.ComponentQuery.query('[reference = referraluploadhiddenbtnref]')[0].hide();
        this.lookupReference('referralsForm').getForm().reset();
    },
    /* for file upload*/
    buttonOnlyChange: function (field, value, eval, e, eOpts) {
        var me = this,
            viewModel = me.getViewModel(),
            file = field.fileInputEl.dom.files[0],
            fileValue = field.value,
            reader = new FileReader(),
            format = file.type,
            fileExtension = file.name.split('.')[1],
            uploadField = Ext.ComponentQuery.query('[reference = referralfileuploadref]')[0],
            referraluploadlabel = Ext.ComponentQuery.query('[reference = referraluploadlabelref]')[0],
            referraluploadhiddenBtn = Ext.ComponentQuery.query('[reference = referraluploadhiddenbtnref]')[0];

        reader.onload = function () {
            if (format == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || format == "text/plain" ||format == "application/msword" || format == "application/pdf" || format == "application/doc" || format == "application/docx" || format == "application/txt" || format == "application/wps" || format == "application/odt" || format == "application/vnd.oasis.opendocument.text" || format == "application/wpd" || format == "application/rtf" || fileExtension == "docx" || fileExtension == "doc") {
                /**
               * Docx format preventing due to stored file format issue (Storing like a zip file on server)
               * format == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
               */
                rec = value.replace("C:\\fakepath\\", "");
                viewModel.set('resumePath2', rec);
                var uploadBtn = Ext.ComponentQuery.query('[reference = referraluploadbtn]')[0];
                uploadBtn.setText(rec);
                uploadField.hide();
                referraluploadhiddenBtn.show();
                referraluploadlabel.show();
                referraluploadhiddenBtn.setText(rec);

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

    /* on back button clicked*/
    BackButtonClick: function () {
        if (window.sessionStorage.referrals_form_change == '1') {
            Ext.Msg.confirm("Confirm", "Are you sure you want to go back?", function (btnText) {
                if (btnText === "no") {
                    //do nothing
                } else if (btnText === "yes") {
                    Ext.ComponentQuery.query('[reference = jobreferralsreference]')[0].getLayout().setActiveItem("referralsList");
                    //Ext.getCmp('uploadid').setText('');
                    var referralFileUpload = Ext.ComponentQuery.query('[reference = referralfileuploadref]')[0];
                    referralFileUpload.fileInputEl.dom.value = "";
                    window.sessionStorage.referrals_form_change = '0';
                }
            }, this);
        } else {
            Ext.ComponentQuery.query('[reference = jobreferralsreference]')[0].getLayout().setActiveItem("referralsList");
            var referralFileUpload = Ext.ComponentQuery.query('[reference = referralfileuploadref]')[0];
            referralFileUpload.fileInputEl.dom.value = "";
            window.sessionStorage.referrals_form_change = '0';
        }
        var tagPanel = Ext.ComponentQuery.query("jobreferralsfilterview"),
            tagPanelItm = tagPanel[0].items.items;
        tagPanelItm[3].hide();
        tagPanelItm[4].hide();
        tagPanelItm[5].hide();

        var getDataStore = Ext.ComponentQuery.query('jobopeningsreferralslistview')[0].down('dataview').getStore();
        getDataStore.removeFilter("filterByLocation");
        getDataStore.removeFilter("filterByDepartment");
        getDataStore.removeFilter("filterByDate");
    },
    /* for my referrals view*/
    onMyReferralsView: function (myreferrals, e, eOpts) {
        var params = {
            referred_BY: Ext.getStore('login').data.items[0].data.ddo_employee_id
        };
        var url = Api.URL.jobapplication.READ;
        var method = 'GET';
        Ext.Ajax.request({
            url: url,
            method: method,
            scope: this,
            params: params,
            success: function (resp, b) {
                var res = Ext.decode(resp.responseText),
                    msg = res.message;

                Ext.ComponentQuery.query('jobopenigsmyreferralsview')[0].items.items[1].store.loadRawData(JSON.parse(resp.responseText));
                Ext.ComponentQuery.query('[reference = jobreferralsreference]')[0].getLayout().setActiveItem("myreferrals");

            },
            failure: function (resp, b) {
                var data = Ext.decode(resp.responseText);
                Ext.toast(data.message, false, 't');
            }
        });
        var tagPanel = Ext.ComponentQuery.query("jobopenigsmyreferralsfilterview"),
            tagPanelItm = tagPanel[0].items.items;
        tagPanelItm[3].hide();
        tagPanelItm[4].hide();
        tagPanelItm[5].hide();

        var getDataStore = Ext.ComponentQuery.query('jobopenigsmyreferralsview')[0].down('dataview').getStore();
        getDataStore.removeFilter("filterByLocation");
        getDataStore.removeFilter("filterByDepartment");
        getDataStore.removeFilter("filterByDate");
        Ext.ComponentQuery.query('[reference = jobreferralsreference]')[0].getLayout().setActiveItem("myreferrals");
    },
    /* on refer clicked*/
    onReferClick: function (btn, e, eOpts) {
        var view = this.getView(),
            form = view.down('form').getForm(),
            values = form.getValues(),
            me = this,
            refView = Ext.ComponentQuery.query('[reference = jobreferralsreference]')[0],
            uploadBtn = Ext.ComponentQuery.query('[reference = referraluploadbtn]')[0],
            viewModel = refView.getViewModel();
        var params = {
            referred_by: Ext.getStore('login').data.items[0].data.ddo_employee_id,
            firstName: values.firstname,
            lastName: values.lastname,
            emailId: values.email,
            mobile: parseInt(values.phone),
            Recommendation: values.recommendation,
            Relationship: values.combo,
            resumePath: this.getViewModel().data.resumePath,
            ddo_jobopening_id: viewModel.data.ddo_jobopening_id,
            ddo_jobapplicationstatus_id: 1
        };
        var method = 'POST';
        var url = Api.URL.jobapplication.READ;

        if (uploadBtn.text != "Choose File") {
            btn.up('form').submit({
                url: Api.URL.jobapplication.uploadResume,
                waitMsg: 'Uploading your file...',
                clientValidation: false,
                success: function () {
                    var text = Ext.JSON.decode(arguments[1].response.responseText),
                        resumePath = text.data,
                        fakePath = viewModel.data.resumePath;
                    rec = fakePath.replace("C:\\fakepath\\", "");
                    viewModel.set('resumePath2', rec);
                    viewModel.set('resumePath', '../' + resumePath);
                    params.resumePath = viewModel.get('resumePath');
                    params.resumename = viewModel.get('resumePath2');

                    Ext.Ajax.request({
                        url: url,  //getJobFormData
                        method: method,
                        scope: this,
                        params: params,
                        success: function (resp, b) {
                            var res = Ext.decode(resp.responseText),
                                msg = res.message,
                                uploadBtn = Ext.ComponentQuery.query('[reference = referraluploadbtn]')[0],
                                uploadField = Ext.ComponentQuery.query('[reference = referralfileuploadref]')[0];
                            Ext.Msg.alert('success', msg);
                            uploadField.show();
                            uploadField.fileInputEl.dom.value = "";
                            Ext.ComponentQuery.query('[reference = referraluploadlabelref]')[0].hide();
                            Ext.ComponentQuery.query('[reference = referraluploadhiddenbtnref]')[0].hide();

                            // uploadBtn.setText("Choose File");
                            // uploadBtn.setIconCls('x-fa fa-upload');
                            Ext.ComponentQuery.query('[reference = referralsForm]')[0].getForm().reset();
                            Ext.ComponentQuery.query('jobopenigsmyreferralsview')[0].items.items[1].store.add(params);

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
                        html: 'Record not created',
                        width: 150,
                        align: 't'
                    });
                }
            });
        } else {
            Ext.Ajax.request({
                url: url,  //getJobFormData
                method: method,
                scope: this,
                params: params,
                success: function (resp, b) {
                    var res = Ext.decode(resp.responseText),
                        msg = res.message,
                        uploadBtn = Ext.ComponentQuery.query('[reference = referraluploadbtn]')[0];
                    ;
                    Ext.Msg.alert('success', msg);
                    uploadBtn.setText("Choose File");
                    uploadBtn.setIconCls('x-fa fa-upload');
                    Ext.ComponentQuery.query('[reference = referralsForm]')[0].getForm().reset();
                    Ext.ComponentQuery.query('jobopenigsmyreferralsview')[0].items.items[1].store.add(params);

                    me.onInterviewBackButtonClick();
                },
                failure: function (resp, b) {
                    var data = Ext.decode(resp.responseText);
                    Ext.toast(data.message, false, 't');
                }
            });
        }


    },
    /* on interview back button clicked*/
    onInterviewBackButtonClick: function (item) {
        Ext.Msg.confirm("Confirm", "Job Referral Created Succesfully! Would you like to go back?", function (btnText) {
            if (btnText === "no") {
                //do nothing
            } else if (btnText === "yes") {
                var params = {
                    referred_BY: Ext.getStore('login').data.items[0].data.ddo_employee_id
                };
                var url = Api.URL.jobapplication.READ;
                var method = 'GET';
                Ext.Ajax.request({
                    url: url,
                    method: method,
                    scope: this,
                    params: params,
                    success: function (resp, b) {
                        var res = Ext.decode(resp.responseText),
                            msg = res.message;

                        Ext.ComponentQuery.query('[reference = jobreferralsreference]')[0].getLayout().setActiveItem("myreferrals");
                        Ext.ComponentQuery.query('jobopenigsmyreferralsview')[0].items.items[1].store.loadRawData(JSON.parse(resp.responseText));
                    },
                    failure: function (resp, b) {
                        var data = Ext.decode(resp.responseText);
                        Ext.toast(data.message, false, 't');
                    }
                });
            }
        }, this);
    }
    /*For Setting resetting cancel icon button */
    // hideIconbutton:function(){
    //     var me = this
    //     viewModel = me.getViewModel();
    //     viewModel.set('resumePath', '');
    //     Ext.getCmp('fileuploadId').show();
    //     Ext.getCmp('iconButton').hide();

    // }
});