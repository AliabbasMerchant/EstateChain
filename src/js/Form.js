var _web3Provider= null;
  var _contracts= {};
  var _account= '0x0';
  async function init() {
    return await initWeb3();
  }
  async function initWeb3() {
    if (typeof web3 !== 'undefined') {
      _web3Provider = web3.currentProvider;
    } else {
      _web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(_web3Provider);
    return await initContract();
  }
  async function initContract() {
    $.getJSON("EstateToken.json", function(estateToken) {
      _contracts.EstateToken = TruffleContract(estateToken);
      _contracts.EstateToken.setProvider(_web3Provider);
      return render();
    });
  }
  async function render() {
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        _account = account;
      }
    });
    }

  async function newProp() {
    var name = document.getElementById("nameTB").value;
    var main = document.getElementById("addressTB").value;
    var sqft = document.getElementById("areaTB").value;
    var cval = document.getElementById("cvalueTB").value;
    var sval = document.getElementById("svalueTB").value;
    var rent = document.getElementById("rentTB").value;
    var image = document.getElementById("imageTB").value;
      _contracts.EstateToken.deployed().then(function(_instance) {
          return _instance.newProperty(name, main, parseInt(sqft), parseInt(cval), parseInt(sval), parseInt(rent), image);
      }).then(function(result) {
          console.log(result);
      }).catch(function(err) {
          console.log(err);
      });
  }
    async function ownerShare() {
      var a = document.getElementById("MOSPTB").value;
      a = parseInt(a);
      console.log(a);

      _contracts.EstateToken.deployed().then(function(_instance) {
          return _instance.setMainOwnerSharePercentage(a);
      }).then(function(result) {
          console.log(result);
      }).catch(function(err) {
          console.log(err);
      });
    }
  async function pptyTax() {
        var a = document.getElementById("pspTB").value;
        a = parseInt(a);
        console.log(a);

        _contracts.EstateToken.deployed().then(function(_instance) {
            return _instance.setPropertyTaxPercentage(a);
        }).then(function(result) {
            console.log(result);
        }).catch(function(err) {
            console.log(err);
        });
  }
async function _init() {
    await init();
}
$(window).on('load', function(){
    _init();
});