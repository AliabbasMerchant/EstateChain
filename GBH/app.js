function marketPlace(img,name,type,l,rate,btn){
	var str='';
	for(var i=0;i<img.length;i++)	
	{
		str+="<div id=entity><img id=entity-icon src="+img[i]+" height=220 width=300 /><div id=info><div id=content>";
		str+="<strong id=name>"+name[i]+"</strong><br/>";
		str+="<strong id=type>"+type[i]+"</strong><br/>";
		str+="<strong id=link>"+l[i]+"</strong><br/>";
		str+="<strong id=rate>"+rate[i]+"</strong></div><div id=btn>";
		str+="<button type=button class=\'btn btn-primary btn-block\' id=more_info_btn>"+btn[i]+"</button></div></div></div><hr>";
	}
	return str;
}

var img = new Array("img.jpg");
var le=new Array("divy");
var type=new Array('Property')
var l =new Array('Link p');
var rate=new Array('$899');
var btn=new Array('Buy');
var  rentedto=new Array('rentedto');
var  rentedpri=new Array('rentedpri');
var  rentedup=new Array('rentedup');
var  sell=new Array('sell');
var  rent=new Array('rent');

document.getElementById('container1').innerHTML = marketPlace(img,le,type,l,rate,btn);
