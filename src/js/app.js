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
      // Instantiate a new truffle contract from the artifact
      App.contracts.EstateToken = TruffleContract(estateToken);
      // Connect provider to interact with contract
      App.contracts.EstateToken.setProvider(App.web3Provider);
      App.listenForEvents();
      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
//    App.contracts.EstateToken.deployed().then(function(instance) {
//      // Restart Chrome if you are unable to receive this event
//      // This is a known issue with Metamask
//      // https://github.com/MetaMask/metamask-extension/issues/2393
//      instance.votedEvent({}, {
//        fromBlock: 0,
//        toBlock: 'latest'
//      }).watch(function(error, event) {
//        console.log("event triggered", event)
//        // Reload when a new vote is recorded
//        App.render();
//      });
//    });
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
      return instance.candidatesCount();
    }).then(function(candidatesCount) {
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();

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
