App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  init: async function() {
    return await App.initWeb3();
  },
  initWeb3: async function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
    return await App.initContract();
  },
  initContract: async function() {
    $.getJSON("EstateToken.json", function(estateToken) {
      App.contracts.EstateToken = TruffleContract(estateToken);
      App.contracts.EstateToken.setProvider(App.web3Provider);
      return App.render();
    });
  },
  render: async function() {
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        console.log("Account = "+App.account.toString());
      }
    });
    var instance = await App.contracts.EstateToken.deployed();
    var noOfTokens = await instance.noOfTokens();
    noOfTokens = noOfTokens.toNumber();
    var ListDiv = $("#container1");
    ListDiv.empty();
    console.log(noOfTokens);
    for (var i = 0; i < noOfTokens; i++) {
      var token = await instance.tokens(i);
      var propId = token[0];
      var boughtAtValuePerSqFt = token[1];
      var sellValPerSqFt = token[2]; // 0 implies not to sell
      var rentValPerSqFtPerDay = token[3]; // 0 implies not set
      var property = await instance.props(propId);
      var name = property[0];
      var rentedAt = property[2];
      var rentedTo = property[3];
      var rentedUpto = property[4];
      var owner = await instance.token2Owner(i);
      console.log("owner "+owner.toString());
      if(owner.toString() == App.account.toString()) {
        // todo
        var entity = App.assetsOwner("img.jpg", name, "-", boughtAtValuePerSqFt, rentedTo, rentedAt, rentedUpto, sellValPerSqFt, rentValPerSqFtPerDay, i)
        ListDiv.append(entity);
      }
    }
    var noOfProperties = await instance.noOfProperties();
    noOfProperties = noOfProperties.toNumber();
    console.log(noOfProperties);
    for (var i = 0; i < noOfProperties; i++) {
      console.log(i);
      var prop = await instance.props(i);
      var name = prop[0];
      var sqft = prop[1];
      var rentedAtValue = prop[2];
      var rentedBy = prop[3];
      var rentedUntil = prop[4];
      var docsHash = prop[5];
      var rent = await instance.calcRentPerSqFtPerDay(i);
      console.log("rented by " + rentedBy.toString());
      if(rentedBy.toString() == App.account.toString()) {
        var entity = App.assetsTenant("img.html", name, "-", rent, new Date(rentedUntil))
        ListDiv.append(entity);
      }
      var owner = await instance.property2MainOwner(i);
      console.log("propOwner " + owner.toString());
      if(owner == App.account) {
        var entity = App.assetsMainOwner("img.jpg", name, "-", rentedTo, rentedAt, rentedUpto)
        ListDiv.append(entity);
      }
    }
    console.log("rendered");
  },
  assetsOwner: function(img,name,l,rate,rentedto,rentedpri,rentedup,sell,rent, id)
  {
    var str="";
    str+="<div class=well id=owner >OWNER</div><div id=entity-owner><img id=entity-icon src="+img+" height=320 width=350 /><div id=info><div id=content>";
    str+="<strong id=name>"+name+"</strong><br/>";
    str+="<strong id=type>Token</strong><br/>";
    str+="<strong id=link>"+l+"</strong><br/>";
    str+="<strong id=rate>"+rate+"</strong><br/>";
    str+="<strong id=rentto>"+rentedto+"</strong><br/>";
    str+="<strong id=rentprice>"+rentedpri+"</strong><br/>";
    str+="<strong id=rentupto>"+rentedup+"</strong><br/>";
    str+="</div><form><span style=margin-right:40px;><label>Selling Price: </label><input type=text value="+sell+" name=sellPrice id=sellPrice/>";
    str+="</span><span style=margin-right:40px;><label>Expected Rent Per Day Per Sq.Ft.: </label><input type=text value="+rent+" name=rent id=rent/></span><button type=button id=save class=\'btn btn-primary\'>Save</button>";
    str+="</form></div></div><hr>";
    return str;
  },
  assetsTenant: function(img,name,l,rentprice,rentupto)
  {
    var str="";
    str+="<div class=well id=tenant >TENANT</div><div id=entity-tenant><img id=entity-icon src="+img+" height=220 width=300 />";
    str+="<div id=info><strong id=name>"+name+"</strong><br/>";
    str+="<strong id=type>Property</strong><br/>";
    str+="<strong id=link>"+l+"</strong><br/>";
    str+="<strong id=rentprice>"+rentprice+"</strong><br/>";
    str+="<strong id=rentupto>"+rentupto+"</strong><br/></div></div><hr>";
    return str;
  },
  assetsMainOwner: function(img,name,l,rate,rentedto,rentpri,rentup)
  {
    var str='';
    str+="<div class=well id=main-owner >MAIN OWNER</div><div id=entity-main-owner><img id=entity-icon src="+img+" height=320 width=350 />";
    str+="<div id=info><div id=content><strong id=name>"+name+"</strong><br/>";
    str+="<strong id='type'>Property</strong><br/>";
    str+="<strong id='link'>"+l+"</strong><br/>";
    str+="<strong id='rentto'>"+rentto+"</stro ng><br/>";
    str+="<strong id='rentprice'>"+rentpri+"</strong><br/>";
    str+="<strong id='rentupto'>"+rentup+"</strong><br/>";
    str+="</div></div></div><hr>"
    return str;
  }

};
async function _init() {
    await App.init();
}
$(window).on('load', function(){
    _init();
});
