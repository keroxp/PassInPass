(function(){
  var pip = {
    capRegex: /[A-Z]/,
    smlRegex: /[a-z]/,
    numRegex: /[0-9]/,
    alphabets: "qwertyuiopasdfghjklzxcvbnm",
    numerics: "1234567890",
    // 0 ~ nのランダムな数字を返す
    rand: function(n){return Math.floor(Math.random()*n)},
    // -n ~ nのランダムな数字を返す
    rand2: function(n){return Math.floor((-1+Math.random()*2)*n)},
    // 与えられた配列から任意の個数をランダムに抽出した配列を返す
    randomPick: function(list, count){
      var ret = [];
      var len = list.length;
      for (var i = 0, max = count; i < count; ++i){
        ret.push(list[this.rand(len)]);
      }
      return ret;
    },
    // 与えられた文字を大文字、小文字、数字、記号のどれかかを返す
    getCharType: function(c) {
      if (c.match(this.capRegex)){
        return "capital";
      }else if (c.match(this.numRegex)){
        return "number";
      }else if(c.match(this.smlRegex)){
        return "small";
      }else{
        return "symbol";
      }
    },
    // 与えられた文字と同タイプのランダムな文字を返す
    swapSameTypeChar: function(c) {
      switch(this.getCharType(c)){
      case "capital":
        return this.randomPick(this.alphabets,1)[0].toUpperCase();
      case "number":
        return this.randomPick(this.numerics,1)[0];
      case "small":
        return this.randomPick(this.alphabets,1)[0];
      default:
        return c;
      }
    },
    // 与えられた文字列に任意の回数ランダムなソルトを挿入する
    addSalt: function(str, count) {
      var ret = str.split("");
      var chars = (this.alphabets+this.numerics).split("");
      for (var i = 0 , max = count, len = str.length; i < max; ++i){
        ret.splice(this.rand(len), 0, this.randomPick(chars,1)[0]);
      }
      return ret.join("");
    },
    // 与えられた数字を最大幅に+-で揺らす
    viberate: function(num, w) {
      if (!num) num = 0;
      if (!w) w = 0;
      var ret = num + this.rand2(w);
      return ret > 0 ? ret : num;
    },
    // 与えられた文字列からcountだけレーベンシュタイン距離が離れた文字列を返す
    levstr: function(str, count) {
      var ret = str.split("");
      for (var i = 0 , len = str.length, max = count; i < count; ++i){
        var idx = this.rand(len);
        ret[idx] = this.swapSameTypeChar(ret[idx]);
      }
      return ret.join("");
    },
    calcStrength: function(strength){
      return Math.ceil(Math.pow(2,strength/10)/10);
    },
    type1: function(pass, strength){
      // 文字の出現頻度を元にしたランダム文字列タイプ
      var self = this;
      var components = _.countBy(pass.split(""), function (c){
        return self.getCharType(c);
      });
      console.log(components);
      var smls, caps, nums, dummy;
      var passtring = [pass];
      for (var i = 0, max = 10 + this.calcStrength(strength); i < max; ++i){
        smls = this.randomPick(this.alphabets, 1 + this.viberate(components.small,3));
        caps = _.map(this.randomPick(this.alphabets, 1 + this.viberate(components.capital,3)), function(s){
          return s.toUpperCase()
        });
        nums = this.randomPick(this.numerics, 1 + this.viberate(components.number,3));
        dummy = Array.prototype.concat.call([], smls, caps, nums);
        passtring.push(_.shuffle(dummy).join(""));
      }
      var output = _.shuffle(passtring).join("");
      return output;
    },
    type2: function(pass, strength){
      // 編集距離ベースの文字列を生成するタイプ
      var self = this;
      var ret = [pass];
      for (var i = 0 , max = 10 + this.calcStrength(strength); i < max; ++i){
        ret.push(this.levstr(this.addSalt(pass, this.rand(3)), this.rand(10)));
      }
      var out = _.shuffle(ret).join("");
      return out;
    }
  }
  window.pip = pip;
  $(function(){
    $("#submit").on("click", function(e){
      e.preventDefault()
      var pass = $("#password").val();
      var type = parseInt($("#type").val());
      if (pass !== $("#password-confirm").val()){
        alert("passwords doesn't match.")
        return;
      }
      var strength = $("#strength").val();
      console.log("pas -> "+pass+", strength -> "+strength+"}");
      // パスを解析して
      var output;
      switch(type){
      case 1:
        output = pip.type1(pass,strength);
        break;
      case 2:
        output = pip.type2(pass,strength);
        break;
      }
      $("#output").val(output);
    });
  })
}).call(this);
