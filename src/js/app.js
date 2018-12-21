App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  // todo more state variables
  init: function() {
    return App.initWeb3();
  },
  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },
  initContract: function() {
    $.getJSON("EstateToken.json", function(estateToken) {
      App.contracts.EstateToken = TruffleContract(estateToken);
      App.contracts.EstateToken.setProvider(App.web3Provider);
      return App.render();
    });
  },
  render: function() {
    var instance;
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
      }
    });
    App.contracts.EstateToken.deployed().then(function(instance) {
      instance = instance;
      return instance.tokens.call();
    }).then(function(tokens) {
      var tokenListDiv = $("#container1");
      tokenListDiv.empty();
      for (var i = 1; i <= candidatesCount; i++) {
        instance.candidates(i).then(function(candidate) {
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];

          // Render candidate Result
          var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
          candidatesResults.append(candidateTemplate);

          // Render candidate ballot option
          var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
          candidatesSelect.append(candidateOption);
        });
      }
      return instance.voters(App.account);
    }).then(function(hasVoted) {
      // Do not allow a user to vote
      if(hasVoted) {
        $('form').hide();
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },
  castVote: function() {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.EstateToken.deployed().then(function(instance) {
      return instance.vote(candidateId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
