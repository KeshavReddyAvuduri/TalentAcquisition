Ext.define('JobOpenings.view.jobapplications.JobApplicationsViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.jobapplicationsviewController',

    init: function(application) {
        /* application for back buttons*/
        this.control({
            '[reference="intervwformref"] field': {
                change: function() {
                    window.sessionStorage.job_app_form = '1';
                }
            }
        });
    },
    /* on panel click. Various conditions*/
    onMyPanelsClick: function(vw, record, item, index, e, eOpts) {
        var needPut = false;
        if (e.target.tagName == "LABEL") {//for cancel label
            item.children[1].children[0].children[0].children[5].innerText = "";
            item.children[1].children[0].children[1].children[5].innerHTML = "Awaiting for Feedback";
            item.children[1].children[0].children[1].children[6].innerHTML = '<div class="intervw-sched-cancel-link-cls"><i class="cancel-interview-iconcls arrow-cls"></i>Cancel</div><div class="intervw-sched-reschedule-link-cls"><i class="reschedule-interview-iconcls arrow-cls"></i>Reschedule</div><div class="intervw-sched-delete-link-cls"><i class="delete-interview-iconcls arrow-cls"></i>Delete</div>';
            //item.children[1].children[0].children[1].children[6].innerHTML = '<div class="intervw-sched-cancel-link-cls">Cancel</div><div class="intervw-sched-reschedule-link-cls">Reschedule</div><div class="intervw-sched-delete-link-cls">Delete</div>';
        } else if(e.target.tagName == "BUTTON"){
            needPut = true;
        } else if (e.target.innerText == "Cancel") {//for cancel of otherval
            item.children[1].children[0].children[0].children[5].innerText = "Reason for Cancelling";
            item.children[1].children[0].children[1].children[5].innerHTML = '<textarea class="intrvw_textarea2" name="feedbackTextArea"></textarea>';
            item.children[1].children[0].children[1].children[6].innerHTML = "<button class='intvwsubmit-btn2'>Confirm</button><label class='intrvwReqCancel_lbl' style='margin:33px;'>Cancel</label>";
            window.sessionStorage.cancelOrRescheduleParam = "1";
        } else { }

        if (e.target.tagName == "TEXTAREA") {//for textarea
            window.sessionStorage.job_app_form = '1';
        } else {
            window.sessionStorage.job_app_form = '0';
        }

        if (e.target.innerText == "Reschedule") {//if interview reschedule
            item.children[1].children[0].children[0].children[5].innerText = "Reason for Rescheduling";
            item.children[1].children[0].children[1].children[5].innerHTML = '<textarea class="intrvw_textarea2" name="feedbackTextArea"></textarea>';
            item.children[1].children[0].children[1].children[6].innerHTML = "<button class='intvwsubmit-btn2'>Confirm</button><label class='intrvwReqCancel_lbl' style='margin:33px;'>Cancel</label>";
            window.sessionStorage.cancelOrRescheduleParam = "2";
        }

        var isDelete = false;
        if (e.target.innerText == "Delete") {//if deleting
            needPut = true;
            isDelete = true;
        }

        if (needPut) {//updating interview
            var url = Api.URL.jobappinterview.READ,
                method = (isDelete) ? 'DELETE' : 'PUT';
            var ddo_jobapplicationinterview_id = record.data.ddo_jobapplicationinterview_id;

            if (isDelete) {
                var params = {
                    ddo_jobapplicationinterview_id: ddo_jobapplicationinterview_id
                }
            } else {
                var params = {
                    ddo_jobapplication_id: record.data.ddo_jobapplication_id,
                    ddo_jobinterviewstatus_id: (window.sessionStorage.cancelOrRescheduleParam == "1") ? 4 : 3,
                    ddo_interviewrating_id: 3,
                    feedback: (e.target.tagName == "BUTTON") ? item.children[1].children[0].children[1].children[5].children["0"].value : "",
                    interviewer_id: record.data.interviewer_id,
                    interviewtype: record.data.interviewtype,
                    interviewdate: record.data.interviewdate,
                    interviewtime: record.data.interviewtime,
                    ddo_jobapplicationinterview_id: ddo_jobapplicationinterview_id
                }
            }

            var isRecDelete = false;
            Ext.Ajax.request({
                url: url,  //getJobFormData
                method: method,
                scope: this,
                params: params,
                success: function (resp, b) {
                    var res = Ext.decode(resp.responseText);
                    var msg = res.message;
                    isRecDelete = true;
                    if (isRecDelete) {
                        this.getView().getReferences().oninterviewscheduledref.items.items[2].items.items[0].store.load();
                        /*Ext.Ajax.request({
                            url: "/jobappinterview",
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
                                    value: record.data.ddo_jobapplication_id
                                }, record.data.ddo_jobapplication_id, false);
                            },
                            failure: function (resp, b) {
                                var data = Ext.decode(resp.responseText);
                                //Ext.toast(data.message, false, 't');

                            }
                        });*/
                    }
                    Ext.Msg.alert('success', msg);

                    /* for after rescheduling confirmed*/
                    if (window.sessionStorage.cancelOrRescheduleParam == "2") {
                        this.getView().getReferences().oninterviewscheduledref.items.items[0].hide();
                        this.getView().getReferences().oninterviewscheduledref.items.items[1].show();
                        var myForm = this.getView().getReferences().oninterviewscheduledref.items.items[1].items.items[1].items.items[0].getForm(),
                            myFormFields = myForm.getFields();

                        myFormFields.items[1].setValue(record.data.interviewer_id);
                        myFormFields.items[2].setValue(record.data.interviewtype);
                    }
                },
                failure: function (resp, b) {
                    var data = Ext.decode(resp.responseText);
                    Ext.toast(data.message, false, 't');
                }
            });
        }
    },
    /* on back button click*/
    onBackClick: function(item) {
        if (window.sessionStorage.job_app_form == '1') {
            Ext.Msg.confirm("Confirm", "Are you sure you want to go back?", function (btnText) {
                if (btnText === "no") {
                    //do nothing
                } else if (btnText === "yes") {
                    this.onBackClickFunc(item);
                }
            }, this);
        } else {
            this.onBackClickFunc(item);
        }
    },
    /* on back button click*/
    onBackClickFunc: function(item) {
        Ext.ComponentQuery.query('interviewrequestdetailsform')[0].items.items[1].items.items["0"].getForm().reset();
        window.sessionStorage.job_app_form = '0';
        Ext.ComponentQuery.query('[reference = jobapplicationreference]')[0].getLayout().setActiveItem("appliedList");
        var params = {
            ddo_jobopening_id: JSON.parse(window.sessionStorage.renderingData).ddo_jobopening_id
        };
        var url = Api.URL.jobapplication.READ;
        var method = 'GET';

        Ext.Ajax.request({
            url: url,
            method: method,
            scope: this,
            params: params,
            success: function (resp, b, data, f, g, h) {
                Ext.ComponentQuery.query('jobapplicationsappliedlistview')[0].items.items[1].store.loadRawData(JSON.parse(resp.responseText))
            },
            failure: function (resp, b) {
                var data = Ext.decode(resp.responseText);
                Ext.toast(data.message, false, 't');

            }
        });
    },
    /* on new interview request creation*/
    onInterviewSaveBtnClick2: function(btn, e, eOpts) {
        var viewModel = this.getViewModel(),
            intvwform = this.getReferences().intervwformref,
            formValues = intvwform.getValues();
        this.saveInterviewFormData(formValues);
    },
    /* on new interview request creation*/
    saveInterviewFormData: function(formValues) {
        var viewModel = this.getViewModel(),
            intvwform = this.getReferences().intervwformref;
            var url = Api.URL.jobappinterview.READ,
            method = 'POST';

        var params = {
            ddo_jobapplication_id: JSON.parse(window.sessionStorage.renderingData).ddo_jobapplication,//1,
            ddo_jobinterviewstatus_id: 1,
            ddo_interviewrating_id: 3,
            feedback: "",
            interviewer_id: formValues.interviewer_id,
            interviewtype: formValues.interviewtype,
            interviewdate: formValues.interviewdate,
            interviewtime: formValues.interviewtime,
            interviewmode: formValues.interviewmode
        }

        var isRecDelete = false;
        Ext.Ajax.request({
            url: url,
            method: method,
            scope: this,
            params: params,
            success: function (resp, b) {
                var res = Ext.decode(resp.responseText);
                var msg = res.message;
                Ext.ComponentQuery.query("oninterviewscheduled")[0].items.items[0].setHidden(false);
                Ext.ComponentQuery.query("oninterviewscheduled")[0].items.items[1].setHidden(true);
                isRecDelete = true;
                if (isRecDelete) {
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
                                value: JSON.parse(window.sessionStorage.renderingData).ddo_jobapplication
                            }, JSON.parse(window.sessionStorage.renderingData).ddo_jobapplication, false);

                            Ext.ComponentQuery.query("oninterviewscheduled")[0].items.items[0].setHidden(false);
                            Ext.ComponentQuery.query("oninterviewscheduled")[0].items.items[1].setHidden(true);
                            Ext.ComponentQuery.query("oninterviewscheduled")[0].items.items[2].setHidden(false);

                            Ext.ComponentQuery.query('interviewrequestdetailsform')[0].items.items[1].items.items["0"].getForm().reset();
                            window.sessionStorage.job_app_form = '0';
                        },
                        failure: function (resp, b) {
                            var data = Ext.decode(resp.responseText);
                            Ext.toast(data.message, false, 't');

                        }
                    });
                }
                Ext.Msg.alert('success', msg);
            },
            failure: function (resp, b) {
                var data = Ext.decode(resp.responseText);
                Ext.toast(data.message, false, 't');
            }
        });
    },
    /* on form cancel button -- reset*/
    onCancelIntvwClick: function(btn, e, opts) {
        this.getReferences().intervwformref.reset();
    },
    /* on interview add button click*/
    onInteviewAddBtnClick2: function(btn, e, eOpts) {
        Ext.ComponentQuery.query("oninterviewscheduled")[0].items.items[0].setHidden(true);
        Ext.ComponentQuery.query("oninterviewscheduled")[0].items.items[1].setHidden(false);
    },
    /* on application status change*/
    onApplicationStatusSelected: function(combo, arg2) {
        var params = {
            ddo_jobapplication_id: window.sessionStorage.ddo_jobapplication_id_forApplStatus,
            ddo_jobapplicationstatus_id: arg2.data.ddo_jobapplicationstatus_id
        },
            url = Api.URL.jobapplication.READ,
            method = 'PUT';

        Ext.Ajax.request({
            url: url,
            method: method,
            scope: this,
            params: params,
            success: function (resp, b) {
                var res = Ext.decode(resp.responseText);
                var msg = res.message;
                Ext.Msg.alert('success', msg);
            },
            failure: function (resp, b) {
                var data = Ext.decode(resp.responseText);
                Ext.toast(data.message, false, 't');
            }
        });
    },
    /* on download cv click*/
    onDwnldCVClick: function(btn, val) {
        var file_path = JSON.parse(window.sessionStorage.renderingData).resumepath;
        var a = document.createElement('A');
        a.href = file_path;
        a.download = JSON.parse(window.sessionStorage.renderingData).resumename;
        //a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
});