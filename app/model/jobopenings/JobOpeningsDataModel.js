Ext.define('JobsModule.model.jobopenings.JobOpeningsDataModel', {
	extend: 'Ext.data.Model',

	fields: ['title','recruiter_name', {
		name:'count'
		// convert:function(value,rec){
		// 	return Ext.getStore('jobopenings.JobRecruiter').getCount();
		// }
	}]
});