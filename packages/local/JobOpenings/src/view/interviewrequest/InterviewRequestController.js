Ext.define('JobOpenings.view.interviewrequest.InterviewRequestController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.interviewrequestcontroller',
    
    beforeRender: function() {
        /*for ratings dropdown*/
        Ext.Ajax.request({
            url: Api.URL.jobappinterview.getInterviewRating,
            method: "GET",
            scope: this,
            success: function (resp, b, data, f, g, h) {
                window.sessionStorage.getRatingStr = resp.responseText;
            },
            failure: function (resp, b) {}
        });

        /*for all education types*/
        Ext.Ajax.request({
            url: Api.URL.jobapplication.getJobeducation,
            method: "GET",
            scope: this,
            success: function (resp, b, data, f, g, h) {
                window.sessionStorage.myEduTypeArr = resp.responseText;
            },
            failure: function (resp, b) {}
        });
    },
    /*on back button click in feedbacks screen*/
    onBackClick: function(item) { 
        Ext.Msg.confirm("Confirm", "Are you sure you want to go back?", function (btnText) {
            if (btnText === "no") {
                //do nothing
            } else if (btnText === "yes") {
                Ext.ComponentQuery.query('[reference = jobapplicationreference]')[0].getLayout().setActiveItem(0);
            }
        }, this);
    },
    /*on inteviews button click on main screen*/
    onIntervReqClick: function(vw, record, item, index, e, eOpts) {
        if (e.target.innerText == "Interview"){
            window.sessionStorage.renderingData = JSON.stringify(record.data);
            window.sessionStorage.ddo_jobapplication_id_forApplStatus = record.data.ddo_jobapplication;
            window.sessionStorage.ddo_jobapplicationstatus_id = record.data.ddo_jobapplicationstatus_id;

            var recTitle = record.data.currentjobtitle,
                recFirstname = record.data.firstname;
            if (recTitle.length > 30) {
                recTitle = recTitle.substring(0, 27) + "...";
            }
            if (recFirstname.length > 20) {
                recFirstname = recFirstname.substring(0, 17) + "...";
            }

            Ext.ComponentQuery.query('[reference = interviewRequest_interviewTitleRef]')[0].setHtml(recTitle + '/' + recFirstname + '/' + 'Interview');
            Ext.ComponentQuery.query('[reference = interviewreference]')[0].getLayout().setActiveItem(1);
            Ext.ComponentQuery.query('interviewrequestfeedbackmain')[0].items.items[1].items.items[0].store.loadRawData(record);

            var params = {
                ddo_jobapplicationinterview_id: record.data.ddo_jobapplicationinterview_id
            };
            Ext.Ajax.request({
                url: Api.URL.jobappinterview.READ,
                method: "GET",
                scope: this,
                params: params,
                success: function (resp, b, data, f, g, h) { 
                    Ext.ComponentQuery.query("interviewrequestfeedbackview")[0].items.items[0].store.loadRawData(JSON.parse(resp.responseText));
                    Ext.ComponentQuery.query("interviewrequestfeedbackview")[0].items.items[0].store.sort('updated','DESC');

                    /*filter interviews by application id*/
                    Ext.ComponentQuery.query("interviewrequestfeedbackview")[0].items.items[0].store.filter({
                        property: 'ddo_jobapplication_id',
                        id: 'fil_ddo_jobapplication_id',
                        anyMatch: true,
                        caseSensitie: false,
                        value: record.data.ddo_jobapplication_id
                    }, record.data.ddo_jobapplication_id, false);

                    /*filter interviews by application status id*/
                    Ext.ComponentQuery.query("interviewrequestfeedbackview")[0].items.items[0].store.filter({
                        property: 'ddo_jobinterviewstatus_id',
                        id: 'fil_ddo_jobinterviewstatus_id',
                        anyMatch: true,
                        caseSensitie: false,
                        value: /[1-2]/
                    }, /[1-2]/, false);

                    var getLoggedInUserId = Ext.getStore('login').data.items[0].data;

                    /*filter interviews by logged in user id for giving feedback*/
                    Ext.ComponentQuery.query("interviewrequestfeedbackview")[0].items.items[0].store.filter({
                        property: 'interviewer_id',
                        id: 'by_interviewer_id',
                        anyMatch: true,
                        caseSensitie: false,
                        value: getLoggedInUserId.ddo_employee_id
                    }, getLoggedInUserId.ddo_employee_id, false);
                },
                failure: function (resp, b) {
                    var data = Ext.decode(resp.responseText);
                    Ext.toast(data.message, false, 't');
                }
            });
        }
    },
    /*on textfield keypress function*/
    onKeyUpJobSearch: function(searchfield, e, eOpts) {
        var toGetReferenceView = this.getReferences().interviewrequestlistview;
        this.searchJob(toGetReferenceView.down('textfield'));
    },
    /*search functionality for keypress*/
    searchJob: function(searchfield) {
        var searchString = searchfield.value,
            dataview = this.getReferences().interviewdatalistview,
            datviewStore = dataview.getStore();

        if (datviewStore) {
            datviewStore.clearFilter(true);
            datviewStore.filterBy(function (record) {
                var result = record.data.firstname.search(new RegExp(searchString, 'gi'));
                return result >= 0;
            }, this);
        }
    },
    /*cancel button functionality*/
    interviewRequestCancelClick: function(vw, record, item, index, e, eOpts) {
        var params = {
            ddo_jobapplicationinterview_id: JSON.parse(window.sessionStorage.renderingData).ddo_jobapplicationinterview_id,
            feedback: "",
            ddo_interviewrating_id: 3
        };
        Ext.Ajax.request({
            url: Api.URL.jobappinterview.READ,
            method: "PUT",
            scope: this,
            params: params,
            success: function (resp, b, data, f, g, h) {
                var msg = JSON.parse(resp.responseText).message;
                item.children[0].children[1].children[4].children[0].value = "";
                Ext.ComponentQuery.query('interviewrequestdesign')[0].getViewModel().getStore('interviewRequestListStore').load({
                    params: {
                        loginuser_id: Ext.getStore('login').data.items["0"].data.ddo_employee_id
                    }
                });

                Ext.Msg.alert('success', msg);
            },
            failure: function (resp, b) {
                var data = Ext.decode(resp.responseText);
                Ext.toast(data.message, false, 't');

            }
        });
    },
    /*submit button functionality*/
    interviewRequestSubmitClick: function(vw, record, item, index, e, eOpts) {
        var xRatingStr = JSON.parse(window.sessionStorage.getRatingStr),
        sectedText = item.children[0].children[1].children[4].children[0].children[1].outerText.split("\n")[0].trim(),
        ratingId = null;
        xRatingStr.data.forEach(function(item){
            if (sectedText == item.name.trim()) {
                ratingId = item.ddo_interviewrating_id;
            }
        })
        var params = {
            ddo_jobapplicationinterview_id: JSON.parse(window.sessionStorage.renderingData).ddo_jobapplicationinterview_id,
            feedback: item.children[0].children[1].children[5].children[0].value,
            ddo_interviewrating_id: ratingId,
            ddo_jobinterviewstatus_id: 2
        };
        Ext.Ajax.request({
            url: Api.URL.jobappinterview.READ,
            method: "PUT",
            scope: this,
            params: params,
            success: function (resp, b, data, f, g, h) {
                var msg = JSON.parse(resp.responseText).message;
                Ext.ComponentQuery.query('interviewrequestdesign')[0].getViewModel().getStore('interviewRequestListStore').load({
                    params: {
                        loginuser_id: Ext.getStore('login').data.items["0"].data.ddo_employee_id
                    }
                });

                Ext.Msg.alert('success', msg);
            },
            failure: function (resp, b) {
                var data = Ext.decode(resp.responseText);
                Ext.toast(data.message, false, 't');

            }
        });
    },
    /*on card action functionality in feedbacks*/
    ratingsCheckClick: function(vw, record, item, index, e, eOpts) {
        if (e.target.lastChild != null && e.target.className == "act-cls") {
            /*on ratings dropdown*/
            if (e.target.lastChild.classList.value !== "act-showcls") {
                item.children[0].children[1].children[4].children[0].children[1].children[0].children[1].className = 'act-showcls';
            } else {
                item.children[0].children[1].children[4].children[0].children[1].children[0].children[1].className = 'act-removecls';
            }
        } else {
            /*on rating changed*/
            if (e.target.className == "lili") {
                window.sessionStorage.intervw_req_feedback = true;
                var innerTxt = e.target.innerText;
                var xRatingStr = JSON.parse(window.sessionStorage.getRatingStr);
                var liHtml = "";
                xRatingStr.data.forEach(function(item){
                    liHtml += '<li class="lili" value="'+item.ddo_interviewrating_id+'">'+item.name+'</li>';
                });
                item.children[0].children[1].children[4].children[0].innerHTML = '<img class="intvwratingimg-cls" src="resources/images/feeds/likes/'+innerTxt+'.png"><div style="position:absolute;"><div class="act-cls">'+innerTxt+' <i class="x-fa fa-sort-desc arrow-cls"></i><div class="act-showcls"><ul>'+liHtml+'</ul></div></div></div>';
            }

            item.children[0].children[1].children[4].children[0].children[1].children[0].children[1].className = 'act-removecls';

            /*on submit button clicked*/
            if (e.target.innerText == "Submit") {
                if(item.children[0].children[1].children[5].children[0].value !=""){
                    item.children[0].children[1].children[5].children[0].readOnly = true;
                    this.interviewRequestSubmitClick(vw, record, item, index, e, eOpts);    
                }
                else{
                    Ext.toast('Feed Back Required!', false, 't');
                }
                
            }

            /*on cancel button clicked*/
            if (e.target.innerText == "Cancel") {
                item.children[0].children[1].children[5].children[0].readOnly = false;
                this.interviewRequestCancelClick(vw, record, item, index, e, eOpts);
            }

            /*for of focus of textarea for confirmation messages*/
            if (e.target.tagName == "TEXTAREA") {
                window.sessionStorage.intervw_req_feedback = true;
            }
        }
    }
}); 