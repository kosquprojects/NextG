/*!
* jquery.fancytree.dnd.js
*
* Drag-and-drop support.
* (Extension module for jquery.fancytree.js: https://github.com/mar10/fancytree/)
*
* Copyright (c) 2014, Martin Wendt (http://wwWendt.de)
*
* Released under the MIT license
* https://github.com/mar10/fancytree/wiki/LicenseInfo
*
* @version 2.6.0
* @date 2014-11-29T08:33
*/;(function($,window,document,undefined){"use strict";var didRegisterDnd=false;function offsetString(n){return n===0?"":((n>0)?("+"+n):(""+n));}
function _initDragAndDrop(tree){var dnd=tree.options.dnd||null;if(dnd){_registerDnd();}
if(dnd&&dnd.dragStart){tree.widget.element.draggable($.extend({addClasses:false,appendTo:tree.$container,containment:false,delay:0,distance:4,revert:false,scroll:true,scrollSpeed:7,scrollSensitivity:10,connectToFancytree:true,helper:function(event){var $helper,sourceNode=$.ui.fancytree.getNode(event.target),$nodeTag=$(sourceNode.span);if(!sourceNode){return "<div>ERROR?: helper requested but sourceNode not found</div>";}
$helper=$("<div class='fancytree-drag-helper'><span class='fancytree-drag-helper-img' /></div>").css({zIndex:3,position:"relative"}).append($nodeTag.find("span.fancytree-title").clone());$helper.data("ftSourceNode",sourceNode);return $helper;},start:function(event,ui){var sourceNode=ui.helper.data("ftSourceNode");return!!sourceNode;}},tree.options.dnd.draggable));}
if(dnd&&dnd.dragDrop){tree.widget.element.droppable($.extend({addClasses:false,tolerance:"intersect",greedy:false},tree.options.dnd.droppable));}}
function _registerDnd(){if(didRegisterDnd){return;}
$.ui.plugin.add("draggable","connectToFancytree",{start:function(event,ui){var draggable=$(this).data("ui-draggable")||$(this).data("draggable"),sourceNode=ui.helper.data("ftSourceNode")||null;if(sourceNode){draggable.offset.click.top=-2;draggable.offset.click.left=+16;return sourceNode.tree.ext.dnd._onDragEvent("start",sourceNode,null,event,ui,draggable);}},drag:function(event,ui){var isHelper,logObject,draggable=$(this).data("ui-draggable")||$(this).data("draggable"),sourceNode=ui.helper.data("ftSourceNode")||null,prevTargetNode=ui.helper.data("ftTargetNode")||null,targetNode=$.ui.fancytree.getNode(event.target);if(event.target&&!targetNode){isHelper=$(event.target).closest("div.fancytree-drag-helper,#fancytree-drop-marker").length>0;if(isHelper){logObject=sourceNode||prevTargetNode||$.ui.fancytree;logObject.debug("Drag event over helper: ignored.");return;}}
ui.helper.data("ftTargetNode",targetNode);if(prevTargetNode&&prevTargetNode!==targetNode){prevTargetNode.tree.ext.dnd._onDragEvent("leave",prevTargetNode,sourceNode,event,ui,draggable);}
if(targetNode){if(!targetNode.tree.options.dnd.dragDrop){}else if(targetNode===prevTargetNode){targetNode.tree.ext.dnd._onDragEvent("over",targetNode,sourceNode,event,ui,draggable);}else{targetNode.tree.ext.dnd._onDragEvent("enter",targetNode,sourceNode,event,ui,draggable);}}},stop:function(event,ui){var logObject,draggable=$(this).data("ui-draggable")||$(this).data("draggable"),sourceNode=ui.helper.data("ftSourceNode")||null,targetNode=ui.helper.data("ftTargetNode")||null,eventType=event.type,dropped=(eventType==="mouseup"&&event.which===1);if(!dropped){logObject=sourceNode||targetNode||$.ui.fancytree;logObject.debug("Drag was cancelled");}
if(targetNode){if(dropped){targetNode.tree.ext.dnd._onDragEvent("drop",targetNode,sourceNode,event,ui,draggable);}
targetNode.tree.ext.dnd._onDragEvent("leave",targetNode,sourceNode,event,ui,draggable);}
if(sourceNode){sourceNode.tree.ext.dnd._onDragEvent("stop",sourceNode,null,event,ui,draggable);}}});didRegisterDnd=true;}
$.ui.fancytree.registerExtension({name:"dnd",version:"0.1.0",options:{autoExpandMS:1000,draggable:null,droppable:null,focusOnClick:false,preventVoidMoves:true,preventRecursiveMoves:true,dragStart:null,dragStop:null,dragEnter:null,dragOver:null,dragDrop:null,dragLeave:null},treeInit:function(ctx){var tree=ctx.tree;this._super(ctx);if(tree.options.dnd.dragStart){tree.$container.on("mousedown",function(event){if(!tree.hasFocus()&&ctx.options.dnd.focusOnClick){var node=$.ui.fancytree.getNode(event);node.debug("Re-enable focus that was prevented by jQuery UI draggable.");setTimeout(function(){$(event.target).closest(":tabbable").focus();},10);}});}
_initDragAndDrop(tree);},nodeKeydown:function(ctx){var event=ctx.originalEvent;if(event.which===$.ui.keyCode.ESCAPE){this._local._cancelDrag();}
return this._super(ctx);},nodeClick:function(ctx){return this._super(ctx);},_setDndStatus:function(sourceNode,targetNode,helper,hitMode,accept){var posOpts,markerOffsetX=0,markerAt="center",instData=this._local,$source=sourceNode?$(sourceNode.span):null,$target=$(targetNode.span);if(!instData.$dropMarker){instData.$dropMarker=$("<div id='fancytree-drop-marker'></div>").hide().css({"z-index":1000}).prependTo($(this.$div).parent());}
if(hitMode==="after"||hitMode==="before"||hitMode==="over"){switch(hitMode){case "before":instData.$dropMarker.removeClass("fancytree-drop-after fancytree-drop-over").addClass("fancytree-drop-before");markerAt="top";break;case "after":instData.$dropMarker.removeClass("fancytree-drop-before fancytree-drop-over").addClass("fancytree-drop-after");markerAt="bottom";break;default:instData.$dropMarker.removeClass("fancytree-drop-after fancytree-drop-before").addClass("fancytree-drop-over");$target.addClass("fancytree-drop-target");markerOffsetX=8;}
if($.ui.fancytree.jquerySupports.positionMyOfs){posOpts={my:"left"+offsetString(markerOffsetX)+" center",at:"left "+markerAt,of:$target};}else{posOpts={my:"left center",at:"left "+markerAt,of:$target,offset:""+markerOffsetX+" 0"};}
instData.$dropMarker.show().position(posOpts);}else{$target.removeClass("fancytree-drop-target");instData.$dropMarker.hide();}
if(hitMode==="after"){$target.addClass("fancytree-drop-after");}else{$target.removeClass("fancytree-drop-after");}
if(hitMode==="before"){$target.addClass("fancytree-drop-before");}else{$target.removeClass("fancytree-drop-before");}
if(accept===true){if($source){$source.addClass("fancytree-drop-accept");}
$target.addClass("fancytree-drop-accept");helper.addClass("fancytree-drop-accept");}else{if($source){$source.removeClass("fancytree-drop-accept");}
$target.removeClass("fancytree-drop-accept");helper.removeClass("fancytree-drop-accept");}
if(accept===false){if($source){$source.addClass("fancytree-drop-reject");}
$target.addClass("fancytree-drop-reject");helper.addClass("fancytree-drop-reject");}else{if($source){$source.removeClass("fancytree-drop-reject");}
$target.removeClass("fancytree-drop-reject");helper.removeClass("fancytree-drop-reject");}},_onDragEvent:function(eventName,node,otherNode,event,ui,draggable){if(eventName!=="over"){this.debug("tree.ext.dnd._onDragEvent(%s, %o, %o) - %o",eventName,node,otherNode,this);}
var nodeOfs,relPos,relPos2,enterResponse,hitMode,r,opts=this.options,dnd=opts.dnd,ctx=this._makeHookContext(node,event,{otherNode:otherNode,ui:ui,draggable:draggable}),res=null,$nodeTag=$(node.span);switch(eventName){case "start":if(node.isStatusNode()){res=false;}else if(dnd.dragStart){res=dnd.dragStart(node,ctx);}
if(res===false){this.debug("tree.dragStart() cancelled");ui.helper.trigger("mouseup").hide();}else{$nodeTag.addClass("fancytree-drag-source");}
break;case "enter":if(dnd.preventRecursiveMoves&&node.isDescendantOf(otherNode)){r=false;}else{r=dnd.dragEnter?dnd.dragEnter(node,ctx):null;}
if(!r){res=false;}else if($.isArray(r)){res={over:($.inArray("over",r)>=0),before:($.inArray("before",r)>=0),after:($.inArray("after",r)>=0)};}else{res={over:((r===true)||(r==="over")),before:((r===true)||(r==="before")),after:((r===true)||(r==="after"))};}
ui.helper.data("enterResponse",res);this.debug("helper.enterResponse: %o",res);break;case "over":enterResponse=ui.helper.data("enterResponse");hitMode=null;if(enterResponse===false){}else if(typeof enterResponse==="string"){hitMode=enterResponse;}else{nodeOfs=$nodeTag.offset();relPos={x:event.pageX-nodeOfs.left,y:event.pageY-nodeOfs.top};relPos2={x:relPos.x/$nodeTag.width(),y:relPos.y/$nodeTag.height()};if(enterResponse.after&&relPos2.y>0.75){hitMode="after";}else if(!enterResponse.over&&enterResponse.after&&relPos2.y>0.5){hitMode="after";}else if(enterResponse.before&&relPos2.y<=0.25){hitMode="before";}else if(!enterResponse.over&&enterResponse.before&&relPos2.y<=0.5){hitMode="before";}else if(enterResponse.over){hitMode="over";}
if(dnd.preventVoidMoves){if(node===otherNode){this.debug("    drop over source node prevented");hitMode=null;}else if(hitMode==="before"&&otherNode&&node===otherNode.getNextSibling()){this.debug("    drop after source node prevented");hitMode=null;}else if(hitMode==="after"&&otherNode&&node===otherNode.getPrevSibling()){this.debug("    drop before source node prevented");hitMode=null;}else if(hitMode==="over"&&otherNode&&otherNode.parent===node&&otherNode.isLastSibling()){this.debug("    drop last child over own parent prevented");hitMode=null;}}
ui.helper.data("hitMode",hitMode);}
if(hitMode==="over"&&dnd.autoExpandMS&&node.hasChildren()!==false&&!node.expanded){node.scheduleAction("expand",dnd.autoExpandMS);}
if(hitMode&&dnd.dragOver){ctx.hitMode=hitMode;res=dnd.dragOver(node,ctx);}
this._local._setDndStatus(otherNode,node,ui.helper,hitMode,res!==false&&hitMode!==null);break;case "drop":hitMode=ui.helper.data("hitMode");if(hitMode&&dnd.dragDrop){ctx.hitMode=hitMode;dnd.dragDrop(node,ctx);}
break;case "leave":node.scheduleAction("cancel");ui.helper.data("enterResponse",null);ui.helper.data("hitMode",null);this._local._setDndStatus(otherNode,node,ui.helper,"out",undefined);if(dnd.dragLeave){dnd.dragLeave(node,ctx);}
break;case "stop":$nodeTag.removeClass("fancytree-drag-source");if(dnd.dragStop){dnd.dragStop(node,ctx);}
break;default:$.error("Unsupported drag event: "+eventName);}
return res;},_cancelDrag:function(){var dd=$.ui.ddmanager.current;if(dd){dd.cancel();}}});}(jQuery,window,document));