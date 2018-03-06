/**
 * Created by: Luojinghui/luojinghui424@gmail.com
 * Date: 2018/3/6
 * Time: 下午8:13
 */
/**
 * @author beidan
 * @description 拼图小游戏
 */
// ;(function () {
//
//
// })();
function Puzzle() {

  this.imgLikeArr = document.querySelectorAll('img');
  this.imgArr = Array.prototype.slice.call(this.imgLikeArr);

  this.box = document.getElementById("game");
}

Puzzle.prototype = {
  init: function (url, row, col) {
    var _this = this;

    this.row = parseInt(row);
    this.col = parseInt(col);
    this.image = document.createElement("img");

    this.image.src = url;

    this.image.onload = function () {
      _this.renderImg();
      _this.dragEvent();
    };
  },

  //canvas绘制图片
  renderImg: function () {
    this.col = document.getElementById("m").value || 3;
    this.row = document.getElementById("n").value || 3;
    var index = 0;

    var width = 600 / this.col;
    var height = 600 / this.row;

    this.canvas = document.getElementById('canvas');
    this.canvas.setAttribute("width", width + "px");
    this.canvas.setAttribute("height", height + "px");
    this.context = this.canvas.getContext('2d');

    for (var i = 0; i < this.row; i++) {
      for (var j = 0; j < this.col; j++) {
        this.context.drawImage(this.image, j * width, i * height , width , height, 0, 0 , width, height);
        var img = document.createElement("img");

        img.setAttribute("draggable", true);
        img.src = this.canvas.toDataURL('image/jpeg');
        img.setAttribute("id", index);
        img.setAttribute("style", "width: " +  width + "px;height: " + height + "px");

        this.box.appendChild(img);
        index++;
      }
    }

    this.imgLikeArr = document.querySelectorAll('img');
    this.imgArr = Array.prototype.slice.call(this.imgLikeArr);
  },

  //监听事件
  dragEvent: function () {
    var contain = document.getElementById('game'),
        next = document.getElementById('next'),
        play = document.getElementById("play"),
        model = document.getElementById("model"),
        _this = this;


    on(contain, 'dragstart', function (e) {
      var target = getTarget(e);

      if (target.tagName.toLowerCase() == "img") {
        e.dataTransfer.setData('id', e.target.id);
      }
    });

    on(contain, 'drop', function (ev) {
      var target = getTarget(ev);

      if (target.tagName.toLowerCase() == "img") {
        var originObj = document.getElementById(ev.dataTransfer.getData('id'));
        var cache = {
          'src': originObj.src,
          'id': originObj.id
        };
        var endObj = ev.target.querySelector('img') || ev.target;

        originObj.src = endObj.src;
        originObj.id = endObj.id;
        endObj.src = cache.src;
        endObj.id = cache.id;

        _this.isSuccess();
      }
    });

    //取消浏览器默认行为使元素可拖放.
    on(contain, 'dragover', function (ev) {
      ev.preventDefault();
    });

    on(play, "click", function(ev) {
      _this.randomImg();
    });

    on(model, "click", function(ev) {
      _this.hiddenModel();
    })
  },

  hiddenModel: function() {
    document.getElementById('model').setAttribute("class", "model hide");
  },

  //实现小块图片的随机排序
  randomImg: function () {
    var gridRow2 = document.getElementById("m").value || 3;
    var gridCol2 = document.getElementById("n").value || 3;
    var fragment = document.createDocumentFragment();
    var randomNum = Math.floor(Math.random() * 4);
    var rotate = [0, 90, 180, 270];

    if (parseInt(gridRow2) <= 1 || parseInt(gridCol2) <= 1) {
      alert("太菜了,拒绝给你玩耍");

      return;
    }

    var newOrder = this.imgArr.sort((function() {
      return Math.random() - Math.random();
    }));

    newOrder.forEach(function (val) {
      fragment.appendChild(val);
    });

    this.box.appendChild(fragment);
    this.box.setAttribute("style", "transform: rotate(" + rotate[randomNum] + "deg)")
  },

  //遮罩层
  showModel: function () {
    document.getElementById('model').setAttribute("class", "model");
  },

  //判断游戏是否完成
  isSuccess: function () {
    var imgLikeArr = document.querySelectorAll('img'),
        imgArr = Array.prototype.slice.call(imgLikeArr),
        len = imgArr.length, i,
        flag = true, _this = this;

    for (i = 0; i < len; i++) {
      if (imgArr[i].id != i) {
        flag = false;
      }
    }

    if (flag) {
      setTimeout(function () {
        _this.showModel();
      }, 200);
    }
  }
};

//事件代理
function on(ele, type, handler) {
  if (ele.addEventListener) {
    return ele.addEventListener(type, handler, false);
  } else if (ele.attachEvent) {
    return ele.attachEvent('on' + type, function () {
      handler.call(ele);
    });
  } else {
    return ele['on' + type] = handler;
  }
}

function getTarget(e) {
  var getEvent = e || window.event;
  return getEvent.target || getEvent.srcElement;
}

//调用
var puzzle = new Puzzle();