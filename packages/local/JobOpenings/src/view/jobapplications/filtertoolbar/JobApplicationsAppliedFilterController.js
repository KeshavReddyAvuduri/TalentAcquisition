Ext.define('JobOpenings.view.jobapplications.filtertoolbar.JobApplicationsAppliedFilterController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.jobapplicationsappliedfiltercontroller',
    onApplyBtnClick: function (btn, e, eOpts) { /*on apply button click of filter combos*/

        var form = this.getView(),
            locationValue = form.getValues().filterlocation,
            departmentValue = form.getValues().filterdepartment,
            minExpValue = form.getValues().minworkexperience,
            maxExpValue = form.getValues().maxworkexperience,
            dateValue = form.getValues().filterDateName,
            match = locationValue,
            checkView = (Ext.ComponentQuery.query('jobapplications')[0].getLayout().getActiveItem().reference == 'jobapplicationrequestlistview') ? true : false,
            listview = (checkView) ? Ext.ComponentQuery.query('jobapplicationrequest') : Ext.ComponentQuery.query('jobapplicationsappliedlistview'),
            dataview = listview[0].down('dataview'),
            dataviewStore = dataview.getStore(),
            window = form.up('window'),
            vm = this.getViewModel(),
            tagPanel = (checkView) ? Ext.ComponentQuery.query("jobapplicationfilterview") : Ext.ComponentQuery.query("jobapplicationsappliedfilterview"),
            tagPanelItm = tagPanel[0].items.items;

        tagPanelItm[3].hide();
        tagPanelItm[4].hide();
        tagPanelItm[5].hide();

        //if (!checkView) {
        if (!Ext.isEmpty(locationValue) && locationValue != "All") {
            dataviewStore.filter({
                property: 'ddo_joblocation_id',
                id: 'filterByLocation',
                anyMatch: true,
                caseSensitie: false,
                value: locationValue
            }, locationValue, false);

            tagPanelItm[4].show();
            var locRefText = this.getReferences().filtercomboref.getSelectedRecord().data.name;
            var textVal = locRefText.substring(0, 10);
            tagPanelItm[4].items.items[0].setText(textVal);
        } else {
            dataviewStore.removeFilter('filterByLocation');
        }

        if (!Ext.isEmpty(departmentValue) && departmentValue != "All") {
            dataviewStore.filter({
                property: 'ddo_department_id',
                id: 'filterByDepartment',
                anyMatch: true,
                caseSensitie: false,
                value: departmentValue
            }, departmentValue, false);

            tagPanelItm[5].show();
            var depRefText = this.getReferences().deptcomboref.getSelectedRecord().data.name;
            var textVal = depRefText.substring(0, 10);
            tagPanelItm[5].items.items[0].setText(textVal);
        } else {
            dataviewStore.removeFilter('filterByDepartment');
        }
        //}

        if (!Ext.isEmpty(minExpValue) && minExpValue != "All") {

            var formMinExpVal = minExpValue,
                formMaxExpVal = maxExpValue;

            dataviewStore.filter({

                id: 'filterByExperience',
                filterFn: function (rec) {
                    minExpVal = rec.data.minworkexperience,
                        maxExpVal = rec.data.maxworkexperience;
                    if (minExpVal == formMinExpVal && maxExpVal == formMaxExpVal) {
                        return true;
                    } else {
                        return false;
                    }
                }
            })

            tagPanelItm[5].show();
            var expText = formMinExpVal + "-" + formMaxExpVal + " Exp.Years";
            var textVal = expText.substring(0, 13);
            tagPanelItm[5].items.items[0].setText(textVal);
        }

        if (!Ext.isEmpty(dateValue) && dateValue != "All") {
            var days = null;
            if (dateValue == "Past 24 HR") {
                days = 1;
            }
            if (dateValue == "Past Week") {
                days = 7;
            }
            if (dateValue == "Custom Range") {
                var customRangeDate = this.getReferences().customDateRef.value;
                if (customRangeDate != null || customRangeDate != undefined) {
                    var oneDay = 24 * 60 * 60 * 1000;
                    var firstDate = new Date(customRangeDate);
                    var secondDate = new Date();
                    days = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
                } else {
                    return;
                }
            }

            dataviewStore.filter({
                property: 'jobupdateddate',
                id: 'filterByDate',
                anyMatch: true,
                caseSensitie: false,
                value: dateValue,
                filterFn: function (record) {
                    var date = new Date();
                    var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
                    return (new Date(record.data.jobupdateddate) >= last && new Date(record.data.jobupdateddate) <= new Date());
                }
            }, dateValue, false);

            tagPanelItm[3].show();
            if (dateValue != "Custom Range") {
                var textVal = dateValue.substring(0, 10);
            } else {
                var dateRefText = Ext.Date.format(new Date(this.getReferences().customDateRef.value), 'd/m/y'),
                    textVal = dateRefText.substring(0, 10);
            }
            tagPanelItm[3].items.items[0].setText(textVal);
        } else {
            dataviewStore.removeFilter('filterByDate');
        }

        window.close();

        var jobStatusCombo = Ext.ComponentQuery.query('[reference = jobappliedstatuscomboref]')[0];
        jobStatusCombo.getStore().clearFilter();

    },

    onFilterDateSelect: function (combo, record, eOpts) { /*on custom range selection*/
        var store = combo.getStore(),
            fieldValue = combo.getSelection().data.name;
        if (fieldValue == "Custom Range") {
            this.getReferences().customDateRef.show();
        } else {
            this.getReferences().customDateRef.hide();
        }
    },
    /* for min value selected*/
    onMinValueSelect: function (field, e, eOpts) {
        var form = Ext.ComponentQuery.query('[reference = jaFiltersForm]')[0],
            maxVal = form.getValues().maxworkexperience,
            minVal = field.value;

        if (maxVal != "" && minVal >= parseInt(maxVal)) {
            Utility.topAlertMessage('WARNING', "Please Enter value less than maxExp value");
            field.setValue(null);
        } else {
            return minVal;
        }
    },
    /* for max value selected*/
    onMaxValueSelect: function (field, e, eOpts) {
        var form = Ext.ComponentQuery.query('[reference = jaFiltersForm]')[0],
            minVal = form.getValues().minworkexperience,
            maxVal = field.value;

        if (minVal != "" && maxVal < parseInt(minVal)) {
            Utility.topAlertMessage('WARNING', "Please Enter value more than minExp value");
            field.setValue(null);
        } else {
            return maxVal;
        }
    }

});