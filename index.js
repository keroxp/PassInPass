(function(){
  $(function(){
    $("#submit").on("click", function(e){
      e.preventDefault()
      var pas = $("#password").val();
      if (pas !== $("#password-confirm").val()){
        alert("passwords doesn't match.")
        return;
      }
      var strength = $("#strength").val();
      console.log("pas -> "+pas+", strength -> "+strength+"}");
      // パスを解析して
      var capRegex = /[A-Z]/;
      var smlRegex = /[a-z]/;
      var numRegex = /[0-9]/;
      var alphabets = "qwertyuiopasdfghjklzxcvbnm";
      var numerics = "1234567890";
      var components = _.countBy(pas.split(""), function (s){
        if (s.match(capRegex)){
          return "capital";
        }else if (s.match(numRegex)){
          return "number";
        }else if(s.match(smlRegex)){
          return "small";
        }else{
          return "symbol";
        }
      });
      console.log(components);
      var rand = function(r){return Math.floor(Math.random()*r)};
      var rand2 = function(r){return Math.floor((-1+Math.random()*2)*r)}
      var randomPick = function(list, count){
        var ret = [];
        var len = list.length;
        for (var i = 0, max = count; i < count; ++i){
          ret.push(list[rand(len)]);
        }
        return ret;
      };
      var smls, caps, nums, dummy;
      var passtring = [pas];
      var viberate = function(num, w) {
        if (!num) num = 0;
        if (!w) w = 0;
        var ret = num + rand2(w);
        return ret > 0 ? ret : num;
      };
      for (var i = 0, max = 10 + Math.ceil(Math.pow(2,strength/10)/10); i < max; ++i){
        smls = randomPick(alphabets, 1 + viberate(components.small,3));
        caps = _.map(randomPick(alphabets, 1 + viberate(components.capital,3)), function(s){return s.toUpperCase()});
        nums = randomPick(numerics, 1 + viberate(components.number,3));
        dummy = Array.prototype.concat.call([], smls, caps, nums);
        passtring.push(_.shuffle(dummy).join(""));
      }
      var output = _.shuffle(passtring).join("");
      $("#output").val(output);
    });
  })
}).call(this);
