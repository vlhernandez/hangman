$( document ).ready(function() {
  var word = "";
  var wordObj = {};

  function getWord() {
    return $.ajax({
      url: "http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&minCorpusCount=5&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=8&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5",
      type: "GET",
      data: {},
      dataType: "json",

     success: function(data) {

        data = data.word.split("");

        data.forEach(function(val, indx) {
          wordObj[indx] = {val, guessed: false};
        })
        console.log("wordobj...", wordObj)
        $.each(data, function(idx, letter) {
          $("#word").append("<div idx="+idx+" class=letter>"+letter+"</div>");
        })

      },

    error: function(err) {alert(err);}
    })
  }


  $("button").click(function( event ) {
     console.log("Getting your word");
     word = getWord();
     console.log("word is...", word);
  });

  $(".key").on("click", function( event ) {
    var theLetterIs= $(this).html();
    console.log("You clicked on: ",theLetterIs);
    $(this).off(); //don't allow anymore clicks
    $(this).fadeTo("fast", 0.5, function() {
      console.log("complete keyboard key fadeout");
    });
    checkWord(theLetterIs);
  });


  function checkWord(letter) {
    console.log("in check word");
    console.log("word object is...", wordObj);
    for (var key in wordObj) {
      if (letter === wordObj[key].val) {
        console.log("found that letter...", letter)
        wordObj[key].guessed = true;
        findTheLetter(key);
      }
    }
    console.log("word object is...", wordObj);
  }

  function findTheLetter(indx) {
    ($("[idx='"+ indx +"']")).css("background-color", "lightgreen");
  };
});
