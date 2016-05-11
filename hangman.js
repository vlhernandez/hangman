$( document ).ready(function() {
    var wordObj = {};
    var missedCnt = 0;
    var man = {
      0: "lt-leg",
      1: "rt-leg",
      2: "body",
      3: "lt-arm",
      4: "rt-arm",
      5: "head"
    };

    getWord();
    enableKeyboard();


    function getWord() {
      $.ajax({
        url: "http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&minCorpusCount=5&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=8&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5",
        type: "GET",
        data: {},
        dataType: "json",

       success: function(data) {
         console.log("Got Word:", data.word);
          setupGame(data.word);
        },

      error: function(err) {alert(err);}
      })
    }


    function setupGame(word) {
      var patt = /[a-zA-Z]/;
      word = word.toLowerCase().split("")

      word.forEach(function(val, indx) {
        $("#word").append("<div idx="+indx+" class=letter></div>");
        if ( patt.test(val) ) {
          wordObj[indx] = {val, guessed: false};
        }
        else {
          wordObj[indx] = {val, guessed: true};
          revealLetter(indx, val);
        }
      });
    }


    function enableKeyboard() {
      $(".key").removeClass("disabled");
      $(".key").addClass("enabled");

      //start listener
      $(".key").on("click", function( event ) {
        var guessedLetter= $(this).html();

        $(this).off("click"); //don't allow anymore clicks
        $(this).removeClass("enabled");
        $(this).addClass("disabled");

        checkWord(guessedLetter);
      });
    }


    /********************************

      CHECK FOR GUESSED LETTER IN WORD
      - if letter exists in word
        - call function to reveal letters
      - if letter does not exit in word
         - call function to reveal a body part

    *********************************/
    function checkWord(letter) {
      var letterInWord = false;
      var winner = true;

      for (var key in wordObj) {
        if ( letter === wordObj[key].val ) {
          wordObj[key].guessed = true;
          letterInWord = true;
          revealLetter(key, letter);
        }
      }

      if ( !letterInWord ) {
        revealBodyPart();
      } else {
        // check if that was the winning guess
        for (var prop in wordObj) {
          if ( wordObj[prop].guessed === false) {
            winner = false;
          }
        }
        if ( winner ) {
          gameOver( winner );
        }
      }
    }



    function revealLetter(indx, letter) {
      $("[idx='"+ indx +"']").html(letter);
    };



    function revealBodyPart() {
      var showPart = man[missedCnt];

      if ( missedCnt === 6 ) {
        console.log("game over")
        gameOver();
        return;
      }

      $("#"+showPart).removeClass("hidden");

      missedCnt++;
    }


    function gameOver(winner) {
      // turn off game keyboard
      $("#letters").children().children().removeClass("enabled");
      $("#letters").children().children().off();
      $(".overlay").toggle();
      $(".play-again").toggle();

      if (winner) {
        $(".winner").toggle();

      }
      else {
        $(".loser").toggle();
        $("#man").children().removeClass("hidden");

        for (letter in wordObj) {
          if ( wordObj[letter].guessed === false ) {
            revealLetter(letter, wordObj[letter].val);
            $("[idx='"+letter+"']").addClass("missed");
          }
        }
      }

      wannaPlayAgain();
    }


    function wannaPlayAgain() {
      $("button").toggle();
    }



    function resetGame() {
      wordObj = {};
      missedCnt = 0;

      $("#word").empty();
      $("#man").children().addClass("hidden");
      $(".overlay").toggle();
      $(".play-again").toggle();
      $(".winner").hide();
      $(".loser").hide();
    }


    /********************************

      SET UP LISTENERS

    *********************************/
    $(".hint").click(function( event ) {
      $(".hint").css("visibility", "hidden");
    });

    $(".play-again").click(function( event  ) {
      resetGame();
      getWord();
      enableKeyboard();
    })

});
