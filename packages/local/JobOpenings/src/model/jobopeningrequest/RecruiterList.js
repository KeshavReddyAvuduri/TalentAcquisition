Ext.define('JobOpenings.model.jobopeningrequest.RecruiterList', {
	extend: 'Ext.data.Model',

	fields: ['recruiter_name',{
        convert:function(value,record){
            record.data["recruiter_name"] = record.data["firstname"];
            delete record.data.firstname;
        }
    }, 'employee_id']
});