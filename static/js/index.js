var objList = [];

function readText(){
    objList = [];
    var text = document.getElementById('inarea').value;
    var table = text.split(/\n\s*\n/);
    for(i=0;i<table.length;i++){
        var row = table[i].split(/[(\r\n)\r\n]+/);//分割每行
        var dataObj = new Object();
        /*var dataObj = {
          id : "",
          name : "",
          desc : "",
          parentId : "",
        }*/
        dataObj.name = row[0].split(/：/)[1];
        dataObj.id = String(i);
        dataObj.parentId = null;
        objList.push(dataObj);
        for(j=1;j<row.length;j++){
            var dataObj = new Object();
            var gAndD = row[j].split(/：/)[0];//年级和学位
            var stu = row[j].split(/：/)[1].split(/、/);//学生
            dataObj.id = String(i)+String(j);
            dataObj.name = gAndD;
            dataObj.parentId = String(i);
            objList.push(dataObj);
            for(k=0;k<stu.length;k++){
                var dataObj = new Object(); 
                dataObj.id = String(i)+String(j)+String(k);
                dataObj.name = stu[k];
                dataObj.parentId = String(i)+String(j);
                objList.push(dataObj);
            }
        }
    }
}




function creatTree(){
    
    var data =objList/*[
        {
            id: '1',
            name: "name",
            desc: "这是一个描述",
            parentId:null,
        }
    ]
    
    data[0] = {
        id: '244',
        name: "mmmm",
        desc: "这是一个描述_sub3",
        parentId:null,
    }*/

    
    $("input.tree-btn").show();
    
    $(function () {
        $('#tree_table').bootstrapTable({
            class: 'table table-hover table-bordered',
            data: data,
            sidePagination: 'server',
            pagination: false,
            treeView: true,
            treeId: "id",
            treeField: "name",
            rowAttributes: function (row, index) {
                return {
                    xx:index
                };
            },
            queryParams : function(params) {
                var param = {
                    roleId : 'xx'
                };
                return param;
            },
            columns: [{
                checkbox:true
            },{
                field: 'name',
                title: '名称',
            },
            {
                field: 'desc',
                title: '详情',
            },
            ]
        });
        $("#expandAllTree").on('click',function(){
            $('#tree_table').bootstrapTable("expandAllTree")
        })
        $("#collapseAllTree").on('click',function(){
            $('#tree_table').bootstrapTable("collapseAllTree")
        })
    });
}


function clearText(){
    location.reload();
}



//背景
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var cw = canvas.width = window.innerWidth,
  cx = cw / 2;
var ch = canvas.height = window.innerHeight,
  cy = ch / 2;

ctx.fillStyle = "#000";
var linesNum = 16;
var linesRy = [];
var requestId = null;

function Line(flag) {
  this.flag = flag;
  this.a = {};
  this.b = {};
  if (flag == "v") {
    this.a.y = 0;
    this.b.y = ch;
    this.a.x = randomIntFromInterval(0, ch);
    this.b.x = randomIntFromInterval(0, ch);
  } else if (flag == "h") {
    this.a.x = 0;
    this.b.x = cw;
    this.a.y = randomIntFromInterval(0, cw);
    this.b.y = randomIntFromInterval(0, cw);
  }
  this.va = randomIntFromInterval(25, 100) / 100;
  this.vb = randomIntFromInterval(25, 100) / 100;

  this.draw = function() {
    ctx.strokeStyle = "#ccc";
    ctx.beginPath();
    ctx.moveTo(this.a.x, this.a.y);
    ctx.lineTo(this.b.x, this.b.y);
    ctx.stroke();
  }

  this.update = function() {
    if (this.flag == "v") {
      this.a.x += this.va;
      this.b.x += this.vb;
    } else if (flag == "h") {
      this.a.y += this.va;
      this.b.y += this.vb;
    }

    this.edges();
  }

  this.edges = function() {
    if (this.flag == "v") {
      if (this.a.x < 0 || this.a.x > cw) {
        this.va *= -1;
      }
      if (this.b.x < 0 || this.b.x > cw) {
        this.vb *= -1;
      }
    } else if (flag == "h") {
      if (this.a.y < 0 || this.a.y > ch) {
        this.va *= -1;
      }
      if (this.b.y < 0 || this.b.y > ch) {
        this.vb *= -1;
      }
    }
  }

}

for (var i = 0; i < linesNum; i++) {
  var flag = i % 2 == 0 ? "h" : "v";
  var l = new Line(flag);
  linesRy.push(l);
}

function Draw() {
  requestId = window.requestAnimationFrame(Draw);
  ctx.clearRect(0, 0, cw, ch);

  for (var i = 0; i < linesRy.length; i++) {
    var l = linesRy[i];
    l.draw();
    l.update();
  }
  for (var i = 0; i < linesRy.length; i++) {
    var l = linesRy[i];
    for (var j = i + 1; j < linesRy.length; j++) {
      var l1 = linesRy[j]
      Intersect2lines(l, l1);
    }
  }
}

function Init() {
  linesRy.length = 0;
  for (var i = 0; i < linesNum; i++) {
    var flag = i % 2 == 0 ? "h" : "v";
    var l = new Line(flag);
    linesRy.push(l);
  }

  if (requestId) {
    window.cancelAnimationFrame(requestId);
    requestId = null;
  }

  cw = canvas.width = window.innerWidth,
    cx = cw / 2;
  ch = canvas.height = window.innerHeight,
    cy = ch / 2;

  Draw();
};

setTimeout(function() {
  Init();

  addEventListener('resize', Init, false);
}, 15);

function Intersect2lines(l1, l2) {
  var p1 = l1.a,
    p2 = l1.b,
    p3 = l2.a,
    p4 = l2.b;
  var denominator = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
  var ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denominator;
  var ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denominator;
  var x = p1.x + ua * (p2.x - p1.x);
  var y = p1.y + ua * (p2.y - p1.y);
  if (ua > 0 && ub > 0) {
    markPoint({
      x: x,
      y: y
    })
  }
}

function markPoint(p) {
  ctx.beginPath();
  ctx.arc(p.x, p.y, 2, 0, 2 * Math.PI);
  ctx.fill();
}

function randomIntFromInterval(mn, mx) {
  return ~~(Math.random() * (mx - mn + 1) + mn);
}