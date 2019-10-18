Ext.define('JobOpenings.view.jobopeningrequest.JobOpenFormController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.jobopenformcontroller',
    requires: [],
    /* on container click*/
    onContainerClick: function (vw, record, item) {
        x = vw.all.elements;
        for (var i = 0; i < x.length-2; i++) {
            y = x[i].lastChild.lastChild.firstChild.lastChild;
            z = x[i].lastChild.lastChild.lastChild.lastChild;
            if (y.className == "act-showcls" || z.className == "act-showcls") {
                y.classList.remove('act-showcls');
                y.classList.add('act-removecls');
                z.classList.remove('act-showcls');
                z.classList.add('act-removecls');
            }
        }
    },
    /* for department render*/
    onDepartmentRender: function (combo, eOpts) {
        var departmentStore = combo.getStore();
        // departmentStore.load();
    },
    /* for skills render*/
    onSkillRender: function (combo, eOpts) {
        var comboStore = combo.getStore('JobOpenings.store.form.SkillsStore');
        // comboStore.load();
    },
    /* for job location render*/
    onJobLocationRender: function (combo, eOpts) {
        var comboStore = combo.getStore('JobOpenings.store.form.LocationStore');
        // comboStore.load();
    },
    /* for interview render*/
    onInterviewRender: function (combo, eOpts) {
        var interviewStore = combo.getStore();
        // interviewStore.load();
    },
    /* for min value selected*/
    onMinValueSelect: function (field, e, eOpts) {
        var form = this.getReferences().jobform,
            maxVal = form.getValues().maxworkexperience,
            minVal = field.value;

        if (maxVal != "" && minVal >= parseInt(maxVal)) {
            Utility.topAlertMessage('WARNING', "Please Enter value less than maxExp value");
            field.setValue(null);
        } else if(minVal < 0){
            Utility.topAlertMessage('WARNING', "Please Enter positive numbers only");
            field.setValue(null);            
        }else{
            return minVal;
        }
    },
    /* for max value selected*/
    onMaxValueSelect: function (field, e, eOpts) {
        var form = this.getReferences().jobform,
            minVal = form.getValues().minworkexperience,
            maxVal = field.value;

        if (minVal != "" && maxVal < parseInt(minVal)) {
            Utility.topAlertMessage('WARNING', "Please Enter value more than minExp value");
            field.setValue(null);
        }else if(maxVal < 0){
            Utility.topAlertMessage('WARNING', "Please Enter positive numbers only");
            field.setValue(null);            
        } else {
            return maxVal;
        }
    },
    /* on form save clicked*/
    onFormSaveClick: function (btn, e, eOpts) {
        var ddo_jobopeningstatus_id = 2;
        this.jobCreation(ddo_jobopeningstatus_id);
    },
    /* on draft save clicked*/
    onDraftSaveClick: function () {
        var ddo_jobopeningstatus_id = 3;
        this.jobCreation(ddo_jobopeningstatus_id);
    },
    /* for job creation*/
    jobCreation: function (ddo_jobopeningstatus_id) {
        var view = this.getReferences().listview;
        viewId = view.getId();
        var view = this.getView(),
            form = view.down('form').getForm(),
            values = form.getValues(),

            dataview = this.getReferences().jobdataview,

            store = dataview.getStore();

        noLineBreakValue = values.job_desc.replace(/(\r\n|\n|\r)/gm, " "),
            trimValue = noLineBreakValue.replace(/\s\s+/g, ' ').trim();

        var descText = trimValue; //Ext.util.Format.stripTags(trimValue);
        var titleText = values.title.split('\'').join('&apos;');

        var checkbx = this.getReferences().jobworkcheckboxref,
            isChecked = checkbx.isChecked();

        if (checkbx.value == false) {
            checkbx.value = 'N'
        } else {
            checkbx.value = 'Y'
        }

        var params = {
            ddo_joblocation_id: values.ddo_joblocation_id,
            title: titleText,
            description: descText,
            minsalary: values.minsalary,
            maxsalary: values.maxsalary,
            ddo_jobopeningstatus_id: ddo_jobopeningstatus_id,
            noofpositions: values.noofpositions,
            minworkexperience: values.minworkexperience,
            maxworkexperience: values.maxworkexperience,
            skill_ids: values.skill_ids,
            ddo_projects_clients_id: values.ddo_projects_clients_id,
            interviewers_ids: values.interviewers_ids,
            // ddo_department_id: values.ddo_department_id,
            closuredate: values.closuredate,
            work_on_priority: checkbx.value
        };

        console.log('params', params);
        if (values.description == "") {
            Utility.topAlertMessage('WARNING', "Please Fill  Description Field");
        } else {
            var url = Api.URL.jobopenings.CREATE,
                method = 'POST';

            if (values.ddo_jobopening_id != "") {
                url = Api.URL.jobopenings.UPDATE;
                var ddo_jobopening_id = values.ddo_jobopening_id,
                    method = 'PUT';
                params['ddo_jobopening_id'] = ddo_jobopening_id;
                var dirtyFields = [],
                    fields = form.getFields().items;
                var formValues = {};
                Ext.each(fields, function (field) {
                    if (field.isDirty()) {
                        dirtyFields.push(field);
                        formValues[field.name] = field.getValue();
                    }
                });

                console.log("formValues", formValues);
                if (form.isDirty()) {
                    formValues["ddo_jobopening_id"] = ddo_jobopening_id;
                    formValues["work_on_priority"] = checkbx.value;
                    formValues["ddo_jobopeningstatus_id"] = ddo_jobopeningstatus_id;
                    params = formValues;
                } else {
                    params = params
                }
            }

            Ext.Ajax.request({
                url: url, //getJobFormData
                method: method,
                scope: this,
                params: params,
                success: function (resp, b) {
                    this.resetForm();
                    // store.load();
                    store.add(params);
                    var res = Ext.decode(resp.responseText);
                    var msg = res.message;
                    Ext.Msg.alert('success', msg);
                    this.getView().getLayout().setActiveItem(viewId);
                    this.getJobOpeningViewRefresh();
                },
                failure: function (resp, b) {
                    var data = Ext.decode(resp.responseText);
                    Ext.toast(data.message, false, 't');
                }
            });
        }
    },
    /* on back button clicked*/
    onBackClick: function (item) {
        var view = this.getReferences().listview;
        viewId = view.getId();
        var form = this.getReferences().jobform.form;

        // skills and interview panel closing issue fixing -- shivani
        skillcombo = this.getReferences().jobform.items.items["0"].items.items[6],
            interview_combo = this.getReferences().jobform.items.items["0"].items.items[8];
        interview_combo.collapse();
        skillcombo.collapse();

        if (form.isValid() == true) {
            Ext.Msg.confirm("Confirm", "Are you sure you want to go back?", function (btnText) {
                if (btnText === "no") {
                    //do nothing
                } else if (btnText === "yes") {
                    this.getView().getLayout().setActiveItem(viewId);
                    this.getJobOpeningViewRefresh();
                }
            }, this);
        } else {
            this.getView().getLayout().setActiveItem(viewId);
            this.getJobOpeningViewRefresh();
        }
        var tagPanel = Ext.ComponentQuery.query("jobopeningsfilterview"),
            tagPanelItm = tagPanel[0].items.items;
        tagPanelItm[3].hide();
        tagPanelItm[4].hide();
        tagPanelItm[5].hide();

        var getDataStore = Ext.ComponentQuery.query('jobopeningsrequestlistview')[0].down('dataview').getStore();
        getDataStore.removeFilter("filterByLocation");
        getDataStore.removeFilter("filterByDepartment");
        getDataStore.removeFilter("filterByDate");
    },
    /* for view refresh*/
    getJobOpeningViewRefresh: function () {
        var dataview = this.getReferences().jobdataview;
        var searchField = this.getReferences().filterview.down('textfield');
        var statusField = this.getReferences().filterview.down('combobox');

        searchField.setValue("");
        statusField.setValue('All');
        dataview.getStore().clearFilter();
        statusField.getStore().clearFilter();
        dataview.refresh();
    },
    /* for hiding combos*/
    hideCombobox: function (com, e, eOpts) {
        var tagPanel = Ext.ComponentQuery.query("jobopeningsfilterview"),
            tagPanelItm = tagPanel[0].items.items;
        //tagPanelItm[3].hide();
        //tagPanelItm[4].hide();
        //tagPanelItm[5].hide();

        var getDataStore = Ext.ComponentQuery.query('jobopeningsrequestlistview')[0].down('dataview').getStore();
        //getDataStore.removeFilter("filterByLocation");
        //getDataStore.removeFilter("filterByDepartment");
        //getDataStore.removeFilter("filterByDate");
        if (Ext.ComponentQuery.query('[reference = filterwinref]')[0] == undefined) {
            Ext.create('JobOpenings.view.jobopeningrequest.filtertoolbar.JobOpeningsRequestAddfilterWindow').show();
        } else {
            var filterWindow = Ext.ComponentQuery.query('[reference = filterwinref]')[0];
            filterWindow.show();
            var winForm = filterWindow.down('form'),
                formValues = winForm.getValues(),
                viewmodel = this.getViewModel();
            /*if(viewmodel.data.filtervalue == "filterByLocation"){
                winForm.getForm().findField('filterlocation').setValue('All');
            }else if(viewmodel.data.filtervalue == "filterByDepartment"){
                winForm.getForm().findField('filterdepartment').setValue('All');
            }else if(viewmodel.data.filtervalue == "filterByDate"){
                winForm.getForm().findField('filterDateName').setValue('All');
            }*/
        }
    },
    /* for creating new job*/
    onCreateNewJob: function () {
        var view = this.getReferences().jobform,
            formViewId = view.getId();
        this.getView().getLayout().setActiveItem(formViewId).reset();
        view.reset();
    },
    /* for job opening panel clicked*/
    onJobOpeningClick: function (vw, record, item, index, e, eOpts) {
        x = vw.all.elements;
        for (var i = 0; i < x.length-2; i++) {
            y = x[i].lastChild.lastChild.firstChild.lastChild;
            z = x[i].lastChild.lastChild.lastChild.lastChild;
            if (index != i) {
                if (y.className == "act-showcls" || z.className == "act-showcls") {
                    y.classList.remove('act-showcls');
                    y.classList.add('act-removecls');
                    z.classList.remove('act-showcls');
                    z.classList.add('act-removecls');
                }
            }
        }

        if (e.target.className == "rec-assigncls") {
            if (e.target.lastChild.classList.value !== "act-showcls") {
                item.children[1].children[1].children[0].children[1].className = 'act-showcls';
            } else {
                item.children[1].children[1].children[0].children[1].className = 'act-removecls';
            }
            item.children[1].children[1].lastChild.lastChild.className = "act-removecls";

            var status = record.data.job_status_name;
            if (status == "Closed" || status == "Drafted" || status == "Rejected") {
                item.children[1].children[1].children[0].children[1].children[0].className = "assignto-disabledCls";
            }
        } else if (e.target.classList[2] == "assign-arrow") {
            if (e.target.parentElement.lastChild.classList.value !== "act-showcls") {
                item.children[1].children[1].children[0].children[1].className = 'act-showcls';
            } else {
                item.children[1].children[1].children[0].children[1].className = 'act-removecls';
            }
            item.children[1].children[1].lastChild.lastChild.className = "act-removecls";
            var status = record.data.job_status_name;
            if (status == "Closed" || status == "Drafted" || status == "Rejected") {
                item.children[1].children[1].children[0].children[1].children[0].className = "assignto-disabledCls";
            }
        }

        if (e.target.lastChild != null && e.target.className == "act-cls") {
            if (e.target.lastChild.classList.value !== "act-showcls") {
                item.children[1].children[1].children[2].children[1].className = 'act-showcls';
            } else {
                item.children[1].children[1].children[2].children[1].className = 'act-removecls';
            }
            item.children[1].children[1].children[0].lastChild.className = 'act-removecls';

        }
        if (e.target.classList[2] == "act-arrow") {
            if (e.target.parentElement.lastChild.classList.value !== "act-showcls") {
                item.children[1].children[1].children[2].children[1].className = 'act-showcls';
            } else {
                item.children[1].children[1].children[2].children[1].className = 'act-removecls';
            }
            item.children[1].children[1].children[0].lastChild.className = 'act-removecls';
        }
        if (e.target.classList.value == "checkImg") {
            var jobOpeningsStore = Ext.getStore('jobopenings.JobRecruiter');

            var recruitersLength = jobOpeningsStore.data.items.length,
                checkedRecruitersList = [];
            if (record.data.recruiter_id != null) {
                var recStr = record.data.recruiter_id,
                    parsedData = JSON.parse("[" + recStr + "]");
                checkedRecruitersList = parsedData;
            }

            for (var i = 0; i < recruitersLength; i++) {
                var items = jobOpeningsStore.data.items;
                if (items[i].data.recruiter_name == e.target.parentElement.className) {
                    e.target.className = "uncheckImg";
                    e.target.classList.remove('checkImg');
                    items[i].data.isChecked = true;
                    checkedRecruitersList.push(items[i].data.ddo_employee_id);
                }

            }

            jobOpeningsStore.getProxy().extraParams = {
                // recruiter_id: jobOpeningsStore.data.items[0].data.ddo_employee_id
                recruiter_id: checkedRecruitersList.join()
            };

            var recruiter_id = checkedRecruitersList.join();
            var ddo_jobopening_id = record.data.ddo_jobopening_id;
            var ddo_jobopeningstatus_id = record.data.ddo_jobopeningstatus_id;
            var description = record.data.job_desc;

            params = {
                ddo_jobopening_id: ddo_jobopening_id,
                recruiter_id: recruiter_id,
                description: description
            };

            this.updateRecruitersData(params);

        } else if (e.target.classList.value == "uncheckImg") {
            var jobOpeningsStore = Ext.getStore('jobopenings.JobRecruiter'),
                ddo_jobopening_id = record.data.ddo_jobopening_id,
                ddo_jobopeningstatus_id = record.data.ddo_jobopeningstatus_id,
                description = record.data.job_desc;

            var recruitersLength = jobOpeningsStore.data.items.length,
                checkedRecruitersList = [],
                list=[];
              
            for (var i = 0; i < recruitersLength; i++) {
                var items = jobOpeningsStore.data.items;
              // checkedRecruitersList.push(items[i].data.ddo_employee_id);
                if (items[i].data.recruiter_name == e.target.parentElement.className) {
                    e.target.className = "checkImg";
                    e.target.classList.remove('uncheckImg');
                    items[i].data.isChecked = false;
                 checkedRecruitersList.pop(items[i].data.ddo_employee_id);
                  //delete checkedRecruitersList[i];
                }             
            }
            // for(var j=0; j<items.length;j++){
            //     for(var k =0;k<checkedRecruitersList.length;k++){
            //         if(items[j].data.ddo_employee_id == checkedRecruitersList[k]){
            //             list.push(items[j].data.ddo_employee_id);
            //         }
            //     }
            // }
            console.log(checkedRecruitersList);
            params = {
                ddo_jobopening_id: ddo_jobopening_id,
                recruiter_id: checkedRecruitersList.join(),
                description: description
            };
            console.log(params.recruiter_id);
            this.updateRecruitersData(params);
        }

        if (e.target.innerText == "Close" || e.target.innerText == 'Approve' || e.target.innerText == 'Reject') {
            var ddo_jobopening_id = record.data.ddo_jobopening_id;
            var ddo_jobopeningstatus_id = record.data.ddo_jobopeningstatus_id;
            var status = 'Closed';
            params = {
                ddo_jobopening_id: ddo_jobopening_id,
                ddo_jobopeningstatus_id: ddo_jobopeningstatus_id,
                status: status
            };

            if (e.target.innerText == 'Approve') {
                var ddo_jobopening_id = record.data.ddo_jobopening_id;
                var ddo_jobopeningstatus_id = record.data.ddo_jobopeningstatus_id;
                var status = 'Approved';
                params = {
                    ddo_jobopening_id: ddo_jobopening_id,
                    ddo_jobopeningstatus_id: ddo_jobopeningstatus_id,
                    status: status
                };
            } else if (e.target.innerText == 'Reject') {
                var ddo_jobopening_id = record.data.ddo_jobopening_id;
                var ddo_jobopeningstatus_id = record.data.ddo_jobopeningstatus_id;
                var status = 'Rejected';
                params = {
                    ddo_jobopening_id: ddo_jobopening_id,
                    ddo_jobopeningstatus_id: ddo_jobopeningstatus_id,
                    status: status
                };
            }

            Ext.Ajax.request({
                url: Api.URL.jobstatus.UPDATE,
                method: 'PUT',
                scope: this,
                params: params,

                success: function (response) {
                    var data = Ext.decode(response.responseText);
                    var view = this.getView().down('jobopeningsrequestlistview');
                    // view.down('dataview[reference="jobdataview"]').getStore().reload();
                }
            });
        } else if (e.target.innerText == "Edit") {
            var form = this.getReferences().jobform,
                formViewId = form.getId();
            this.getView().getLayout().setActiveItem(formViewId);
            var ddo_jobopening_id = record.data.ddo_jobopening_id;
            record.data.title = record.data.title.split('&apos;').join('\'');

            this.loadRecord(record);

            var dataview = this.getReferences().jobdataview;
            // dataview.getStore().reload();
            dataview.refresh();
            var fields = form.getForm().getFields();
            setTimeout(function () {
                Ext.each(fields.items, function (field) {
                    field.dirty = false;
                    field.wasDirty = false;
                });
            }, 1000);

        } else if (e.target.innerText == "Delete") {
            Ext.Msg.confirm("Confirm", "Are you sure you want to delete this Job?", function (btnText) {
                if (btnText === "no") {
                    //do nothing
                } else if (btnText === "yes") {
                    var statusCondition = false;

                    if (record.data.ddo_jobopeningstatus_id == 2 || record.data.ddo_jobopeningstatus_id == 3 || record.data.ddo_jobopeningstatus_id == 4 || record.data.ddo_jobopeningstatus_id == 5) {
                        statusCondition = true;
                    } else if (record.data.ddo_jobopeningstatus_id == 1) {
                        statusCondition = false;
                        Ext.Msg.alert('success', "Please Close the Job Opening Instead!");
                    } else {
                        statusCondition = false;
                    }
                    if (statusCondition) {
                        var ddo_jobopening_id = record.data.ddo_jobopening_id;
                        params = {
                            ddo_jobopening_id: ddo_jobopening_id
                        };
                        Ext.Ajax.request({
                            url: Api.URL.jobopenings.DELETE,
                            method: 'DELETE',
                            scope: this,
                            params: params,
                            success: function (response) {
                                var data = Ext.decode(response.responseText);
                                var dataview = this.getReferences().jobdataview;
                                // dataview.getStore().reload();
                                dataview.refresh();
                            }
                        });
                    }
                }
            }, this);
        }

        if (e.target.className == "title-cls") {
            var form = this.getReferences().jobOpeningsFormDataViewModeRef,
                formViewId = form.getId();
            this.getView().getLayout().setActiveItem(2);
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
        }
    },
    /* to update recruiter*/
    updateRecruitersData: function (params) {
        Ext.Ajax.request({
            url: Api.URL.jobopenings.UPDATE,
            method: 'PUT',
            scope: this,
            params: params,
            success: function (response) {
                var data = Ext.decode(response.responseText);
                var view = this.getView().down('jobopeningsrequestlistview');
                // view.down('dataview[reference="jobdataview"]').getStore().reload();
            },
            failure: function (resp, b) {
                var data = Ext.decode(resp.responseText);
                Ext.toast(data.message, false, 't');
            }
        });
    },
    /* for job search field*/
    onKeyUpJobSearch: function (searchfield, e, eOpts) {
        this.searchJob(this.getReferences().filterview.down('textfield'), this.getReferences().filterview.down('combobox'));
    },
    /* for filter by status*/
    onStatusSelectionFilter: function (statuscombo, record, eOpts) {
        this.searchJob(this.getReferences().filterview.down('textfield'), this.getReferences().filterview.down('combobox'));
    },
    /* on job search*/
    searchJob: function (searchfield, statuscombo) {
        var searchString = searchfield.value,
            dataview = this.getReferences().jobdataview,
            dataviewStore = dataview.getStore();

        if (statuscombo.value != null && statuscombo.value != "All" && statuscombo.rawValue != 'All') {
            var statusVal = statuscombo.getSelectedRecord().data.ddo_jobopeningstatus_id;
        } else if (statuscombo.value == "All" || statuscombo.rawValue == 'All') {
            var statusVal = null;
        } else {
            var statusVal = statuscombo.getValue();
        }

        if (dataviewStore) {
            if (!Ext.isEmpty(statusVal)) {
                dataviewStore.filter({
                    property: 'ddo_jobopeningstatus_id',
                    id: 'ddo_jobopeningstatus_id',
                    anyMatch: true,
                    caseSensitie: false,
                    value: statusVal
                }, statusVal, false);
            } else {
                dataviewStore.removeFilter('ddo_jobopeningstatus_id');
            }

            if (!Ext.isEmpty(searchString)) {
                dataviewStore.filter({
                    property: 'title',
                    id: 'title',
                    anyMatch: true,
                    caseSensitie: false,
                    value: searchString
                }, searchString, false);
            } else {
                dataviewStore.removeFilter('title');
            }
        }
    },
    /*For getting form dirty fields*/
    loadRecord: function (record) {
        this._record = record;
        return this.setValues(record.getData());
    },
    /* to set form values*/
    setValues: function (values) {
        var me = this.getReferences().jobopenform,
            v, vLen, val;

        function setVal(fieldId, val) {
            var field = me.getForm().findField(fieldId);
            if (field) {
                if (field.name == 'closuredate') {
                    field.setValue(new Date(val));
                } else {
                    field.setValue(val);
                }
                if (me.trackResetOnLoad) {
                    field.resetOriginalValue();
                }
            }
        }

        // Suspend here because setting the value on a field could trigger 
        // a layout, for example if an error gets set, or it's a display field 
        Ext.suspendLayouts();
        if (Ext.isArray(values)) {
            // array of objects 
            vLen = values.length;
            for (v = 0; v < vLen; v++) {
                val = values[v];
                setVal(val.id, val.value);
            }
        } else {
            // object hash 
            Ext.iterate(values, setVal);
        }
        Ext.resumeLayouts(true);
        return this;
    },
    /* To reset the form*/
    resetForm: function () {
        Ext.suspendLayouts();
        var form = this.getReferences().jobopenform;
        var fields = form.getForm().getFields().items;

        Ext.each(fields, function (f) {
            f.value = "";
            f.originalValue = "";
            var desc_field = fields[3],
                department_field = fields[2].rawValue;

            if (desc_field.isDirty() == true || department_field == "Not Found") {
                desc_field.setValue("");
                // department_field.replace(department_field, "");

            }
            f.resetToInitialValue();
        });
        Ext.resumeLayouts(true);
    },
    /* on close filter click*/
    onCloseFilterClk: function (btn) {
        var parentBtnRef = btn.reference.split('Cancel')[0],
            viewModel = this.getViewModel();

        var parentClassViewItms = Ext.ComponentQuery.query("jobopeningsfilterview")[0].items.items;
        parentClassViewItms.forEach(function (item, index) {
            if (index == 3 || index == 4 || index == 5) {
                if (item.items.items[0].reference == parentBtnRef) {
                    item.hide();
                    var removeFilterValue = (index == 4) ? 'filterByLocation' : (index == 5) ? 'filterByDepartment' : 'filterByDate';
                    var dataview = Ext.ComponentQuery.query('jobopeningsrequestlistview')[0].down('dataview');
                    var openingsView = Ext.ComponentQuery.query('jobopeningsrequestlistview')[0];
                    var store = openingsView.getViewModel().getStore('jobOpeningDataViewStore');
                    store.removeFilter(removeFilterValue);
                    viewModel.set("filtervalue", removeFilterValue);

                    var filterWindow = Ext.ComponentQuery.query('[reference = filterwinref]')[0];
                    //filterWindow.show();
                    var winForm = filterWindow.down('form');
                    if (index == 4) {
                        winForm.getForm().findField('filterlocation').setValue('All');
                    } else if (index == 5) {
                        winForm.getForm().findField('filterdepartment').setValue('All');
                    } else if (index == 3) {
                        winForm.getForm().findField('filterDateName').setValue('All');
                    }
                }
            }
        });
    },
    onNoofPositeionsEnter:function(position, e, eOpts){
        if(position.value < 0){
			var msg ="Please enter positive numbers only";
            Ext.Msg.alert('Warning', msg);
            position.reset();
		}
    },

    onKeyDownDate: function (dateField, e, eOpts) {
        Utility.onDateField (dateField, e, eOpts);
    }
});