/*
 * Event
 *   
 */
var Event = {
    add:function(target,type,callback,useCapture){
            var paramsLength = callback.length;
            console.log("paramsLength "+paramsLength);
            target.addEventListener(type,function(e){
            },useCapture);
        },
    remove:function(target,type,callback,useCapture){
            target.removeEventListener(type,callback,useCapture);
        }
};