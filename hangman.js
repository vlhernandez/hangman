$( document ).ready(function() {
    var wordObj = {};
    var missedCnt = 0;
    var man = {
      0: "lt-leg",
      1: "rt-leg",
      2: "torso",
      3: "lt-arm",
      4: "rt-arm",
      5: "head"
    };

    function getWord() {
      $.ajax({
        url: "http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&minCorpusCount=5&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=8&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5",
        type: "GET",
        data: {},
        dataType: "json",

       success: function(data) {
          setupGame(data.word);
          getDefinition(data.word);
        },

      error: function(err) {alert('There was an error fetching the word: ', err);}
      })
    }


    function getDefinition(word) {
      $.ajax({
        url:"http://api.wordnik.com:80/v4/word.json/"+word+"/definitions?limit=200&includeRelated=false&sourceDictionaries=all&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5",
        type: "GET",
        data: {},
        dataType: "json",

       success: function(data) {
         storeDefinition(data[0].partOfSpeech, data[0].text)
        },

      error: function(err) {alert('There was an error getting the definition: ', err);}
      })

    }


    function setupGame(word) {
      var patt = /[a-zA-Z]/;
      wordObj.info = {word: word};
      word = word.toLowerCase().split("")

      word.forEach(function(val, indx) {
        if ( patt.test(val) ) {
        $(".word").append("<div idx="+indx+" class='letter'></div>");
          wordObj[indx] = {val, guessed: false};
        }
        else {
        $(".word").append("<div idx="+indx+" class='letter symbol'></div>");
          wordObj[indx] = {val, guessed: true};
          revealLetter(indx, val);
        }
      });
    }


    function storeDefinition(partOfSpeech, definition) {
      wordObj.info= { partOfSpeech: partOfSpeech, definition: definition };
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
        updateScore();
        gameOver();
        return;
      }

      $("."+showPart).removeClass("hidden");

      missedCnt++;
      updateScore();
    }


    function gameOver(winner) {
      // turn off game keyboard
      $(".keyboard").children().children().removeClass("enabled");
      $(".keyboard").children().children().off();
      $(".overlay").toggle();
      $(".play-again").toggle();

      if (winner) {
        $(".winner").toggle();

      }
      else {
        $(".loser").toggle();
        $(".man").children().removeClass("hidden");

        for (letter in wordObj) {
          if ( wordObj[letter].guessed === false ) {
            revealLetter(letter, wordObj[letter].val);
            $("[idx='"+letter+"']").addClass("missed");
          }
        }
      }

    }


    function resetGame() {
      wordObj = {};
      missedCnt = 0;

      $(".word").empty();
      $(".man").children().addClass("hidden");
      $(".overlay").toggle();
      $(".play-again").toggle();
      $(".winner").hide();
      $(".loser").hide();
      resetHint();
      getWord();
      enableKeyboard();
      updateScore();
    }


    function revealHint() {
      $(".hint").off("click");
      $(".partOfSpeech").text("Part of speech:  "+wordObj.info.partOfSpeech);
      $(".definition").text("Defintion:  "+wordObj.info.definition);
      $(".hint-text").text("");
      revealBodyPart();
    }


    function resetHint() {
      $(".partOfSpeech").text("");
      $(".definition").text("");
      $(".hint-text").text("Trade a turn for a hint");
      $(".hint").on("click", revealHint);
    }


    function updateScore() {
      $(".score").text(missedCnt+"/7")
    }


    /********************************

      SET UP LISTENERS

    *********************************/
    $(".play-again").click(resetGame);



    /********************************

      START THE GAME!!

    *********************************/
    getWord();
    enableKeyboard();
    resetHint();
});
