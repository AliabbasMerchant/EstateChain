function assetsOwner(img,name,type,l,rate,rentedto,rentedpri,rentedup,sell,rent)
{
	var str="";
	for(var i=0;i<img.length;i++)
	{
		str+="<div class=well id=owner >OWNER</div><div id=entity-owner><img id=entity-icon src="+img[i]+" height=320 width=350 /><div id=info><div id=content>";
		str+="<strong id=name>"+name[i]+"</strong><br/>";
		str+="<strong id=type>"+type[i]+"</strong><br/>";
		str+="<strong id=link>"+l[i]+"</strong><br/>";
		str+="<strong id=rate>"+rate[i]+"</strong><br/>";
		str+="<strong id=rentto>"+rentedto[i]+"</strong><br/>";
		str+="<strong id=rentprice>"+rentedpri[i]+"</strong><br/>";
		str+="<strong id=rentupto>"+rentedup[i]+"</strong><br/>";
		str+="</div><form><span style=margin-right:40px;><label>Selling Price: </label><input type=text value="+sell+" name=sellPrice id=sellPrice/>";
		str+="</span><span style=margin-right:40px;><label>Expected Rent Per Day Per Sq.Ft.: </label><input type=text value="+rent[i]+" name=rent id=rent/></span><button type=button id=save class=\'btn btn-primary\'>Save</button>";
		str+="</form></div></div><hr>";
	}
	return str;
}
function assetsTenant(img,name,type,l,rentprice,rentupto)
{
	var str="";
	for(var i=0;i<img.length;i++)
	{
		str+="<div class=well id=tenant >TENANT</div><div id=entity-tenant><img id=entity-icon src="+img[i]+" height=220 width=300 />";
		str+="<div id=info><strong id=name>"+name[i]+"</strong><br/>";
		str+="<strong id=type>"+type[i]+"</strong><br/>";
		str+="<strong id=link>"+l[i]+"</strong><br/>";
		str+="<strong id=rentprice>"+rentprice[i]+"</strong><br/>";
		str+="<strong id=rentupto>"+rentupto[i]+"</strong><br/></div></div><hr>";
	}
	return str;
}
function assetsMainOwner(img,name,type,l,rate,rentto,rentpri,rentup)
{
	var str='';
	for(var i=0;i<img.length;i++)
	{
		str+="<div class=well id=main-owner >MAIN OWNER</div><div id=entity-main-owner><img id=entity-icon src="+img[i]+" height=320 width=350 />";
		str+="<div id=info><div id=content><strong id=name>"+name[i]+"</strong><br/>";
		str+="<strong id='type'>"+type[i]+"</strong><br/>";
		str+="<strong id='link'>"+l[i]+"</strong><br/>"
		str+="<strong id='rate'>"+rate[i]+"</strong><br/>";
		str+="<strong id='rentto'>"+rentto+"</strong><br/>";
		str+="<strong id='rentprice'>"+rentpri+"</strong><br/>";
		str+="<strong id='rentupto'>"+rentup+"</strong><br/>";
		str+="</div></div></div><hr>"
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

document.getElementById('container2').innerHTML = assetsOwner(img,le,type,l,rate,rentedto,rentedpri,rentedup,sell,rent);
//document.getElementById('container2').innerHTML = assetsTenant(img,le,type,l,rentedto,rentedup);
//document.getElementById('container2').innerHTML = assetsMainOwner(img,le,type,l,rate,rentedto,rentedpri,rentedup);