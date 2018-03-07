/**
 * Created by: Luojinghui/luojinghui424@gmail.com
 * Date: 2018/3/7
 * Time: 下午3:20
 */

;(function () {
  let Puzzle = {
    init(img) {
      let clientWidth = document.documentElement.clientWidth;
      let phone = clientWidth <= 940;

      this.state = {
        firstIn: true,                //页面是否是初次渲染
        isPhone: phone,                //是否是手机模式
        clientWidth: clientWidth,
        data: []
      };

      this.vImage = document.createElement("img");
      this.vImage.setAttribute("crossOrigin",'Anonymous');
      this.vImage.src = img;
      this.vImage.onload = () => {
        this.findDom();                 //获取所有Dom
        this.preview(img);              //预览图片
        this.bindEvent();               //绑定监听事件
      }
    },

    //预览图片
    preview(img) {
      this.vImage = document.createElement("img");
      this.vImage.setAttribute("crossOrigin",'Anonymous');
      this.vImage.src = img;


      this.box.appendChild(this.vImage);
    },

    findDom() {
      this.box = document.getElementById("game");
      this.eleRow = document.getElementById("m");
      this.eleCol = document.getElementById("n");
      this.canvas = document.getElementById("canvas");
      this.play = document.getElementById("play");
      this.model = document.getElementById("model");
      this.input = document.getElementById("inputImg");
      this.rotate = document.getElementById("rotate");
    },

    //绑定（拖动，点击）事件
    bindEvent() {
      this._on(this.box, "dragstart", (e) => {
        let target = this._getTarget(e);

        if (target.tagName.toLowerCase() === "img") {
          e.dataTransfer.setData("id", e.target.id);
        }
      });

      this._on(this.box, "drop", (e) => {
        let target = this._getTarget(e);

        if (target.tagName.toLowerCase() === "img") {

          let originObj = document.getElementById(e.dataTransfer.getData("id"));
          let temp = {
            "src": originObj.src,
            "id": originObj.id
          };
          let allImg = e.target.querySelector("img") || e.target;

          originObj.src = allImg.src;
          originObj.id = allImg.id;
          allImg.src = temp.src;
          allImg.id = temp.id;

          this.onSuccess();
        }
      });

      this._on(this.box, "dragover", (e) => {
        e.preventDefault();
      });

      this._on(this.play, "click", (e) => {
        this.onPlay(e);
      });

      this._on(this.model, "click", () => {
        this.hiddenModel();
      });

      this._on(this.input, "change", (file) => {
        this.uploadImg(file);
      })
    },

    //开始游戏
    onPlay() {
      let col = this.eleCol.value || 3;
      let row = this.eleRow.value || 3;
      let {clientWidth, isPhone, data} = this.state;
      let index = 0;
      let realWidth = !isPhone ? Math.floor((600 / col)) : Math.floor((clientWidth - 30) / col);
      let realHeight = !isPhone ? Math.floor((600 / row)) : Math.floor((clientWidth - 30) / row);
      isPhone && this.box.setAttribute("style", "width:" + (clientWidth - 30) + "px; height: " + (clientWidth - 30) + "px;");

      this.canvas.setAttribute("width", realWidth + "px");
      this.canvas.setAttribute("height", realHeight + "px");
      this.context = this.canvas.getContext('2d');

      if (parseInt(col) <= 1 || parseInt(row) <= 1) {
        alert("太菜了,拒绝给你玩耍");

        return;
      }

      data = [];
      for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
          this.context.drawImage(this.vImage, j * realWidth, i * realHeight, realWidth, realHeight, 0, 0, realWidth, realHeight);

          data[index] = {
            id: index,
            src: this.canvas.toDataURL('image/jpeg'),
            width: realWidth,
            height: realHeight
          };

          index++;
        }
      }

      this.randomImg(data);
    },

    //将图片数组随机打乱，然后渲染到页面上
    randomImg(arr) {
      let newData = arr.sort(() => Math.random() - Math.random());
      let fragment = document.createDocumentFragment();
      let randomNum = Math.floor(Math.random() * 4);
      let rotate = [0, 90, 180, 270];
      let img;
      let rotateNum = rotate[randomNum];

      newData.forEach((val) => {
        img = document.createElement("img");
        img.setAttribute("draggable", true);
        img.src = val.src;
        img.setAttribute("id", val.id);
        img.setAttribute("class", "img");
        img.setAttribute("style", "width: " + val.width + "px;height: " + val.height + "px");

        fragment.appendChild(img);
      });

      this.box.innerHTML = "";
      this.box.appendChild(fragment);
      if(rotateNum === 0) {
        this.rotate.innerText = "没有旋转";
      } else {
        this.rotate.innerText = `旋转${rotateNum}度`;
      }
      this.box.setAttribute("style", "transform: rotate(" + rotateNum + "deg)")
    },

    //上传图片，并预览图片
    uploadImg(file) {
      let target = file.target;
      if (target.files && target.files[0]) {
        let reader = new FileReader();

        reader.onload = (evt) => {
          this.box.innerText = "";

          this.preview(evt.target.result);
        };

        reader.readAsDataURL(target.files[0]);
      }
    },

    //每执行一步检测是否复原图片。
    onSuccess() {
      let likeArrImg = document.querySelectorAll(".img");
      let imgs = Array.prototype.slice.call(likeArrImg);
      let len = imgs.length;
      let flag = true;

      for (let i = 0; i < len; i++) {
        if (parseInt(imgs[i].id) !== i) {
          flag = false;
        }
      }

      if (flag) {
        this.showModal();
      }
    },

    //显示成功后的蒙版
    showModal() {
      this.model.setAttribute("class", "model");
    },

    //隐藏蒙版
    hiddenModel() {
      this.model.setAttribute("class", "model hide");
    },

    //事件绑定
    _on(ele, type, fun) {
      if (ele.addEventListener) {
        return ele.addEventListener(type, fun, false);
      } else if (ele.attachEvent) {
        return ele.attachEvent("on" + type, () => {
          fun.call(ele);
        })
      } else {
        return ele["on" + type] = fun;
      }
    },

    //获取元素信息
    _getTarget(e) {
      let getEvent = e || window.event;

      return getEvent.target || getEvent.srcElement;
    },

    //移除监听事件绑定
    _remove(ele, type, fun) {
      if (ele.removeEventListener) {
        ele.removeEventListener(type, fun, false);
      } else if (ele.detachEvent) {
        ele.detachEvent("on" + type, fun);
      } else {
        ele["on" + type] = null;
      }
    }
  };

  //初始化游戏，加入默认图片。
  // Puzzle.init("./assets/imgs/test.jpg");
  Puzzle.init("http://ol5l1z7pa.bkt.clouddn.com/test.jpg");
})();