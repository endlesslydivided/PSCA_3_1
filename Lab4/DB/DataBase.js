const EventEmitter = require('events');
const fs = require('fs');

class DataBase extends EventEmitter{
    static names()
    {
        return require('./data/data');
    }

    constructor(model){
        super();
        this.model = model;
    }

    async stCommit(){
        
    }

    async getRows(){
        return this.model;
    }

    async addRow(newObject)
    {
        if(newObject.id == '0')
        {
            newObject.id = Math.max(this.model.map(m=> m.id)) + 1;
        }
        await this.commit(newObject,'insert');
        return newObject;
    }

    async updateRow(newValues)
    {
        let oldObject = this.model.find(m => m.id == newValues.id);
        if (!oldObject) 
        {
            throw {message: 'Invalid Request', code: 401};
        }
        let targetObject = this.model.splice(this.model.indexOf(oldObject), 1)[0];
        Object.keys(newValues).forEach(field=>
        {
            if(targetObject[field])
            {
                targetObject[field] = newValues[field];
            }
        });
        await this.commit(targetObject,'update');
        return targetObject;
    }

    async removeRow(oldValue)
    {
        let oldObject = this.model.find(m => m.id == oldValue);
        if (!oldObject) {
            throw {message: 'Invalid Request', code: 401};
        }
        await this.commit(oldObject, 'delete');
        return oldObject;
    }


    async commit(object,action)
    {
        if(action === 'insert' || action === 'update')
        {
            this.model.push(object);
        }
        else if(action === 'delete')
        {
            this.model.splice(this.model.indexOf(object),1);
        }
        await fs.writeFile('./DB/data/data.json',JSON.stringify(this.model,null,''),()=> {});
    }

}

module.exports = DataBase;