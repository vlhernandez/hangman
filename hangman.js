$( document ).ready(function() {
  function getWord() {
    var word = $.ajax({
      url: "http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&minCorpusCount=5&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=8&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5",
      type: "GET",
      data: {},
      dataType: "json",

     success: function(data) {
        var wordObj = {};

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

     return word;
  }


  $("button").click(function( event ) {
     alert("Yay! You clicked me! Getting your word");
     getWord();
  });
});
