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
    var ListDiv = $("#container2");
    ListDiv.empty();
//    console.log(noOfTokens);
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
      var img = property[5];
      var owner = await instance.token2Owner(i);
//      console.log("owner "+owner.toString());
      console.log(owner, App.account);
      if(owner.toUpperCase() === App.account.toUpperCase()) {
        // todo
        var entity = await App.assetsOwner(img, name, "Image", boughtAtValuePerSqFt, rentedTo, rentedAt, new Date(rentedUpto), sellValPerSqFt, rentValPerSqFtPerDay, i);
        ListDiv.append(entity);
      }
    }
    var noOfProperties = await instance.noOfProperties();
    noOfProperties = noOfProperties.toNumber();
//    console.log(noOfProperties);
    for (var i = 0; i < noOfProperties; i++) {
//      console.log(i);
      var prop = await instance.props(i);
      var name = prop[0];
      var sqft = prop[1];
      var rentedAtValue = prop[2];
      var rentedBy = prop[3];
      var rentedUntil = prop[4];
      var img = prop[5];
      var rent = await instance.calcRentPerSqFtPerDay(i);
//      console.log("rented by " + rentedBy.toString());
      console.log(rentedBy, App.account);
      if(rentedBy.toUpperCase() === App.account.toUpperCase()) {
        var entity = await App.assetsTenant(img, name, "Image", rent, new Date(rentedUntil))
        ListDiv.append(entity);
      }
      var owner = await instance.property2MainOwner(i);
      console.log(owner, App.account)
      if(owner.toUpperCase() === App.account.toUpperCase()) {
//      (img,name,l,rentedto,rentpri,rentup)
        console.log("rentedby " + rentedBy);
        var entity = await App.assetsMainOwner(img, name, "Image", rentedBy.toString(), rentedAtValue.toNumber(), new Date(rentedUntil), i);
        ListDiv.append(entity);
      }
    }
    console.log("rendered");
  },
  changeDetails: function(id) {
    var sp = document.getElementById("sellPrice"+id.toString()).value;
    var rent = document.getElementById("rent"+id.toString()).value;
    console.log(sp, rent);
    App.contracts.EstateToken.deployed().then(function(_instance) {
      return _instance.setValues(id, sp, rent);
      }).then(function(result) {
        console.log(result);
      }).catch(function(err) {
        console.log(err);
    });
  },
  transfer: function(id) {
      var newOwnerAdd = document.getElementById("transfer"+id.toString()).value;
      console.log(newOwnerAdd);
      App.contracts.EstateToken.deployed().then(function(_instance) {
        return _instance.changeMainOwner(id, newOwnerAdd);
        }).then(function(result) {
          console.log(result);
        }).catch(function(err) {
          console.log(err);
      });
    },
  assetsOwner: function(img,name,l,rate,rentedto,rentedpri,rentedup,sell,rent, id) {
    var str="";
    str+="<div class=well id=owner >OWNER</div><div id=entity-owner><img id=entity-icon src="+img+" height=320 width=350 />";
    str+="<div id=info><div id=content><strong id=name>"+name+"</strong><br/>";
    str+="<strong id=type>Token</strong><br/>";
    str+="<strong id=link><a href=\""+img+"\">"+l+"</a></strong><br/>";
    str+="<strong id=rate>Current Value: "+rate+"</strong><br/>";
    str+="<strong id=rentto>Rented To: "+rentedto+"</strong><br/>";
    str+="<strong id=rentprice>Rented At Price: "+rentedpri+"</strong><br/></div>";
    str+="<span style=margin-right:40px;><label>Selling Price: </label><input type=text value="+sell+" id=\"sellPrice"+id.toString()+"\"/></span>";
    str+="<span style=margin-right:40px;><label>Expected Rent Per Day Per Sq.Ft.: </label><input type=text value="+rent+" id=\"rent"+id.toString()+"\"/></span>"
    str+="<button type=button id=save onclick=\"App.changeDetails("+id+");\" class=\'btn btn-primary\'>Save</button>";
    str+="</div></div><hr>";
    return str;
  },
  assetsTenant: function(img,name,l,rentprice,rentupto) {
    var str="";
    str+="<div class=well id=tenant >TENANT</div><div id=entity-tenant><img id=entity-icon src="+img+" height=220 width=300 />";
    str+="<div id=info><strong id=name>"+name+"</strong><br/>";
    str+="<strong id=type>Property</strong><br/>";
    str+="<strong id=link><a href=\""+img+"\">"+l+"</a></strong><br/>";
    str+="<strong id=rentprice>Rented At Price: "+rentprice+"</strong><br/>";
//    str+="<strong id=rentupto>Rented Upto: "+rentupto+"</strong><br/>"
    str += "</div></div><hr>";
    return str;
  },
  assetsMainOwner: function(img,name,l,rentedto,rentpri,rentup, id) {
    var str='';
    str+="<div class=well id=main-owner >MAIN OWNER</div><div id=entity-main-owner><img id=entity-icon src="+img+" height=320 width=350 />";
    str+="<div id=info><div id=content><strong id=name>"+name+"</strong><br/>";
    str+="<strong id='type'>Property</strong><br/>";
    str+="<strong id='link'><a href=\""+img+"\">"+l+"</a></strong><br/>";
    str+="<span style=margin-right:40px;><label>Transfer Main Ownership To Address: </label><input type=text id=\"transfer"+id.toString()+"\"/></span>"
    str+="<button type=button id=saveNewOwner onclick=\"App.transfer("+id+");\" class=\'btn btn-primary\'>Save</button><br/>";
    str+="<strong id='rentto'>Rented To:"+rentedto+"</strong><br/>";
    str+="<strong id='rentprice'>Rented Price:"+rentpri+"</strong><br/></div>";
    str+="</div></div><hr>";
    return str;
  }

}
async function _init() {
    await App.init();
}
$(window).on('load', function(){
    _init();
});
