/*
 * 复用部分
 * /

/* header抽出的原因在于，作为一个定量，如果某时发生变动，不需要每一处都要修改一遍 */
window.JALI_HEADERS =  {
  'Content-Type': 'application/json',
  'Authorization': "Bearer " + getStorage('sessiontoken'),
  'User-Agent': 'web/1.0.0 Channel/Pc-jali',
  'Accept-Language': 'zh-CN'
}

function Result(dataJson, jqDom) {
  this.data = JSON.parse(dataJson);
  this.jqDom = jqDom;
}
Result.prototype.isSuccess = function() {
  return this.data.code == 0;
}
Result.prototype.iterRender = function(genStrProc) {
  for (var i = 0; i < this.data.data.post.length; i++) {
    this.jqDom.append(genStrProc(this.data.data.post[i]));
  }
}

/* 原函数主体将修改为 */
function position_name(nameId) {
    $.ajax({
            type: "get",
            url: "http://corp.jaliyun.com/corp/post/name/"+getStorage('corpid') + "/" + "10000002",
//                    url: "http://corp.jaliyun.com/corp/post/name/" + getStorage('corpid') + "/" + parm_id,
            headers: JALI_HEADERS,
            async: true,
            data: {},
            success: function (dataJson, status) {
              result = new Result(dataJson, $(nameId))
              if (result.isSuccess()) {
                console.log('成功');
                result.iterRender(function(obj){
                  return '<option value="' + obj.id + '">' + obj.name + '</option>';
                })
              }
              else {
                  console.log('失败');
              }
            }
        }
    )
}


// 或者更进一步
function get_proc_gen(proc_name,url,data,iterRenderProc) {
  window[proc_name] = function(nameId) {
    $.ajax({
      type: "get",
      url: url,
      headers: JALI_HEADERS,
      async: true,
      data: data, 
      success: function (dataJson, status) {
        result = new Result(dataJson, $(nameId))
        if (result.isSuccess()) {
          console.log('成功');
          result.iterRender(iterRenderProc)
        }
        else {
            console.log('失败');
        }
      }
    
    }) 
  }
}
get_proc_gen(
  "position_name",
  "http://corp.jaliyun.com/corp/post/name/"+getStorage('corpid') + "/" + "10000002",
  {},
  function(obj){return '<option value="' + obj.id + '">' + obj.name + '</option>';}
)
