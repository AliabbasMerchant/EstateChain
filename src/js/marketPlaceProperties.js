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
    var a = false;
    $.getJSON("EstateToken.json", function(estateToken) {
      App.contracts.EstateToken = TruffleContract(estateToken);
      App.contracts.EstateToken.setProvider(App.web3Provider);
      return App.render();
    });
  },
  makeEntity: function(img,name,l,rate, sqft, id) {
    console.log("Rent "+id);
  	var str='';
    str+="<div id=entity><img id=entity-icon src="+img+" height=220 width=300 /><div id=info><div id=content>";
    str+="<strong id=name>"+name+"</strong><br/>";
    str+="<strong id=type>Property</strong><br/>";
    str+="<strong id=link><a href=\""+img+"\">"+l+"</a></strong><br/>";
    str+="<strong id=area>Area: "+sqft+" sq. ft.</strong><br/>";
    str+="<strong id=rate>Rent Rate: "+rate+"</strong></div><div id=btn>";
    str+="<button type=button class=\'btn btn-primary btn-block\' id=more_info_btn onclick=\"App.rent("+id+");\">Rent</button></div></div></div><hr>";
  	return str;
  },
  render: async function() {
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
      }
    });
    var inst = await App.contracts.EstateToken.deployed();
    var noOfProperties = await inst.noOfProperties();
    noOfProperties = noOfProperties.toNumber();
    var ListDiv = $("#container1");
    ListDiv.empty();
    console.log(noOfProperties);
    for (var i = 0; i < noOfProperties; i++) {
      var prop = await inst.props(i);
      var name = prop[0];
      var sqft = prop[1];
      var rentedAtValue = prop[2];
      var rentedBy = prop[3];
      var rentedUntil = prop[4];
      var image = prop[5];
      var rent = await inst.calcRentPerSqFtPerDay(i);
      var mainOwner = await inst.property2MainOwner(i);
      if(!(rentedBy.toUpperCase() === App.account.toUpperCase())) {
        if(!(mainOwner.toUpperCase() === App.account.toUpperCase())) {
          var entity = App.makeEntity(image, name, "Image", rent, sqft, i)
          ListDiv.append(entity);
        }
      }
    }
  },
  rent: function(_propId, days) {
    console.log(_propId);
    var days = prompt("Rent for how many days??");
    days = parseInt(days);
    var inst;
    App.contracts.EstateToken.deployed().then(function(_instance) {
        inst = _instance;
        return inst.props(_propId);
    }).then(function(prop) {
        inst.calcRentPerSqFtPerDay(_propId).then(function(rent) {
            var sqft = prop[1];
            var _value = rent*days*sqft;
            console.log(_value);
            inst.Rent(_propId, days, {from:App.account, value:web3.toWei(_value, 'ether')}).then(function(res) {
                console.log(res);
            });
        });
    }).catch(function(err) {
        console.log(err);
    });
  }
};
async function _init() {
    await App.init();
}
$(window).on('load', function(){
    _init();
});