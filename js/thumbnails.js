window.onload = initPage;
function initPage(){
	//找到thumbnails所在的页面
	thumbs = document.getElementById("thumbnailPane").getElementsByTagName("img");
	//thumbnailPane是CSS中制定页面样式时用的id
	for(var i=0;i<thumbs.length;i++){//对每一个多略图完成一次处理
		image = thumbs[i];
		image.onclick = function(){
			//点击一个图像时，利用该图像标题来得出详细图像的URL
			detailURL = 'images/' + this.title + '-detail.jpg';
			document.getElementById("itemDetail").src = detailURL;
			//点击一个缩略图会改变详细图像的src属性，然后浏览器会显示这个新图像
			getDetails(this.title);
		}
	}
}

function createRequest(){//一旦createRequest()开始工作，就不需要担心不同的类型，只需调用createRequest(),并把返回值赋给一个变量就可以了。
	try{//XMLHttpRequest是大多数浏览器对请求对象的叫法，可以把它发送到服务器并从服务器得到响应而无须重新加载整个页面
		request = new XMLHttpRequest();//创建一个请求对象，不过这不一定适用于所有浏览器类型
	}catch(tryMS){//第一种方法失败，所以再尝试使用另外一种不同类型的对象，
	try{
		request = new ActiveXObject("Msxml2.XMLHTTP");//ActiveXObject是微软特定的一众变成对象。他有两个不同的版本，由不同的浏览器分别支持。
	}catch(otherMS){//第二种也失败，所以再尝试另外一种类型
		try{
			request = new ActiveXObject("Microsoft.XMLHTTP");//XMLHTTP只是对象的类型，可以讲变量命名为喜欢的人和名字，通常使用request作为变量名。
		}catch(failed){
			request = null;//如果代码运行到这里，证明所有类型都不合适，返回一个null，使调用代码知道出现了一个问题
		}
	}
	}
	return request;//这会返回一个请求对象，或者如果所有类型都不合适则返回“null”
}
//getDetails所做的第一件事就是调用createRequset得到一个请求对象。不过必须确保这个对象却是已经创建
function getDetails(itemName){//目录页面中每个图像的onclick时间处理程序调用在这个函数，并传入被点击的img元素的title属性，就是该图像所表示的商品的名字
	request = createRequest();//得到一个请求对象的一个实例，并把它赋给变量"request"
	if(request == null){//如果createRequest()无法得到一个请求对象，他会返回null，所以如果进入这部分代码，就说明出了问题。我们将为用户显示一个错误，并退出这个函数
		alert("无法创建请求");
		return;
	}
	//42行配置请求
	var url = "getDetails.php?ImageID=" + escape(itemName);//escape()负责处理请求URL字符串可能有问题的字符
	//42行代码告诉请求对象要调用的URL，这里还随之发送了商品服务器知道要发送什么商品的信息
	request.open("GET",url,true);//displayDetails属性的值应当是一个函数名，一旦服务器对请求给出应答就要运行这个函数
	// open()方法初始化链接
	request.onreadystatechange = displayDetails;//设置回调函数，它会在服务器响应时“回调”
	//准确来说displayDetails只是一个函数的引用，而不是调用，所以应确保不要在函数名后面加上括号
	//onreadystatechange只是请求对象的另外一个属性，可以在代码中设置
	request.send(null);//发送请求
	//null说明没有随请求发送额外的数据
}

function displayDetails(){
	if(request.readyState == 4){
		if(request.status == 200){
			detailDiv = document.getElementById("description");
			detailDiv.innerHTML = request.responseText;
		}
	}
}