
/*
ajax({
    url: "", //请求地址
    type: 'get',   //请求方式
    data: { name: 'zhangsan', age: '23', email: '2372734044@qq.com' }, //请求json参数
    async: false,   //是否异步
    success: function (responseText) {
        //   此处执行请求成功后的代码
    },
    fail: function (err) {
        // 此处为执行成功后的代码
    }
}); */

function Ajax(obj) {
	let xhr = new XMLHttpRequest();
	xhr.withCredentials = true; //携带cookie
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status >= 200 && xhr.status <= 300) {
				obj.success(xhr.responseText);
			} else {
				obj.fail(xhr.status);
			}
		}
	};

  if (obj.type == 'get') {
    let message = getParmer(obj.data);
    xhr.open("get", obj.url + "?" + message, obj.async);
    xhr.send(null);
  }

	}

	function getParmer(data) {
		var arr = [];
		for (var thing in data) {
			arr.push(encodeURIComponent(thing) + '=' + encodeURIComponent(data[thing]));
		}
		return arr.join('&');
	}


function promiseAjax(obj) {
	return new Promise((reslove, reject) => {
		obj.success = (responseText) => {
			let json = JSON.parse(responseText);
      reslove(responseText);
		};
		obj.fail = (err) => {
			reject(err);
		}
		Ajax(obj);
	});
}
let output = {
  Ajax: Ajax,
  promiseAjax: promiseAjax
}
module.exports.output = output;