function computeObject(object, func){
    var newObj = {};
    var key = Object.keys(newObj);
    var value = Object.values(newObj);
    for(var i in object){
        key = Object.keys(object);
        value = func(Object.values(object));
    }
    return newObj;
}


function compute(object, func){
    if( !object || object === undefined){
        throw `You must pass the object`;
    }
    if( Object.prototype.toString.call(object) !== '[object Object]'){
        throw `You must check your object'type`;
    }
    if ( func === undefined || typeof func !== "function") { 
        throw `You must pass right function`;
    }
    for(let [key, value] of Object.entries(object)){
        if( Object.prototype.toString.call(value) !== '[object Number]' ){
            throw `the values in object must be numbers`;
        }
        object[key] = value*2;
    }
    return object;
}


console.log(compute({a:3,b:7},n=>n*2));