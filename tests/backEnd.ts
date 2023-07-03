import Realm, { Credentials } from 'realm';
import { ObjectId } from "bson";
//import Realm from "realm";

export default class BackEnd{
    static listOfCollection:Array<any>;
    static app:Realm.App=new Realm.App("firebeeconnect-hvdfz");;
    static mongo:globalThis.Realm.Services.MongoDB=null;
    static user:Realm.User=null;

    static async login(){    
        if(!this.isLogged()){   
            try{             
                BackEnd.user=await BackEnd.app.logIn(Realm.Credentials.apiKey("@@@@@@@@@@@@@@@@@@@@KEY@@@@@@@@@@@@@@"));         
                BackEnd.mongo = await BackEnd.user.mongoClient("mongodb-atlas");            
            }catch(error){
                console.log(error);
            }
        }
    }
    static isLogged(){
        if(BackEnd.user!=null){
            return BackEnd.user.isLoggedIn;
        }
        return false;
    }
    
    static functions(){
        return BackEnd.user.functions;
    }

    static async getCollection(name:string){
        var collectionObj=BackEnd.listOfCollection.find(element=> element.name==name);
        if(collectionObj!=null){
            console.log("Return collection");
            return collectionObj.collection;
        }
        collectionObj={
            name:name,
            collection: BackEnd.mongo.db("FirebeeConnect").collection(name)
        }
        BackEnd.listOfCollection.push(collectionObj);
        console.log("Return new collection");
        return collectionObj.collection;
    }

    static async insert(collectionName:string,document:Object){
        if(BackEnd.user!=null){            
            var collection=await BackEnd.getCollection(collectionName);
            if(collection!=null){
                return collection.insertOne(document);
            }else{
                throw "Falha ao acessar a collection";
            }
            
        }else{
            throw "Usuario nÃ£o estÃ¡ logado";
        }
    }

    static async find(collectionName:string,filter:Object,project?:Object){
        if(BackEnd.user!=null){            
            var collection=await BackEnd.getCollection(collectionName);
            if(collection!=null){
                return collection.find(filter,project);
            }else{
                throw "Falha ao acessar a collection";
            }
            
        }else{
            throw "Usuario nÃ£o estÃ¡ logado";
        }
    }

    static async syncToCollection(collectionName:string,filter:Object,litsOfDocuments:any){
        var collection=await BackEnd.getCollection(collectionName)
        for await (const change of collection.watch(filter)){
            const { operationType } = change;
            switch (operationType) {
                case "insert": {
                    const { fullDocument } = change;
                    var document=litsOfDocuments.find(document=>document._id.equals(fullDocument._id));
                    if(document==null){
                        console.log(`Inserindo novo Documento: `, fullDocument);
                        litsOfDocuments.push(fullDocument);
                    }else{
                        console.log("Esse documento jÃ¡ existe ",fullDocument);
                    }                   
                    break;
                }
                case "update": 
                case "replace": {
                    const { fullDocument } = change;
                    var index=litsOfDocuments.findIndex(document=>document._id.equals(fullDocument._id));
                    if(index>=0){
                        Object.assign(litsOfDocuments[index], fullDocument);
                    }else{
                        console.log("Documento nÃ£o encontrado portanto sua atualiza foi ignorada ",fullDocument);
                    }
                    break;
                }
                case "delete": {
                    const { documentKey } = change;
                    var index=litsOfDocuments.findIndex(element=>element._id.equals(documentKey._id));
                    if(index>=0){
                        console.log("Deletando Documento:",documentKey);
                        litsOfDocuments.splice(index,1);
                    }else{
                        console.log("Documento nÃ£o encontrado portanto nÃ£o serÃ¡ deletado",documentKey)
                    }           
                break;
                }
            }
        } 
    }    
}

export {BackEnd,ObjectId};
