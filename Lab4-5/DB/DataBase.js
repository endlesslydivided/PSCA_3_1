const util = require('util');
const events = require('events');
const { EventEmitter } = require('stream');

class DataBase extends EventEmitter
{ 
	constructor() {
		super();
        this.model = 
        [{id: 0, name: 'Иванов И.И.', bday: '2001-01-01'},
		{id: 1, name: 'Иванов А.И.', bday: '2001-01-02'},
		{id: 2, name: 'Иванов К.И.', bday: '2001-01-03'},
		{id: 3, name: 'Иванов С.И.', bday: '2001-01-04'},
		{id: 4, name: 'Иванов П.И.', bday: '2001-01-05'}];
    }

	async select() 
	{
        return this.model;
    }

	async commit(object, action) 
    {

    }
 	
	async insert(object) 
	{
        if(typeof object.id === 'undefined')
        {
			object.id = Math.max(...this.model.map(m => m.id)) + 1;
		}
		this.model.push(object);
        return object;
    }

    async update(updatedFields) 
	{
        let oldObject = this.model.find(m => m.id == updatedFields.id);
        if (!oldObject) 
		{
            throw {message: 'Invalid Request', code: 401};
        }
        let targetObject = this.model.splice(this.model.indexOf(oldObject), 1)[0];
        Object.keys(updatedFields).forEach(field => 
			{
            if (targetObject[field]) {
                targetObject[field] = updatedFields[field];
            }
        });
		this.model.push(targetObject);
        return targetObject;
    }
    async delete(id) 
	{
        let oldObject = this.model.find(m => m.id == id);
        if (!oldObject) 
		{
            throw {message: 'Invalid Request', code: 401};
        }
        this.model.splice(this.model.indexOf(oldObject), 1);
        return oldObject;
    }
}


module.exports = DataBase;