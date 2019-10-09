({
    searchHelper : function(component,event,getInputkeyWord) {
        // call the apex class method 
        var action = component.get("c.fetchLookUpValues");
        // set param to method  
        action.setParams({
            'searchKeyWord': getInputkeyWord,
            'ObjectName' : component.get("v.objectAPIName"),
            'searchFields' :component.get("v.searchFields"),
            'filter' :component.get("v.lookupFilter")
        });
        // set a callBack    
        action.setCallback(this, function(response) {
            $A.util.removeClass(component.find("mySpinner"), "slds-show");
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                var flatting = component.get("v.flatting");
                if (flatting) {
                    storeResponse = this.flattenQueryResult(storeResponse);
                }
                // if storeResponse size is equal 0 ,display No Result Found... message on screen.                }
                if (storeResponse.length == 0) {
                    component.set("v.Message", $A.get("$Label.c.Nessun_risultato_trovato"));
                } else {
                    component.set("v.Message", '');
                }
                // set searchResult list with return value from server.
                component.set("v.listOfSearchRecords", storeResponse);
            }
            
        });
        // enqueue the Action  
        $A.enqueueAction(action);
        
    },
    clearHelper: function(component,event) {
        var pillTarget = component.find("lookup-pill");
        var lookUpTarget = component.find("lookupField"); 
        
        $A.util.addClass(pillTarget, 'slds-hide');
        $A.util.removeClass(pillTarget, 'slds-show');
        
        $A.util.addClass(lookUpTarget, 'slds-show');
        $A.util.removeClass(lookUpTarget, 'slds-hide');
        if (component.get("v.showPill")) {
            var ctrlTarget = component.find("control");
            $A.util.removeClass(ctrlTarget, 'slds-hide');
        	$A.util.addClass(ctrlTarget, 'slds-show');
            var forclose = component.find("lookup-pill-2");
        	$A.util.removeClass(forclose, 'slds-show');
        	$A.util.addClass(forclose, 'slds-hide');
            component.set("v.items",[]);
        }
        
        component.set("v.SearchKeyWord",null);
        component.set("v.listOfSearchRecords", null );
        component.set("v.selectedRecord", {} );
    },
    flattenObject : function(propName, obj) {
        var flatObject = [];
        
        for(var prop in obj)
        {
            //if this property is an object, we need to flatten again
            var propIsNumber = isNaN(propName);
            var preAppend = propIsNumber ? propName+'.' : '';
            if(typeof obj[prop] == 'object')
            {
                flatObject[preAppend+prop] = Object.assign(flatObject, this.flattenObject(preAppend+prop,obj[prop]) );
                
            }    
            else
            {
                flatObject[preAppend+prop] = obj[prop];
            }
        }
        return flatObject;
    },  
    flattenQueryResult : function(listOfObjects) {
        if(!Array.isArray(listOfObjects)) 
        {
            var listOfObjects = [listOfObjects];
        }
        
        console.log('List of Objects is now....');
        console.log(listOfObjects);
        for(var i = 0; i < listOfObjects.length; i++)
        {
            var obj = listOfObjects[i];
            for(var prop in obj)
            {      
                if(!obj.hasOwnProperty(prop)) continue;
                if(typeof obj[prop] == 'object' && typeof obj[prop] != 'Array')
                {
                    obj = Object.assign(obj, this.flattenObject(prop,obj[prop]));
                }
                else if(typeof obj[prop] == 'Array')
                {
                    for(var j = 0; j < obj[prop].length; j++)
                    {
                        obj[prop+'.'+j] = Object.assign(obj,this.flattenObject(prop,obj[prop]));
                    }
                }
            }
        }
        return listOfObjects;
    }
})
