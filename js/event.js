/*
 * Event
 *   
 */
var Event = {
    add:function(target,type,callback,useCapture){
            var paramsLength = callback.length;
            target.addEventListener(type,function(e){
                callback.forEach(function(btn,i){
                    if(btn === e.target.NodeName){
                        
                    }
                });
            },useCapture);
        },
    remove:function(target,type,callback,useCapture){
            target.removeEventListener(type,callback,useCapture);
        }
};