({
    handlerOnError: function(component,event,helper) {
        var control = component.find("control");
        var onError = component.get("v.onError");
        if (onError) {
        	$A.util.addClass(control, 'slds-has-error');
        }
        else {
            $A.util.removeClass(control, 'slds-has-error');
        }
    },
    onfocus : function(component,event,helper){
        $A.util.addClass(component.find("mySpinner"), "slds-show");
        var forOpen = component.find("searchRes");
        $A.util.addClass(forOpen, 'slds-is-open');
        $A.util.removeClass(forOpen, 'slds-is-close');
        // Get Default 5 Records order by createdDate DESC  
        var getInputkeyWord = '';
        helper.searchHelper(component,event,getInputkeyWord);
    },
    onblur : function(component,event,helper){
        component.set("v.listOfSearchRecords", null );
        var forclose = component.find("searchRes");
        $A.util.addClass(forclose, 'slds-is-close');
        $A.util.removeClass(forclose, 'slds-is-open');
    },
    keyPressController : function(component, event, helper) {
        // get the search Input keyword   
        var getInputkeyWord = component.get("v.SearchKeyWord");
        // check if getInputKeyWord size id more then 0 then open the lookup result List and 
        // call the helper 
        // else close the lookup result List part.   
        if( getInputkeyWord.length > 0 ){
            var forOpen = component.find("searchRes");
            $A.util.addClass(forOpen, 'slds-is-open');
            $A.util.removeClass(forOpen, 'slds-is-close');
            helper.searchHelper(component,event,getInputkeyWord);
        }
        else{  
            component.set("v.listOfSearchRecords", null ); 
            var forclose = component.find("searchRes");
            $A.util.addClass(forclose, 'slds-is-close');
            $A.util.removeClass(forclose, 'slds-is-open');
        }
    },
    
    // function for clear the Record Selaction 
    clear :function(component,event,helper){
        debugger;
        helper.clearHelper(component,event);
        var onCancel = component.get("v.onCancel");
        if (onCancel!=undefined) {
            $A.enqueueAction(onCancel);
        }
    },
    
    // This function call when the end User Select any record from the result list.   
    handleComponentEvent : function(component, event, helper) {
        // get the selected Account record from the COMPONETN event 	 
        var selectedAccountGetFromEvent = event.getParam("recordByEvent");
        component.set("v.selectedRecord" , selectedAccountGetFromEvent);
        //component.set("v.idRecord",selectedAccountGetFromEvent.Id);
        var populateTable = component.get("v.populateTable");
        var fieldToDisplay = component.get("v.fieldToDisplay");
        var valueToDisplay = component.get("v.valueToDisplay");
        var clearPicklist = component.get("v.clearPicklist");
        valueToDisplay = selectedAccountGetFromEvent[fieldToDisplay];
        component.set("v.valueToDisplay",valueToDisplay);
        //if (!populateTable) {
        var forclose = component.find("lookup-pill");
        $A.util.addClass(forclose, 'slds-show');
        $A.util.removeClass(forclose, 'slds-hide');
            
        var forclose = component.find("searchRes");
        $A.util.addClass(forclose, 'slds-is-close');
        $A.util.removeClass(forclose, 'slds-is-open');
            
        var lookUpTarget = component.find("lookupField");
        $A.util.addClass(lookUpTarget, 'slds-hide');
        $A.util.removeClass(lookUpTarget, 'slds-show');
        if (component.get("v.showPill")) {
            var ctrlTarget = component.find("control");
            $A.util.addClass(ctrlTarget, 'slds-hide');
        	$A.util.removeClass(ctrlTarget, 'slds-show');
            var forclose = component.find("lookup-pill-2");
        	$A.util.addClass(forclose, 'slds-show');
        	$A.util.removeClass(forclose, 'slds-hide');
            component.set("v.items",[{
                type:'icon',
                href:'',
                label:valueToDisplay,
                iconName:component.get("v.iconName"),
                alternativeText:component.get("v.objectAPIName")
            }]);
        }
        //}
        //else {
        if (populateTable) {
            if (clearPicklist) {
            	helper.clearHelper(component,event);
            }
            var compEvent = component.getEvent("oPopulateTableEvent");
            // set the Selected sObject Record to the event attribute.  
            compEvent.setParams({"recordByEvent" : selectedAccountGetFromEvent });  
            // fire the event  
        	compEvent.fire();
        }
        
    }
})
