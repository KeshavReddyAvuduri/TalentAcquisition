Ext.define('JobOpenings.view.referrals.filtertoolbar.JobMyReferralsFilterController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.jobmyreferralsfiltercontroller',
    /* on location selected*/
    onLocationSelect: function(combo, record, eOpts) {
        var store = combo.getStore(),
            fieldValue = combo.getSelection().data.ddo_joblocation_id,
            match = fieldValue;
    },
    /* on apply button clicked*/
    onApplyBtnClickMyReferrals: function(btn, e, eOpts) {
        var form = this.getView(),
            locationValue = form.getValues().filterlocation,
            departmentValue = form.getValues().filterdepartment,
            dateValue = form.getValues().filterDateName,
            match = locationValue,
            listview = Ext.ComponentQuery.query('jobopenigsmyreferralsview'), 
            dataview = listview[0].down('dataview[reference="jobmyreferralsdata"]'),
            dataviewStore = dataview.getStore(),
            window = form.up('window'),
            vm=this.getViewModel(),
            tagPanel = Ext.ComponentQuery.query("jobopenigsmyreferralsfilterview"), 
            tagPanelItm = tagPanel[0].items.items;

         tagPanelItm[3].hide();  
         tagPanelItm[4].hide();  
         tagPanelItm[5].hide();

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
            var textVal = locRefText.substring(0,10);
            tagPanelItm[4].items.items[0].setText(textVal);
        } else {
            dataviewStore.removeFilter('filterByLocation');
        }

        if (!Ext.isEmpty(departmentValue) && departmentValue!="All") {
            dataviewStore.filter({
                property: 'ddo_department_id',
                id: 'filterByDepartment',
                anyMatch: true,
                caseSensitie: false,
                value: departmentValue
            }, departmentValue, false);

            tagPanelItm[5].show();
            var depRefText = this.getReferences().deptcomboref.getSelectedRecord().data.name;
            var textVal = depRefText.substring(0,10);
            tagPanelItm[5].items.items[0].setText(textVal);
        } else {
            dataviewStore.removeFilter('filterByDepartment');
        }

        if (!Ext.isEmpty(dateValue) && dateValue!="All") {
            var days = null;
            if (dateValue == "Past 24 HR") {
                days = 1;
            } if (dateValue == "Past Week") {
                days = 7;
            } if (dateValue == "Custom Range") {
                var customRangeDate = this.getReferences().customDateRef.value;
                if (customRangeDate!=null || customRangeDate!=undefined) {
                    var oneDay = 24*60*60*1000;
                    var firstDate = new Date(customRangeDate);
                    var secondDate = new Date();
                    days = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
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
                filterFn: function(record) {
                    var date = new Date();
                    var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
                    return (new Date(record.data.jobupdateddate) >= last && new Date(record.data.jobupdateddate) <= new Date());
                } 
            }, dateValue, false);

            tagPanelItm[3].show();
            if (dateValue != "Custom Range") {
                var textVal = dateValue.substring(0,10);
            } else {
                var dateRefText = Ext.Date.format(new Date(this.getReferences().customDateRef.value), 'd/m/y'),
                    textVal = dateRefText.substring(0,10);
            }
            tagPanelItm[3].items.items[0].setText(textVal);
        } else {
            dataviewStore.removeFilter('filterByDate');
        }

        window.close();
    },
    /* on custon range date*/
    onFilterDateSelect: function(combo, record, eOpts) {
        var store = combo.getStore(),
            fieldValue = combo.getSelection().data.name;
        if (fieldValue == "Custom Range") {
            this.getReferences().customDateRef.show();
        } else {
            this.getReferences().customDateRef.hide();
        }
    }
});