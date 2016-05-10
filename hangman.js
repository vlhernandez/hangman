$( document ).ready(function() {
  var word = "";
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

  function getWord() {
    $.ajax({
      url: "http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&minCorpusCount=5&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=8&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5",
      type: "GET",
      data: {},
      dataType: "json",

     success: function(data) {
        word = data.word;
        console.log('word is...', word);

        data = data.word.split("");

        data.forEach(function(val, indx) {
          wordObj[indx] = {val, guessed: false};
        })
        $.each(data, function(idx, letter) {
          $("#word").append("<div idx="+idx+" class=letter></div>");
        })

      },

    error: function(err) {alert(err);}
    })
  }

  /********************************

   FETCH A WORD

  *********************************/
  $("button").click(function( event ) {
    resetGame();
    getWord();
    $(this).hide();
    $(this).fadeOut();
  });



  /********************************

    CONTROL KEYBOARD ENTRY BUTTONS
    - determine which letter was clicked
    - disable background color on hover
    - disable ability to click again
    - call function to check for letter in word

  *********************************/
  $(".key").on("click", function( event ) {
    var guessIs= $(this).html();

    $(this).off(); //don't allow anymore clicks
    $(this).fadeTo("fast", 0.25);
    $(this).removeClass("enabled");

    checkWord(guessIs);
  });



  /********************************

    CHECK FOR GUESSED LETTER IN WORD
    - if letter exists in word
      - call function to reveal letters
    - if letter does not exit in word
       - call function to reveal a body part

  *********************************/
  function checkWord(letter) {
    var letterInWord = false;
    for (var key in wordObj) {
      if ( letter === wordObj[key].val ) {
        wordObj[key].guessed = true;
        letterInWord = true;
        revealLetter(key, letter);
      }
    }
    if ( !letterInWord ) {
      revealBodyPart();
    }
  }


  /********************************

    REVEAL CORRECT GUESSED LETTER

  *********************************/
  function revealLetter(indx, letter) {
    $("[idx='"+ indx +"']").html(letter);
  };


  /********************************

    REVEAL BODY PART

  *********************************/
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

  /********************************

    GAME OVER

  *********************************/
  function gameOver() {
   $("#letters").children().children().removeClass("enabled");
   $("#letters").children().children().off();

    $("#frame").append("<p id='game-over'>GAME OVER</p>")

    $("#man").children().removeClass("hidden");

    for (letter in wordObj) {
      if ( wordObj[letter].guessed === false ) {
        revealLetter(letter, wordObj[letter].val);
        $("[idx='"+letter+"']").addClass("missed");
      }
    }
    playagain();
  }

function playagain() {
  $("button").show();
  $("button").html("Play Again?");
  $("button").fadeIn();
}

function resetGame() {
  var word = "";
  var wordObj = {};
  var missedCnt = 0;
  $("#key").addClass("enabled");
  $("#word").empty();
}

});
