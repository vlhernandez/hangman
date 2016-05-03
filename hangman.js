$( document ).ready(function() {
  function getWord() {
    var word = $.ajax({
      url: "http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&minCorpusCount=5&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5",
      type: "GET",
      data: {},
      dataType: "json",
      success: function(data) {
        console.log("word is...", data);
        data = data.word.split("")
        // data = data.map(function(val, indx) {
        //   return "$("+indx+").text("+val+")";
        // })
        console.log("data is...", data)
        $.each(data, function(idx, letter) {
          $("#word").append("<div idx="+idx+">"+letter+"</div>");

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


  function splitWord(word) {
    return word.word.split("");
  };

  function makeDivs(wordArr) {
    wordArr.map(function(val, indx) {
      return "$("+indx+").text("+val+")";
    })
  };
});
