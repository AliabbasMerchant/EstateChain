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
    console.log("Button "+id);
  	var str='';
    str+="<div id=entity><img id=entity-icon src="+img+" height=220 width=300 /><div id=info><div id=content>";
    str+="<strong id=name>"+name+"</strong><br/>";
    str+="<strong id=type>"+"Token"+"</strong><br/>";
    str+="<strong id=link><a href=\""+img+"\">"+l+"</a></strong><br/>";
    str+="<strong id=area>Area: "+sqft+" sq. ft.</strong><br/>";
    str+="<strong id=rate>Selling Price: "+rate+"</strong></div><div id=btn>";
    str+="<button type=button class=\'btn btn-primary btn-block\' id=more_info_btn onclick=\"App.buy("+id+");\">"+"Buy"+"</button></div></div></div><hr>";
  	return str;
  },
  render: async function() {
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
      }
    });
    var instance = await App.contracts.EstateToken.deployed();
    var noOfTokens = await instance.noOfTokens();
    noOfTokens = noOfTokens.toNumber();
    var tokenListDiv = $("#container1");
    tokenListDiv.empty();
    console.log(noOfTokens);
    for (var i = 0; i < noOfTokens; i++) {
      var token = await instance.tokens(i);
      var propId = token[0];
      var boughtAtValuePerSqFt = token[1];
      var sellValPerSqFt = token[2]; // 0 implies not to sell
      var rentValPerSqFtPerDay = token[3]; // 0 implies not set
      var property = await instance.props(propId);
      var name = property[0];
      var sqft = property[1];
      var img = property[5];
      var owner = await instance.token2Owner(i);
      if(!(owner.toUpperCase() === App.account.toUpperCase())) {
        var entity = App.makeEntity(img, name, "Image", sellValPerSqFt, sqft, i)
        tokenListDiv.append(entity);
      }
    }
  },
  buy: function(_tokenId) {
    console.log("buy " + _tokenId);
    var inst;
    App.contracts.EstateToken.deployed().then(function(_instance) {
        inst = _instance;
        return _instance.tokens(_tokenId);
    }).then(function(token) {
        var sellValPerSqFt = token[2];
        sellValPerSqFt = sellValPerSqFt.toNumber();
        console.log(sellValPerSqFt);
//        coll.buyCollectible(2,{from:web3.eth.accounts[3] ,value:web3.toWei(10,’ether’)})
//        return inst.buy(_tokenId, { from: App.account, value:sellValPerSqFt});
        return inst.buy(_tokenId, { from: App.account, value:web3.toWei(sellValPerSqFt, 'ether')});
    }).then(function(result) {
        console.log(result);
    }).catch(function(err) {
        console.log(err);
    });
  }
};
async function _init() {
    await App.init();
}
$(window).on('load', function(){
//  await App.init();
    _init();
});