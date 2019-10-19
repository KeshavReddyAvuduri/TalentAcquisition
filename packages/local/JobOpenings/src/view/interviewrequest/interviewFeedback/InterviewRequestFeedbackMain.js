Ext.define('JobOpenings.view.interviewrequest.interviewrequest.InterviewRequestFeedbackMain', {
    extend: 'Ext.container.Container',
    xtype: 'interviewrequestfeedbackmain',
    requires: [
        'JobOpenings.view.jobapplications.JobApplicationsViewModel',
        'JobOpenings.view.jobapplications.JobApplicationsViewController',
        'JobOpenings.view.interviewrequest.interviewrequest.InterviewRequestFeedbackView'
    ],
    reference: 'interviewrequestfeedbackmainref',
    margin: '10 0 0 10',
    cls: 'jobappviewcls noscrollbar interReqCls',
    width: '100%',
    controller: 'jobapplicationsviewController',
    viewModel: {
        type: 'jobapplicationsviewmodel'
    },
    layout: {
        type: 'vbox'
    },
    items: [{
        xtype:'panel',
        width:'100%',
        items:[{
            xtype: 'toolbar',
            cls: 'inttoolbar-cls',
            dock: 'top',    
            items: [{
                xtype: 'button',
                scale: 'medium',
                iconCls: 'x-fa fa-arrow-left',
                cls: 'jobback-btn-cls',
                style: {
                    border: 0
                },
                listeners: {
                    click: function() { /*on back button click in feedbacks screen*/
                        if (window.sessionStorage.intervw_req_feedback == "true") {
                            Ext.Msg.confirm("Confirm", "Are you sure you want to go back?", function (btnText) {
                                if (btnText === "no") {
                                    //do nothing
                                } else if (btnText === "yes") {
                                    Ext.ComponentQuery.query('interviewrequestdesign')[0].getViewModel().getStore('interviewRequestListStore').load();
                                    window.sessionStorage.intervw_req_feedback = false;
                                    Ext.ComponentQuery.query('[reference = interviewreference]')[0].getLayout().setActiveItem(0);
                                }
                            }, this);
                        } else {
                            Ext.ComponentQuery.query('interviewrequestdesign')[0].getViewModel().getStore('interviewRequestListStore').load() //;
                            window.sessionStorage.intervw_req_feedback = false;
                            Ext.ComponentQuery.query('[reference = interviewreference]')[0].getLayout().setActiveItem(0);
                        }
                    }
                }
            }, {
                xtype:'label',
                html:'Back',
                cls: 'backlabel-cls'
            }, {
                xtype:'tbspacer',
                width: 400
            }, {
                xtype: 'label',
                html: 'Interview',
                cls: 'intTitle-cls',
                reference: 'interviewRequest_interviewTitleRef'
            }]
        }]
    },{
        xtype: 'container',
        layout: 'hbox',
        cls: 'dtcnt-cls',
        items: [{
            xtype: 'dataview',
            cls: 'jobsdataviewcls',
            // bind: {
            //     store: '{jobapplicantStore}'
            // },
            itemTpl: [
                '<div class="jobsdiv-cls ddo-jobopening-item">',
                '<div class="datadiv-cls">',
                '<div class="title-div-cls"><span class="title-cls getRatingIcon: function(values) { /* for correct rating icon display*/le-cls">{[this.showTitle(values,16)]}</span>',
                '<span> | </span>',
                '<span class="creator-cls">{[this.showCurrentjobtitle(values)]}</span>',
                '</div>',
                '<div class="loc-exp"><span><i class="exp-iconcls arrow-cls"></i>&nbsp{workexpyears}.{workexpmonths} Years Experience </span>',
                '<span><i class="location-iconcls arrow-cls"></i>&nbsp{[this.showCurrentlocation(values)]}</span>',
                '</div>',
                '<div class="detailscls"><i class="skill-iconcls arrow-cls"></i>{[this.showSkill(values)]}</div>',
                '<div class="detailscls"><i class="education-iconcls arrow-cls"></i>{[this.showEduVal(values)]} - {[this.showCollegename(values)]}</div>',
                '<div class="mob-emailsCls">',
                '<div class="detailscls emaildv"><i class="mobile-iconcls arrow-cls"></i>+91&nbsp{[this.showMobile(values, 10)]}</div>',
                '<div class="detailscls maildv"><i class="mail-iconcls arrow-cls"></i>{[this.emailidShowFunc(values, 20)]}</div></div>',
                '</div>',
                '<div class="combosdiv-cls">',
                '<div>',
                '</div>',
                '</div>',
                '</div>',
                {
                    showCollegename: function(values) { /* intending college name*/
                        var collegename = values.collegename;
                        if (collegename.length > 20) {
                            return collegename.substring(0, 17) + "...";
                        } else {
                            return collegename;
                        }
                    },
                    showCurrentlocation: function(values) {/* intending current location*/
                        var currentlocation = values.currentlocation;
                        if (currentlocation.length > 15) {
                            return currentlocation.substring(0, 12) + "...";
                        } else {
                            return currentlocation;
                        }
                    },
                    showCurrentjobtitle: function(values) {/* intending job title*/
                        var currentjobtitle = values.currentjobtitle;
                        if (currentjobtitle.length > 12) {
                            return currentjobtitle.substring(0, 9) + "...";
                        } else {
                            return currentjobtitle;
                        }
                    },
                    showTitle: function(values, limit) { /*to display title*/
                        var title = values.firstname + " " + values.lastname;
                        if (title.length > limit) {
                            return title.substring(0, 13) + "...";
                        } else {
                            return title;
                        }
                    },
                    showSkill: function(values) { /*to display skills*/
                        var skillStr = "";
                        try {
                            var skillsArr = values.skillnames;
                            skillsArr.forEach(function(item, index){
                                skillStr += ((skillsArr.length-1)!=index)? "#" + item + ", ":"#" + item;
                            });
                        } catch(exce){}

                        if (skillStr.length > 29) {
                            return skillStr.substring(0, 26) + "...";
                        } else {
                            return skillStr;
                        }

                        //return skillStr;
                    },
                    showMobile: function(values, limit) { /*to display mobile no*/
                        var mobile = values.mobile.toString();
                        if (mobile.length > limit) {
                            return mobile.substring(0, 10) + "...";
                        } else {
                            return mobile;
                        }
                    },
                    showEduVal: function(values) { /*to display education*/
                        var myEduTypeArr = JSON.parse(window.sessionStorage.myEduTypeArr).data;
                        var myEduStr = "";
                        myEduTypeArr.forEach(function(item){
                            if(values.ddo_jobeducation_id == item.ddo_jobeducation_id){
                                myEduStr = item.name;
                            }
                        });
                        return myEduStr;
                    },
                    emailidShowFunc: function(values, limit) { /*to display email id*/
                        var emailid = values.emailid;
                        if (emailid.length > limit) {
                            return emailid.substring(0, 20) + "...";
                        } else {
                            return emailid;
                        }
                    }
                }
            ],
            itemSelector: 'div.status-div-cls'
        }, {
            xtype: 'container',
            cls: 'dwnlodcntcls',
            layout: 'vbox',
            items: [{
                xtype: 'button',
                text: 'Download CV <span class="download-iconcls"></span>',
                cls: 'cvdwnldbtn',
                iconcls: 'dwnldcv-cls',
                reference: 'intervReqDowloadBtn',
                listeners: {
                    click: function(btn, val) { /*on click for resume path*/
                        var file_path = JSON.parse(window.sessionStorage.renderingData).resumepath;
                        var a = document.createElement('A');
                        a.href = file_path;
                        a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    }
                }
            }]
        }]
    }, {
        xtype: 'interviewrequestfeedbackview'
    }]
});